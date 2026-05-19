"use client";

import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  RefreshCcw,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SalesFilterBar } from "@/components/dashboard/sales/sales-filter-bar";
import { SalesTable } from "@/components/dashboard/sales/sales-table";
import { VoiceAssistantPanel } from "@/components/dashboard/sales/voice-assistant-panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type SaleWriteInput,
  type SalesListItem,
  type VoiceSaleDraftEntry,
  type VoiceSaleJob,
  useCancelVoiceJobMutation,
  useConfirmVoiceJobMutation,
  useCreateTelegramLinkCodeMutation,
  useCreateVoiceJobMutation,
  useCreateSaleMutation,
  useDeleteSaleMutation,
  useGetTelegramLinkStatusQuery,
  useGetSaleProductSuggestionsQuery,
  useGetSalesQuery,
  useGetVoiceJobsQuery,
  useRetryVoiceJobMutation,
  useUpdateSaleMutation,
} from "@/store/api";
import { useEntitlements } from "@/features/subscriptions/use-entitlements";

export type SortFilter = "newest" | "oldest" | "totalHigh" | "totalLow";

interface SalesRecordWorkspaceProps {
  currency?: string;
}

interface RecordForm {
  productName: string;
  category: string;
  quantity: string;
  price: string;
  soldAt: string;
}

interface DraftEntryForm {
  productName: string;
  category: string;
  quantity: string;
  price: string;
  soldAt: string;
  confidence: number;
  notes: string;
}

const pageSize = 8;

function formatDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function toDateInput(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function mapDraftToForm(entry: VoiceSaleDraftEntry): DraftEntryForm {
  return {
    productName: entry.productName,
    category: entry.category,
    quantity: String(entry.quantity),
    price: String(entry.price),
    soldAt: toDateInput(entry.soldAt),
    confidence: entry.confidence,
    notes: entry.notes ?? "",
  };
}

function serializePayload(form: RecordForm): SaleWriteInput | null {
  const price = Number(form.price);
  const quantity = Number(form.quantity);
  const soldAtDate = new Date(form.soldAt);

  if (
    !form.productName.trim()
    || !form.category.trim()
    || Number.isNaN(price)
    || Number.isNaN(quantity)
    || Number.isNaN(soldAtDate.getTime())
  ) {
    return null;
  }

  return {
    productName: form.productName.trim(),
    category: form.category.trim(),
    price,
    quantity,
    soldAt: soldAtDate.toISOString(),
  };
}

function productSyncNotice(action?: "created" | "unchanged" | "suggestion_created" | "suggestion_exists") {
  if (!action) return null;
  if (action === "created") return "Product catalog updated: new product was created automatically.";
  if (action === "suggestion_created" || action === "suggestion_exists") {
    return "Product mismatch detected. Review pending update in Product Management.";
  }
  return null;
}

// Sales workspace is the day-to-day transaction screen that feeds analytics and reports.
export function SalesRecordWorkspace({ currency = "USD" }: SalesRecordWorkspaceProps) {
  const entitlements = useEntitlements();
  const voiceInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<BlobPart[]>([]);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortFilter>("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<SalesListItem | null>(null);
  const [customProductName, setCustomProductName] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [draftRows, setDraftRows] = useState<DraftEntryForm[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecorderSupported, setIsRecorderSupported] = useState(true);
  const [voiceJobModalOpen, setVoiceJobModalOpen] = useState(false);
  const [form, setForm] = useState<RecordForm>({
    productName: "",
    category: "",
    quantity: "1",
    price: "0",
    soldAt: new Date().toISOString().slice(0, 10),
  });

  const {
    data: salesResponse,
    isFetching,
    refetch,
  } = useGetSalesQuery({
    search: search || undefined,
    category: category === "all" ? undefined : category,
    startDate: startDate ? new Date(startDate).toISOString() : undefined,
    endDate: endDate ? new Date(endDate).toISOString() : undefined,
    page: currentPage,
    limit: pageSize,
  });

  const {
    data: productSuggestions = [],
    isFetching: isProductsFetching,
  } = useGetSaleProductSuggestionsQuery({
    search: form.productName || undefined,
    limit: 30,
  });

  const [createSale, { isLoading: isCreating }] = useCreateSaleMutation();
  const [updateSale, { isLoading: isUpdating }] = useUpdateSaleMutation();
  const [deleteSale, { isLoading: isDeleting }] = useDeleteSaleMutation();
  const [createVoiceJob, { isLoading: isCreatingVoiceJob }] = useCreateVoiceJobMutation();
  const [confirmVoiceJob, { isLoading: isConfirmingVoiceJob }] = useConfirmVoiceJobMutation();
  const [retryVoiceJob, { isLoading: isRetryingVoiceJob }] = useRetryVoiceJobMutation();
  const [cancelVoiceJob, { isLoading: isCancellingVoiceJob }] = useCancelVoiceJobMutation();
  const [createTelegramLinkCode] = useCreateTelegramLinkCodeMutation();
  const canUseVoice = entitlements.canAccess("voice.input");
  const canUseTelegram = entitlements.canAccess("telegram.notify");

  const { data: telegramLinkStatus } = useGetTelegramLinkStatusQuery(undefined, {
    skip: !canUseTelegram,
  });
  const {
    data: voiceJobsResponse,
    isFetching: isVoiceJobsFetching,
  } = useGetVoiceJobsQuery(
    { page: 1, limit: 12 },
    {
      skip: !canUseVoice,
      pollingInterval: 5000,
    },
  );

  const voiceJobs = useMemo(() => voiceJobsResponse?.items ?? [], [voiceJobsResponse?.items]);
  const selectedVoiceJob: VoiceSaleJob | null = useMemo(() => {
    if (!selectedJobId) {
      return voiceJobs[0] ?? null;
    }
    return voiceJobs.find((job) => job.id === selectedJobId) ?? null;
  }, [selectedJobId, voiceJobs]);

  useEffect(() => {
    const supported = typeof window !== "undefined"
      && typeof window.MediaRecorder !== "undefined"
      && !!navigator.mediaDevices?.getUserMedia;
    setIsRecorderSupported(supported);
  }, []);

  useEffect(() => {
    if (!selectedVoiceJob) {
      setDraftRows([]);
      return;
    }
    setDraftRows(selectedVoiceJob.draftEntries.map(mapDraftToForm));
  }, [selectedVoiceJob]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set((salesResponse?.items ?? []).map((item) => item.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [salesResponse?.items]);

  const sortedRows = useMemo(() => {
    const rows = [...(salesResponse?.items ?? [])];

    return rows.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.soldAt).getTime() - new Date(a.soldAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.soldAt).getTime() - new Date(b.soldAt).getTime();
      }
      const totalA = a.price * a.quantity;
      const totalB = b.price * b.quantity;
      return sortBy === "totalHigh" ? totalB - totalA : totalA - totalB;
    });
  }, [salesResponse?.items, sortBy]);

  const hasActiveFilters = Boolean(search || category !== "all" || startDate || endDate || sortBy !== "newest");

  const productOptions = useMemo(() => {
    const map = new Map<string, { name: string; category: string; price: number }>();
    for (const suggestion of productSuggestions) {
      map.set(suggestion.name, {
        name: suggestion.name,
        category: suggestion.category,
        price: suggestion.price,
      });
    }
    if (editingSale && !map.has(editingSale.productName)) {
      map.set(editingSale.productName, {
        name: editingSale.productName,
        category: editingSale.category,
        price: editingSale.price,
      });
    }
    return Array.from(map.values());
  }, [productSuggestions, editingSale]);

  const openCreateModal = () => {
    setEditingSale(null);
    setCustomProductName("");
    setForm({
      productName: "",
      category: "",
      quantity: "1",
      price: "0",
      soldAt: new Date().toISOString().slice(0, 10),
    });
    setOpen(true);
  };

  const openEditModal = (item: SalesListItem) => {
    setEditingSale(item);
    setCustomProductName("");
    setForm({
      productName: item.productName,
      category: item.category,
      quantity: String(item.quantity),
      price: String(item.price),
      soldAt: toDateInput(item.soldAt),
    });
    setOpen(true);
  };

  const handleProductSelect = (value: string) => {
    if (value === "__custom") {
      setForm((prev) => ({ ...prev, productName: "" }));
      return;
    }

    const selected = productOptions.find((item) => item.name === value);
    if (!selected) return;

    setForm((prev) => ({
      ...prev,
      productName: selected.name,
      category: selected.category,
      price: String(selected.price),
    }));
  };

  const handleSave = async () => {
    const effectiveName = customProductName.trim() || form.productName;
    const payload = serializePayload({
      ...form,
      productName: effectiveName,
    });

    if (!payload) {
      toast.error("Please complete all fields correctly before saving.");
      return;
    }

    try {
      if (editingSale) {
        const response = await updateSale({ id: editingSale.id, body: payload }).unwrap();
        const notice = productSyncNotice(response.productSync?.action);
        if (notice) toast.success(notice);
      } else {
        const response = await createSale(payload).unwrap();
        const notice = productSyncNotice(response.productSync?.action);
        if (notice) toast.success(notice);
      }
      toast.success(editingSale ? "Sale updated successfully" : "Sale recorded successfully");
      setOpen(false);
      void refetch();
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Unable to save sales record.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSale(id).unwrap();
      toast.success("Sale record deleted successfully.");
      void refetch();
    } catch {
      toast.error("Unable to delete sales record.");
    }
  };

  const exportCsv = () => {
    const header = ["Product", "Category", "Quantity", "Price", "Total", "Date"];
    const lines = sortedRows.map((row) => [
      row.productName,
      row.category,
      row.quantity,
      row.price.toFixed(2),
      (row.price * row.quantity).toFixed(2),
      formatDate(row.soldAt),
    ]);
    const csv = [header, ...lines].map((line) => line.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sales-records.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const stopRecordingStream = () => {
    recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
    recordingStreamRef.current = null;
  };

  const uploadVoiceFile = async (file: File) => {
    const created = await createVoiceJob({ file }).unwrap();
    setSelectedJobId(created.id);
    toast.success("Voice captured. Transcription and extraction are running.");
    setVoiceJobModalOpen(true);
  };

  const onClickVoiceUpload = () => {
    voiceInputRef.current?.click();
  };

  const onVoiceFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadVoiceFile(file);
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Unable to process voice input right now.");
    } finally {
      event.target.value = "";
    }
  };

  const onStartRecording = async () => {
    if (!isRecorderSupported || isCreatingVoiceJob || isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingStreamRef.current = stream;
      recordingChunksRef.current = [];
      const preferredMime = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
      ].find((type) => MediaRecorder.isTypeSupported(type));

      const recorder = preferredMime
        ? new MediaRecorder(stream, { mimeType: preferredMime })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        toast.error("Recording failed. Please try again.");
      };

      recorder.onstop = async () => {
        const blob = new Blob(recordingChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        stopRecordingStream();
        setIsRecording(false);

        if (!blob.size) {
          toast.error("No audio captured. Please record again.");
          return;
        }

        const extension = recorder.mimeType.includes("mp4") ? "m4a" : "webm";
        const file = new File([blob], `voice-record-${Date.now()}.${extension}`, {
          type: recorder.mimeType || "audio/webm",
        });

        try {
          await uploadVoiceFile(file);
        } catch (error) {
          const message = (error as { data?: { message?: string } })?.data?.message;
          toast.error(message || "Unable to process recorded voice.");
        }
      };

      recorder.start(300);
      setIsRecording(true);
    } catch (error) {
      const message = error instanceof DOMException
        ? error.name === "NotAllowedError"
          ? "Microphone access was blocked. Allow microphone permission for this site and try again."
          : error.message
        : error instanceof Error
          ? error.message
          : "Microphone permission denied.";
      toast.error(message);
      stopRecordingStream();
      setIsRecording(false);
    }
  };

  const onStopRecording = () => {
    if (!isRecording) return;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      return;
    }
    setIsRecording(false);
    stopRecordingStream();
  };

  const onGenerateTelegramCode = async () => {
    try {
      const result = await createTelegramLinkCode().unwrap();
      window.open(result.deepLinkUrl, "_blank", "noopener,noreferrer");
      toast.success(
        `Connecting Telegram... if Telegram didn't open, use /link ${result.code} (expires ${formatDate(result.expiresAt)}).`,
      );
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Unable to generate Telegram link code.");
    }
  };

  const onDraftChange = (index: number, field: keyof DraftEntryForm, value: string | number) => {
    setDraftRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index
          ? {
            ...row,
            [field]: value,
          }
          : row,
      ),
    );
  };

  const onConfirmDrafts = async () => {
    if (!selectedVoiceJob) return;

    const entries = draftRows.map((row) => ({
      productName: row.productName.trim(),
      category: row.category.trim(),
      quantity: Number(row.quantity),
      price: Number(row.price),
      soldAt: new Date(row.soldAt).toISOString(),
      confidence: Number(row.confidence),
      notes: row.notes.trim() || null,
    }));

    try {
      const result = await confirmVoiceJob({
        id: selectedVoiceJob.id,
        body: {
          entries,
        },
      }).unwrap();
      const hasSuggestions = (result.productSync?.suggestionCreated ?? 0) + (result.productSync?.suggestionExists ?? 0) > 0;
      const hasCreated = (result.productSync?.created ?? 0) > 0;
      if (hasSuggestions) {
        toast.warning("Draft sales saved. Some product updates need review in Product Management.");
      } else if (hasCreated) {
        toast.success("Draft sales saved. New products were added to Product Management.");
      } else {
        toast.success("Draft sales confirmed and added to your records.");
      }
      void refetch();
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Unable to confirm draft entries.");
    }
  };

  const onRetryVoiceJob = async () => {
    if (!selectedVoiceJob) return;
    try {
      await retryVoiceJob(selectedVoiceJob.id).unwrap();
      toast.success("Retry started. Please wait for extraction.");
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Unable to retry extraction.");
    }
  };

  const onCancelVoiceJob = async () => {
    if (!selectedVoiceJob) return;
    try {
      await cancelVoiceJob(selectedVoiceJob.id).unwrap();
      toast.success("Voice job cancelled.");
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Unable to cancel voice job.");
    }
  };

  return (
    <section className="dashboard-surface overflow-hidden">
      <SalesFilterBar
        search={search}
        setSearch={setSearch}
        categories={categories}
        category={category}
        setCategory={setCategory}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setCurrentPage={setCurrentPage}
        exportCsv={exportCsv}
        openCreateModal={openCreateModal}
        isLoading={isFetching}
        hasRows={sortedRows.length > 0}
        totalEntries={salesResponse?.meta.total || 0}
      />

      <VoiceAssistantPanel
        canUseVoice={canUseVoice}
        canUseTelegram={canUseTelegram}
        telegramLinkStatus={telegramLinkStatus || null}
        selectedVoiceJob={selectedVoiceJob}
        isVoiceJobsFetching={isVoiceJobsFetching}
        openJobWindow={() => setVoiceJobModalOpen(true)}
        onGenerateTelegramCode={onGenerateTelegramCode}
        onVoiceFileSelected={onVoiceFileSelected}
        onClickVoiceUpload={onClickVoiceUpload}
        isRecording={isRecording}
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
        voiceInputRef={voiceInputRef}
        entitlements={entitlements}
        formatDate={(d) => new Date(d).toLocaleString("en-US")}
      />

      <SalesTable
        sortedRows={sortedRows}
        isLoading={isFetching}
        currency={currency || "USD"}
        isDeleting={isDeleting}
        openEditModal={openEditModal}
        handleDelete={handleDelete}
        currentPage={currentPage}
        pageSize={pageSize}
        totalEntries={salesResponse?.meta.total || 0}
        hasNextPage={salesResponse?.meta.hasNextPage || false}
        isFetching={isFetching}
        setCurrentPage={setCurrentPage}
        hasActiveFilters={hasActiveFilters}
      />

      <Dialog open={voiceJobModalOpen} onOpenChange={setVoiceJobModalOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[96vh] max-w-[960px] overflow-y-auto rounded-[var(--radius-panel)] border border-border/80 bg-card p-0 shadow-[var(--shadow-overlay)]"
        >
          <DialogHeader className="flex-row items-center justify-between border-b border-border/80 bg-[color:var(--surface-subtle)] px-6 py-4 text-left">
            <DialogTitle className="dashboard-panel-title">Voice Conversion Job</DialogTitle>
            <button
              type="button"
              onClick={() => setVoiceJobModalOpen(false)}
              aria-label="Close voice conversion job"
              className="dashboard-icon-button"
            >
              <X className="size-5" />
            </button>
          </DialogHeader>
          <div className="space-y-4 px-6 py-5">
            {selectedVoiceJob ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="dashboard-status-neutral rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em]">
                    {selectedVoiceJob.status}
                  </span>
                  {selectedVoiceJob.status === "failed" ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void onRetryVoiceJob()}
                      disabled={isRetryingVoiceJob}
                    >
                      <RefreshCcw className="size-3.5" />
                      Retry
                    </Button>
                  ) : null}
                  {selectedVoiceJob.status !== "reviewed" ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => void onCancelVoiceJob()}
                      disabled={isCancellingVoiceJob}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>

                {selectedVoiceJob.failureReason ? (
                  <p className="rounded-[calc(var(--radius-control)-4px)] border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                    {selectedVoiceJob.failureReason}
                  </p>
                ) : null}

                <div>
                  <p className="dashboard-field-label">Transcript</p>
                  <div className="max-h-32 overflow-auto rounded-[calc(var(--radius-panel)-6px)] border border-border/80 bg-[color:var(--surface-subtle)] p-3 text-sm text-muted-foreground">
                    {selectedVoiceJob.transcriptText || "Transcript not ready yet."}
                  </div>
                </div>

                <div>
                  <p className="dashboard-field-label">Extracted Sales Drafts</p>
                  {draftRows.length === 0 ? (
                    <p className="rounded-[calc(var(--radius-panel)-6px)] border border-dashed border-border/90 bg-[color:var(--surface-subtle)] px-3 py-4 text-sm text-muted-foreground">
                      No draft entries yet. Wait for extraction or retry.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {draftRows.map((row, index) => (
                        <div
                          key={`${selectedVoiceJob.id}-draft-${index}`}
                          className="grid gap-2 rounded-[calc(var(--radius-panel)-6px)] border border-border/80 p-3 md:grid-cols-6"
                        >
                          <Input
                            value={row.productName}
                            onChange={(event) => onDraftChange(index, "productName", event.target.value)}
                            placeholder="Product"
                            className="h-10 md:col-span-2"
                          />
                          <Input
                            value={row.category}
                            onChange={(event) => onDraftChange(index, "category", event.target.value)}
                            placeholder="Category"
                            className="h-10"
                          />
                          <Input
                            value={row.quantity}
                            type="number"
                            min={1}
                            onChange={(event) => onDraftChange(index, "quantity", event.target.value)}
                            placeholder="Qty"
                            className="h-10"
                          />
                          <Input
                            value={row.price}
                            type="number"
                            min={0}
                            step="0.01"
                            onChange={(event) => onDraftChange(index, "price", event.target.value)}
                            placeholder="Price"
                            className="h-10"
                          />
                          <Input
                            value={row.soldAt}
                            type="date"
                            onChange={(event) => onDraftChange(index, "soldAt", event.target.value)}
                            className="h-10"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    className="px-4"
                    disabled={draftRows.length === 0 || isConfirmingVoiceJob}
                    onClick={() => void onConfirmDrafts()}
                  >
                    {isConfirmingVoiceJob ? "Saving..." : "Confirm to Sales Records"}
                  </Button>
                </div>
              </>
            ) : (
              <p className="rounded-[calc(var(--radius-panel)-6px)] border border-dashed border-border/90 bg-[color:var(--surface-subtle)] px-3 py-4 text-sm text-muted-foreground">
                No current job selected yet.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[96vh] max-w-[800px] overflow-y-auto rounded-[var(--radius-panel)] border border-border/80 bg-card p-0 shadow-[var(--shadow-overlay)]"
        >
          <DialogHeader className="flex-row items-center justify-between border-b border-border/80 bg-[color:var(--surface-subtle)] px-6 py-4 text-left">
            <DialogTitle className="dashboard-panel-title text-[1.45rem]">
              {editingSale ? "Update Sales Record" : "Add New Sales Record"}
            </DialogTitle>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="dashboard-icon-button"
            >
              <X className="size-6" />
            </button>
          </DialogHeader>

          <div className="dashboard-form-grid px-6 py-6">
            <section className="dashboard-form-section">
              <div className="space-y-1">
                <p className="dashboard-form-section-title">Sale details</p>
                <p className="dashboard-form-helper">
                  Record the product, quantity, and sale date clearly so analytics and reports stay trustworthy.
                </p>
              </div>
              <div className="grid gap-2.5">
              <label className="text-sm font-semibold text-foreground" htmlFor="product-select">
                Product Name
              </label>
              <Select value={form.productName || "__custom"} onValueChange={handleProductSelect}>
                <SelectTrigger
                  id="product-select"
                  size="lg"
                  className="text-base"
                >
                  <SelectValue placeholder={isProductsFetching ? "Loading products..." : "Select product"} />
                </SelectTrigger>
                <SelectContent>
                  {productOptions.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="__custom">Custom product...</SelectItem>
                </SelectContent>
              </Select>
              {form.productName === "" ? (
                <Input
                  value={customProductName}
                  onChange={(event) => setCustomProductName(event.target.value)}
                  placeholder="Type custom product name"
                  size="lg"
                  className="text-base placeholder:text-muted-foreground"
                />
              ) : null}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="category">
                  Category
                </label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                  size="lg"
                  className="text-base"
                />
              </div>
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="quantity">
                  Quantity
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
                  size="lg"
                  className="text-base"
                />
              </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="price">
                  Price
                </label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                  size="lg"
                  className="text-base placeholder:text-muted-foreground"
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="date">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={form.soldAt}
                  onChange={(event) => setForm((prev) => ({ ...prev, soldAt: event.target.value }))}
                  size="lg"
                  className="text-base"
                />
              </div>
              </div>
            </section>

            <div className="dashboard-inline-feedback dashboard-inline-feedback-info">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Catalog sync</p>
                <p>
                  Saving a sale can create a product automatically or send a product mismatch to Product Management for review.
                </p>
              </div>
            </div>

            <div className="dashboard-form-actions">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                className="px-7 text-base"
                onClick={() => void handleSave()}
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? "Saving..." : "Save Record"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

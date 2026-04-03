"use client";

import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Download,
  Link2,
  Mic,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Square,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

type SortFilter = "newest" | "oldest" | "totalHigh" | "totalLow";

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

function formatMoney(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
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

function formatRecordingDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function productSyncNotice(action?: "created" | "unchanged" | "suggestion_created" | "suggestion_exists") {
  if (!action) return null;
  if (action === "created") return "Product catalog updated: new product was created automatically.";
  if (action === "suggestion_created" || action === "suggestion_exists") {
    return "Product mismatch detected. Review pending update in Product Management.";
  }
  return null;
}

export function SalesRecordWorkspace({ currency = "USD" }: SalesRecordWorkspaceProps) {
  const voiceInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<BlobPart[]>([]);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortFilter>("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<SalesListItem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [customProductName, setCustomProductName] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceSuccess, setVoiceSuccess] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [draftRows, setDraftRows] = useState<DraftEntryForm[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
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
    isLoading,
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
  const [createTelegramLinkCode, { isLoading: isGeneratingLinkCode }] = useCreateTelegramLinkCodeMutation();

  const { data: telegramLinkStatus } = useGetTelegramLinkStatusQuery();
  const {
    data: voiceJobsResponse,
    isFetching: isVoiceJobsFetching,
  } = useGetVoiceJobsQuery(
    { page: 1, limit: 12 },
    {
      pollingInterval: 5000,
    },
  );

  const voiceJobs = voiceJobsResponse?.items ?? [];
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
  }, [selectedVoiceJob?.id, selectedVoiceJob?.draftEntries]);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
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
    setFormError(null);
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
    setFormError(null);
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
    setFormError(null);
    const effectiveName = customProductName.trim() || form.productName;
    const payload = serializePayload({
      ...form,
      productName: effectiveName,
    });

    if (!payload) {
      setFormError("Please complete all fields correctly before saving.");
      return;
    }

    try {
      if (editingSale) {
        const response = await updateSale({ id: editingSale.id, body: payload }).unwrap();
        const notice = productSyncNotice(response.productSync?.action);
        if (notice) {
          setVoiceSuccess(notice);
          setVoiceError(null);
        }
      } else {
        const response = await createSale(payload).unwrap();
        const notice = productSyncNotice(response.productSync?.action);
        if (notice) {
          setVoiceSuccess(notice);
          setVoiceError(null);
        }
      }
      setOpen(false);
      void refetch();
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      setFormError(message || "Unable to save sales record.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSale(id).unwrap();
      void refetch();
    } catch {
      // Keep UI silent for now; table refetch preserves consistency.
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
    setVoiceSuccess("Voice captured. Transcription and extraction are running.");
    setVoiceError(null);
    setVoiceJobModalOpen(true);
  };

  const onClickVoiceUpload = () => {
    setVoiceError(null);
    setVoiceSuccess(null);
    voiceInputRef.current?.click();
  };

  const onVoiceFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadVoiceFile(file);
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      setVoiceError(message || "Unable to process voice input right now.");
      setVoiceSuccess(null);
    } finally {
      event.target.value = "";
    }
  };

  const onStartRecording = async () => {
    if (!isRecorderSupported || isCreatingVoiceJob || isRecording) return;
    setVoiceError(null);
    setVoiceSuccess(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingStreamRef.current = stream;
      recordingChunksRef.current = [];
      setRecordingSeconds(0);

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
        setVoiceError("Recording failed. Please try again.");
      };

      recorder.onstop = async () => {
        const blob = new Blob(recordingChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        stopRecordingStream();
        setIsRecording(false);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }

        if (!blob.size) {
          setVoiceError("No audio captured. Please record again.");
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
          setVoiceError(message || "Unable to process recorded voice.");
          setVoiceSuccess(null);
        }
      };

      recorder.start(300);
      setIsRecording(true);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Microphone permission denied.";
      setVoiceError(message);
      setVoiceSuccess(null);
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
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    stopRecordingStream();
  };

  const onGenerateTelegramCode = async () => {
    try {
      const result = await createTelegramLinkCode().unwrap();
      window.open(result.deepLinkUrl, "_blank", "noopener,noreferrer");
      setVoiceSuccess(
        `Connecting Telegram... if Telegram didn't open, use /link ${result.code} (expires ${formatDate(result.expiresAt)}).`,
      );
      setVoiceError(null);
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      setVoiceError(message || "Unable to generate Telegram link code.");
      setVoiceSuccess(null);
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
        setVoiceSuccess("Draft sales saved. Some product updates need review in Product Management.");
      } else if (hasCreated) {
        setVoiceSuccess("Draft sales saved. New products were added to Product Management.");
      } else {
        setVoiceSuccess("Draft sales confirmed and added to your records.");
      }
      setVoiceError(null);
      void refetch();
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      setVoiceError(message || "Unable to confirm draft entries.");
      setVoiceSuccess(null);
    }
  };

  const onRetryVoiceJob = async () => {
    if (!selectedVoiceJob) return;
    try {
      await retryVoiceJob(selectedVoiceJob.id).unwrap();
      setVoiceSuccess("Retry started. Please wait for extraction.");
      setVoiceError(null);
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      setVoiceError(message || "Unable to retry extraction.");
      setVoiceSuccess(null);
    }
  };

  const onCancelVoiceJob = async () => {
    if (!selectedVoiceJob) return;
    try {
      await cancelVoiceJob(selectedVoiceJob.id).unwrap();
      setVoiceSuccess("Voice job cancelled.");
      setVoiceError(null);
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      setVoiceError(message || "Unable to cancel voice job.");
      setVoiceSuccess(null);
    }
  };

  return (
    <section className="dashboard-surface overflow-hidden border-[#e7e9ee] shadow-none">
      <input
        ref={voiceInputRef}
        type="file"
        accept="audio/*,video/*"
        className="hidden"
        onChange={(event) => {
          void onVoiceFileSelected(event);
        }}
      />

      <div className="border-b border-[#edf1f5] bg-[#fbfcfd] px-6 py-4 md:px-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#344054]">Voice to Sales Assistant</p>
            <p className="mt-1 text-sm text-[#667085]">
              Record your sale in real time or link Telegram via <code>/link &lt;code&gt;</code> to generate drafts automatically.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl border-[#dfe3e8] px-4 text-sm text-[#344054]"
              onClick={onGenerateTelegramCode}
              disabled={isGeneratingLinkCode}
            >
              <Link2 className="size-4" />
              {telegramLinkStatus?.linked ? "Reconnect Telegram" : "Connect Telegram"}
            </Button>
            <Button
              type="button"
              className={`h-10 rounded-xl px-4 text-sm text-white ${
                isRecording
                  ? "bg-[#b42318] hover:bg-[#912018]"
                  : "bg-[#0f172a] hover:bg-[#111d3a]"
              }`}
              onClick={isRecording ? onStopRecording : () => void onStartRecording()}
              disabled={isCreatingVoiceJob || (!isRecording && !isRecorderSupported)}
            >
              {isRecording ? <Square className="size-4" /> : <Mic className="size-4" />}
              {isRecording
                ? `Stop (${formatRecordingDuration(recordingSeconds)})`
                : isCreatingVoiceJob
                  ? "Processing..."
                  : "Start Recording"}
            </Button>
            {!isRecorderSupported ? (
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl border-[#dfe3e8] bg-white px-4 text-sm text-[#344054]"
                onClick={onClickVoiceUpload}
                disabled={isCreatingVoiceJob}
              >
                <Upload className="size-4" />
                Upload Audio File
              </Button>
            ) : null}
          </div>
        </div>
        {telegramLinkStatus ? (
          <p className="mt-3 text-sm text-[#667085]">
            Telegram Status:{" "}
            <span className={telegramLinkStatus.linked ? "font-semibold text-[#067647]" : "font-semibold text-[#b54708]"}>
              {telegramLinkStatus.linked ? `Linked (${telegramLinkStatus.chatId ?? "unknown"})` : "Not linked"}
            </span>
          </p>
        ) : null}
        {voiceError ? (
          <p className="mt-3 rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-sm text-[#b42318]">
            {voiceError}
          </p>
        ) : null}
        {voiceSuccess ? (
          <p className="mt-3 rounded-lg border border-[#d1fadf] bg-[#ecfdf3] px-3 py-2 text-sm text-[#067647]">
            {voiceSuccess}
          </p>
        ) : null}
      </div>

      <div className="border-b border-[#edf1f5] px-6 py-5 md:px-7">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid flex-1 gap-3 md:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-11 rounded-xl border-border bg-background/80 pl-10 text-[15px]"
                placeholder="Search records..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-11 rounded-xl border-border bg-background/80 text-[15px] text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Category: All</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 rounded-xl border border-border bg-background/80 px-3">
              <CalendarDays className="size-4 text-muted-foreground" />
              <Input
                type="date"
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background/80 px-3">
              <CalendarDays className="size-4 text-muted-foreground" />
              <Input
                type="date"
                value={endDate}
                onChange={(event) => {
                  setEndDate(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </div>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortFilter)}>
              <SelectTrigger className="h-11 rounded-xl border-border bg-background/80 text-[15px] text-foreground">
                <SelectValue />
                <ChevronDown className="size-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Sort by: Newest</SelectItem>
                <SelectItem value="oldest">Sort by: Oldest</SelectItem>
                <SelectItem value="totalHigh">Sort by: Total High</SelectItem>
                <SelectItem value="totalLow">Sort by: Total Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-11 rounded-xl border-border bg-card px-4 text-[15px] text-foreground"
              onClick={exportCsv}
              disabled={isLoading || sortedRows.length === 0}
            >
              <Download className="size-4" />
              Export
            </Button>
            <Button
              className="h-11 rounded-xl bg-primary px-5 text-[15px] text-primary-foreground hover:bg-primary/90"
              onClick={openCreateModal}
            >
              <Plus className="size-4" />
              Add Sales Record
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="bg-muted/70 text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Quantity</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70 bg-card">
            {sortedRows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-accent/25">
                <td className="px-6 py-4 text-base font-semibold text-foreground">{row.productName}</td>
                <td className="px-5 py-4 text-base text-muted-foreground">{row.category}</td>
                <td className="px-5 py-4 text-base text-muted-foreground">{row.quantity}</td>
                <td className="px-5 py-4 text-base text-muted-foreground">{formatMoney(row.price, currency)}</td>
                <td className="px-5 py-4 text-base font-semibold text-foreground">
                  {formatMoney(row.price * row.quantity, currency)}
                </td>
                <td className="px-5 py-4 text-base text-muted-foreground">{formatDate(row.soldAt)}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    Completed
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => openEditModal(row)}
                      disabled={isDeleting}
                      className="rounded-lg p-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Pencil className="size-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(row.id)}
                      disabled={isDeleting}
                      className="rounded-lg p-2 transition-colors hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-500/20 dark:hover:text-red-300"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && sortedRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-9 text-center text-sm text-muted-foreground">
                  No sale records found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-border/80 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
        <p className="text-[15px] text-muted-foreground">
          Showing {salesResponse?.meta.total ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(currentPage * pageSize, salesResponse?.meta.total ?? 0)} of {salesResponse?.meta.total ?? 0} entries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-border bg-card px-4 text-[15px] text-muted-foreground"
            disabled={currentPage <= 1 || isFetching}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Button
            className="h-10 rounded-xl bg-primary px-5 text-[15px] text-primary-foreground hover:bg-primary/90"
            disabled={!salesResponse?.meta.hasNextPage || isFetching}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="border-t border-[#edf1f5] bg-[#fbfcfd] px-6 py-6 md:px-7">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-[#101828]">Voice Conversion Job</h3>
          {isVoiceJobsFetching ? <p className="text-sm text-[#667085]">Updating...</p> : null}
        </div>
        {selectedVoiceJob ? (
          <div className="rounded-xl border border-[#e4e7ec] bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#101828]">
                  {selectedVoiceJob.sourceType === "telegram" ? "Telegram Voice/File" : "Web Voice Recording"}
                </p>
                <p className="mt-1 text-xs text-[#667085]">
                  {selectedVoiceJob.createdAt ? formatDate(selectedVoiceJob.createdAt) : "Unknown date"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#f2f4f7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-[#475467]">
                  {selectedVoiceJob.status}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-lg border-[#dfe3e8] px-3 text-xs"
                  onClick={() => setVoiceJobModalOpen(true)}
                >
                  Open Job
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-[#d0d5dd] bg-white px-4 py-6 text-sm text-[#667085]">
            No voice jobs yet. Record your first sale note or send voice in Telegram after linking your chat.
          </p>
        )}
      </div>

      <Dialog open={voiceJobModalOpen} onOpenChange={setVoiceJobModalOpen}>
        <DialogContent className="max-h-[92vh] max-w-[920px] overflow-auto rounded-2xl border border-[#e4e7ec] p-0 shadow-[0_20px_48px_rgba(15,23,42,0.18)]">
          <DialogHeader className="flex-row items-center justify-between border-b border-[#eceff3] bg-[#f9fafb] px-6 py-4 text-left">
            <DialogTitle className="text-xl font-semibold tracking-tight text-[#101828]">Voice Conversion Job</DialogTitle>
            <button
              type="button"
              onClick={() => setVoiceJobModalOpen(false)}
              className="rounded-md p-1.5 text-[#98a2b3] transition-colors hover:bg-white hover:text-[#475467]"
            >
              <X className="size-5" />
            </button>
          </DialogHeader>
          <div className="space-y-4 px-6 py-5">
            {selectedVoiceJob ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f2f4f7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-[#475467]">
                    {selectedVoiceJob.status}
                  </span>
                  {selectedVoiceJob.status === "failed" ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 rounded-lg border-[#dfe3e8] px-3 text-xs"
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
                      className="h-8 rounded-lg border-[#dfe3e8] px-3 text-xs text-[#b42318]"
                      onClick={() => void onCancelVoiceJob()}
                      disabled={isCancellingVoiceJob}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>

                {selectedVoiceJob.failureReason ? (
                  <p className="rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-sm text-[#b42318]">
                    {selectedVoiceJob.failureReason}
                  </p>
                ) : null}

                <div>
                  <p className="mb-2 text-sm font-semibold text-[#344054]">Transcript</p>
                  <div className="max-h-32 overflow-auto rounded-lg border border-[#eaecf0] bg-[#f9fafb] p-3 text-sm text-[#475467]">
                    {selectedVoiceJob.transcriptText || "Transcript not ready yet."}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-[#344054]">Extracted Sales Drafts</p>
                  {draftRows.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-[#d0d5dd] bg-[#f9fafb] px-3 py-4 text-sm text-[#667085]">
                      No draft entries yet. Wait for extraction or retry.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {draftRows.map((row, index) => (
                        <div
                          key={`${selectedVoiceJob.id}-draft-${index}`}
                          className="grid gap-2 rounded-lg border border-[#eaecf0] p-3 md:grid-cols-6"
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
                    className="h-10 rounded-xl bg-[#0f172a] px-4 text-sm text-white hover:bg-[#111d3a]"
                    disabled={draftRows.length === 0 || isConfirmingVoiceJob}
                    onClick={() => void onConfirmDrafts()}
                  >
                    {isConfirmingVoiceJob ? "Saving..." : "Confirm to Sales Records"}
                  </Button>
                </div>
              </>
            ) : (
              <p className="rounded-lg border border-dashed border-[#d0d5dd] bg-[#f9fafb] px-3 py-4 text-sm text-[#667085]">
                No current job selected yet.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[640px] overflow-hidden rounded-2xl border border-border p-0 shadow-[0_20px_48px_rgba(15,23,42,0.18)]">
          <DialogHeader className="flex-row items-center justify-between border-b border-border bg-accent/25 px-6 py-4 text-left">
            <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
              {editingSale ? "Update Sales Record" : "Add New Sales Record"}
            </DialogTitle>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              <X className="size-6" />
            </button>
          </DialogHeader>

          <div className="grid gap-4.5 px-6 py-6">
            <div className="grid gap-2.5">
              <label className="text-sm font-semibold text-foreground" htmlFor="product-select">
                Product Name
              </label>
              <Select value={form.productName || "__custom"} onValueChange={handleProductSelect}>
                <SelectTrigger
                  id="product-select"
                  className="h-12 rounded-xl border-border bg-card text-base text-foreground"
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
                  className="h-12 rounded-xl border-border bg-card text-base text-foreground placeholder:text-muted-foreground"
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
                  className="h-12 rounded-xl border-border bg-card text-base text-foreground"
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
                  className="h-12 rounded-xl border-border bg-card text-base text-foreground"
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
                  className="h-12 rounded-xl border-border bg-card text-base text-foreground placeholder:text-muted-foreground"
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
                  className="h-12 rounded-xl border-border bg-card text-base text-foreground"
                />
              </div>
            </div>

            {formError ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
                {formError}
              </p>
            ) : null}

            <div className="mt-3 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-11 rounded-xl border-border bg-card px-6 text-base text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                className="h-11 rounded-xl bg-primary px-7 text-base text-primary-foreground shadow-[0_8px_20px_rgba(15,23,42,0.18)] hover:bg-primary/90"
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

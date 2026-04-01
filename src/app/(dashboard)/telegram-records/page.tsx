"use client";

import { useMemo, useState } from "react";
import {
  FileAudio2,
  FileText,
  Filter,
  Image as ImageIcon,
  PlayCircle,
  Video,
} from "lucide-react";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { topNavItems } from "@/features/owner-dashboard/dashboard-mock";
import { useGetTelegramRecordsQuery, useGetTelegramSummaryQuery } from "@/store/api";
import type { TelegramMessageType, TelegramRecordItem } from "@/store/api/types";

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFileSize(size: number | null) {
  if (typeof size !== "number" || size <= 0) return "-";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function displayOwner(record: TelegramRecordItem) {
  if (record.fullName.trim()) return record.fullName;
  if (record.username.trim()) return `@${record.username}`;
  return "Telegram User";
}

function mediaIcon(record: TelegramRecordItem) {
  const kind = record.file.mediaKind;
  if (record.messageType === "voice" || kind === "voice" || kind === "audio")
    return <FileAudio2 className="size-4" />;
  if (kind === "video") return <Video className="size-4" />;
  if (kind === "photo") return <ImageIcon className="size-4" />;
  if (kind === "document") return <FileText className="size-4" />;
  return <PlayCircle className="size-4" />;
}

function statusTone(type: TelegramMessageType) {
  if (type === "sale") return "bg-emerald-100 text-emerald-700";
  if (type === "expense") return "bg-rose-100 text-rose-700";
  if (type === "voice") return "bg-blue-100 text-blue-700";
  return "bg-amber-100 text-amber-700";
}

export default function TelegramRecordsPage() {
  const [messageType, setMessageType] = useState<TelegramMessageType | "">("");
  const query = useMemo(
    () => ({
      page: 1,
      limit: 50,
      ...(messageType ? { messageType } : {}),
    }),
    [messageType],
  );

  const {
    data: recordsResponse,
    isLoading,
    isError,
    refetch,
  } = useGetTelegramRecordsQuery(query);
  const { data: summary } = useGetTelegramSummaryQuery();
  const records = recordsResponse?.data ?? [];

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  return (
    <main className="dashboard-shell pb-14">
      <TopNavigation items={topNavItems} />

      <div className="dashboard-container mt-10 space-y-6">
        <section className="flex flex-col gap-4 rounded-3xl border border-[#ece9e1] bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Telegram Records
            </h1>
            <p className="mt-2 text-sm text-slate-500 md:text-base">
              Voice messages and files from Telegram bot are stored and visible here.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex h-11 items-center gap-2 rounded-full border border-[#ece9e1] bg-[#fbfaf8] px-4 text-sm text-slate-600">
              <Filter className="size-4" />
              <select
                value={messageType}
                onChange={(event) =>
                  setMessageType(event.target.value as TelegramMessageType | "")
                }
                className="bg-transparent outline-none"
              >
                <option value="">All</option>
                <option value="sale">Sales</option>
                <option value="expense">Expenses</option>
                <option value="voice">Voice</option>
                <option value="file">Files</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex h-11 items-center rounded-full bg-[#d4af35] px-5 text-sm font-semibold text-[#1f2937] transition hover:bg-[#c9a62f]"
            >
              Refresh
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <div className="rounded-2xl border border-[#ece9e1] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{summary?.total ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-[#ece9e1] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Sales
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-700">{summary?.sale ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-[#ece9e1] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Expenses
            </p>
            <p className="mt-2 text-2xl font-bold text-rose-700">{summary?.expense ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-[#ece9e1] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Voice
            </p>
            <p className="mt-2 text-2xl font-bold text-blue-700">{summary?.voice ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-[#ece9e1] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Files
            </p>
            <p className="mt-2 text-2xl font-bold text-amber-700">{summary?.file ?? 0}</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-[#ece9e1] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="bg-[#f7f6f3] text-left">
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">File</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                      Loading Telegram records...
                    </td>
                  </tr>
                ) : null}

                {isError ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-rose-600">
                      Failed to load Telegram records.
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError && records.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                      No Telegram records found.
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError
                  ? records.map((record) => {
                      const contentUrl = `${apiBase}/telegram-records/${record.id}/content`;
                      const isMedia = Boolean(record.file.fileId);
                      const isAudio =
                        record.messageType === "voice" ||
                        record.file.mediaKind === "audio" ||
                        record.file.mediaKind === "voice";
                      const isVideo = record.file.mediaKind === "video";
                      const isPhoto = record.file.mediaKind === "photo";

                      return (
                        <tr
                          key={record.id}
                          className="border-t border-[#f0ede7] align-top text-sm text-slate-700"
                        >
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone(record.messageType)}`}
                            >
                              {record.messageType}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-semibold text-slate-900">{displayOwner(record)}</p>
                            <p className="text-xs text-slate-500">
                              {record.username ? `@${record.username}` : record.chatId}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-slate-900">{record.item || "-"}</p>
                            {record.amount ? (
                              <p className="text-xs text-slate-500">${record.amount.toFixed(2)}</p>
                            ) : null}
                            {record.caption ? (
                              <p className="mt-1 text-xs text-slate-500">{record.caption}</p>
                            ) : null}
                          </td>
                          <td className="px-4 py-4">
                            {isMedia ? (
                              <div className="space-y-2">
                                <div className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                                  {mediaIcon(record)}
                                  <span>{record.file.fileName || record.file.mediaKind || "file"}</span>
                                </div>
                                <p className="text-xs text-slate-500">
                                  {formatFileSize(record.file.fileSize)}
                                </p>
                                {isAudio ? (
                                  <audio controls preload="none" src={contentUrl} className="h-8 w-52" />
                                ) : null}
                                {isVideo ? (
                                  <video
                                    controls
                                    preload="metadata"
                                    src={contentUrl}
                                    className="h-28 w-44 rounded-lg border border-[#ece9e1]"
                                  />
                                ) : null}
                                {isPhoto ? (
                                  <img
                                    src={contentUrl}
                                    alt="Telegram upload"
                                    className="h-24 w-24 rounded-lg border border-[#ece9e1] object-cover"
                                  />
                                ) : null}
                                <a
                                  href={contentUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex text-xs font-semibold text-[#8a6f04] underline-offset-2 hover:underline"
                                >
                                  Open file
                                </a>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">No file</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-500">
                            {formatDate(record.createdAt)}
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="pt-8 text-center text-sm text-[#98a2b3]">
          (c) 2026 Syntrix. All rights reserved.
        </footer>
      </div>
    </main>
  );
}

"use client";

import { Mic, Square, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { VoiceSaleJob } from "@/store/api";

interface VoiceAssistantPanelProps {
  canUseVoice: boolean;
  canUseTelegram: boolean;
  telegramLinkStatus: { linked: boolean; chatId?: string | null } | null;
  selectedVoiceJob: VoiceSaleJob | null;
  isVoiceJobsFetching: boolean;
  openJobWindow: () => void;
  onGenerateTelegramCode: () => void;
  onVoiceFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickVoiceUpload: () => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  voiceInputRef: React.RefObject<HTMLInputElement | null>;
  entitlements: {
    getPlanLabel: (plan: string | null) => string;
    requiredPlanForFeature: (feature: string) => string | null;
  };
  formatDate: (d: string) => string;
}

export function VoiceAssistantPanel({
  canUseVoice, canUseTelegram, telegramLinkStatus,
  selectedVoiceJob, isVoiceJobsFetching, openJobWindow,
  onGenerateTelegramCode, onVoiceFileSelected,
  onClickVoiceUpload, isRecording, onStartRecording,
  onStopRecording, voiceInputRef, entitlements, formatDate
}: VoiceAssistantPanelProps) {
  return (
    <>
      <div className="border-b border-border/80 bg-card px-6 py-6 md:px-7">
        <div className="mb-4">
          <h3 className="dashboard-panel-title text-[1.1rem]">AI Sales Assistant</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect Telegram to instantly log sales via voice notes or file uploads.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {canUseTelegram ? (
            <Button
              className="px-5"
              onClick={onGenerateTelegramCode}
            >
              <Link2 className="mr-2 size-4" />
              Link Telegram
            </Button>
          ) : null}
          {canUseVoice ? (
            <Button
              variant="outline"
              className="px-5"
              onClick={onClickVoiceUpload}
            >
              Upload Voice File
            </Button>
          ) : null}
          {canUseVoice ? (
            <Button
              variant={isRecording ? "destructive" : "outline"}
              className="px-5"
              onClick={isRecording ? onStopRecording : onStartRecording}
            >
              {isRecording ? <Square className="mr-2 size-4 fill-white" /> : <Mic className="mr-2 size-4" />}
              {isRecording ? "Stop Recording" : "Record Audio"}
            </Button>
          ) : null}
        </div>
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          ref={voiceInputRef}
          onChange={onVoiceFileSelected}
        />
        {telegramLinkStatus ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Telegram Status:{" "}
            <span className={telegramLinkStatus.linked ? "font-semibold text-emerald-600" : "font-semibold text-amber-600"}>
              {telegramLinkStatus.linked ? `Linked (${telegramLinkStatus.chatId ?? "unknown"})` : "Not linked"}
            </span>
          </p>
        ) : null}
        {!canUseVoice || !canUseTelegram ? (
          <p className="mt-3 rounded-[calc(var(--radius-control)-4px)] border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
            Upgrade to {entitlements.getPlanLabel(entitlements.requiredPlanForFeature(!canUseVoice ? "voice.input" : "telegram.notify"))} to unlock
            {!canUseVoice && !canUseTelegram ? " voice input and Telegram linking." : !canUseVoice ? " voice input." : " Telegram linking."}
          </p>
        ) : null}
      </div>

      <div className="border-b border-border/80 px-6 py-5 md:px-7">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="dashboard-panel-title text-[1.1rem]">Voice Conversion Job</h3>
          {isVoiceJobsFetching ? <p className="text-sm text-muted-foreground">Updating...</p> : null}
        </div>
        {selectedVoiceJob ? (
          <div className="dashboard-soft-tile">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {selectedVoiceJob.sourceType === "telegram" ? "Telegram Voice/File" : "Web Voice Recording"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedVoiceJob.createdAt ? formatDate(selectedVoiceJob.createdAt) : "Unknown date"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="dashboard-status-neutral rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em]">
                  {selectedVoiceJob.status}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openJobWindow}
                >
                  Open Job
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="rounded-[calc(var(--radius-panel)-4px)] border border-dashed border-border/90 bg-[color:var(--surface-subtle)] px-4 py-6 text-sm text-muted-foreground">
            No voice jobs yet. Record your first sale note or send voice in Telegram after linking your chat.
          </p>
        )}
      </div>
    </>
  );
}

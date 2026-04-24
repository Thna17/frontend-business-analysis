export interface TelegramLinkCodeResponse {
  code: string;
  expiresAt: string;
  deepLinkUrl: string;
}

export interface TelegramLinkStatusResponse {
  linked: boolean;
  chatId: string | null;
  username: string | null;
  fullName: string | null;
  linkedAt: string | null;
}

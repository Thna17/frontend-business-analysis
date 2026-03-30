export interface BusinessProfile {
  id: string;
  ownerUserId: string;
  name: string;
  category: string;
  description: string | null;
  website?: string | null;
  address?: string | null;
  currency: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SettingsDashboardResponse {
  account: {
    fullName: string;
    email: string;
    phone: string;
    role: string;
  };
  business: {
    exists: boolean;
    name: string;
    type: string;
    website: string;
    address: string;
    description: string;
    currency: string;
  };
  notifications: {
    emailNotifications: boolean;
    salesAlerts: boolean;
    weeklyReports: boolean;
    productUpdates: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  security: {
    twoFactorEnabled: boolean;
  };
  dangerZone: {
    deactivationRequestedAt: string | null;
    deletionRequestedAt: string | null;
  };
}

export interface UpdateSettingsAccountInput {
  fullName: string;
  phone?: string | null;
}

export interface UpdateSettingsBusinessInput {
  name: string;
  type: string;
  website?: string;
  address?: string;
  description?: string;
  currency?: string;
}

export interface UpdateSettingsNotificationsInput {
  emailNotifications: boolean;
  salesAlerts: boolean;
  weeklyReports: boolean;
  productUpdates: boolean;
}

export interface UpdateSettingsPreferencesInput {
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

export interface UpdateSettingsSecurityInput {
  twoFactorEnabled: boolean;
}

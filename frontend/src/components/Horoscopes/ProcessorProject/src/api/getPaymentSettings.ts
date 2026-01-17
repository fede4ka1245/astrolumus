import authRequest from './authRequest';

interface PaymentSettingsResponse {
  platform: string;
  enabled: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export const getPaymentSettings = (platform: 'ios' | 'android' | 'web') => {
  return authRequest.get<PaymentSettingsResponse>(
    `${import.meta.env.VITE_APP_API_URL}/payments/settings/platform/${platform}`
  )
    .then(({ data }) => {
      return data;
    });
};


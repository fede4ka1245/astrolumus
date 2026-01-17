export interface Translations {
  de?: string;
  en?: string;
  es?: string;
  fr?: string;
  it?: string;
  pl?: string;
  ru?: string;
  tr?: string;
  uk?: string;
  'pt-BR'?: string;
  'pt-PT'?: string;
  [key: string]: string | undefined;
}

export interface ITariff {
  id: number
  title: string | Translations
  code: string
  created_at: string
  updated_at: string
  current_user_activated: string
  current_user_activates: string []
  validity_days: number
  description: string | Translations
  priority_for_default: number
  restriction_forum: boolean
  restriction_astroprocessor: boolean
  restriction_number_of_topic: number
  restriction_number_of_horoscopes: number
  restriction_astroprocessor_validity_days: number
};

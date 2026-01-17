import React, { useState, useEffect } from 'react';
import { Grid, TextField, Typography, Box } from '@mui/material';

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

export interface TariffTranslationsEditorProps {
  title?: Translations | string;
  description?: Translations | string;
  onTitleChange?: (translations: Translations) => void;
  onDescriptionChange?: (translations: Translations) => void;
  label?: string;
}

const LANGUAGES = [
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
  { code: 'uk', name: 'Українська' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'pl', name: 'Polski' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'pt-BR', name: 'Português (BR)' },
  { code: 'pt-PT', name: 'Português (PT)' },
];

const TariffTranslationsEditor: React.FC<TariffTranslationsEditorProps> = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  label = 'Переводы'
}) => {
  const [titleTranslations, setTitleTranslations] = useState<Translations>({});
  const [descriptionTranslations, setDescriptionTranslations] = useState<Translations>({});

  useEffect(() => {
    if (title) {
      if (typeof title === 'string') {
        setTitleTranslations({ ru: title });
      } else {
        setTitleTranslations(title);
      }
    }
  }, [title]);

  useEffect(() => {
    if (description) {
      if (typeof description === 'string') {
        setDescriptionTranslations({ ru: description });
      } else {
        setDescriptionTranslations(description);
      }
    }
  }, [description]);

  const handleTitleChange = (langCode: string, value: string) => {
    const updated = { ...titleTranslations, [langCode]: value };
    setTitleTranslations(updated);
    onTitleChange?.(updated);
  };

  const handleDescriptionChange = (langCode: string, value: string) => {
    const updated = { ...descriptionTranslations, [langCode]: value };
    setDescriptionTranslations(updated);
    onDescriptionChange?.(updated);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 2 }}>
        {label}
      </Typography>
      
      {onTitleChange && (
        <Box mb={3}>
          <Typography variant="subtitle1" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
            Заголовок
          </Typography>
          <Grid container spacing={2}>
            {LANGUAGES.map((lang) => (
              <Grid item xs={12} sm={6} key={lang.code}>
                <TextField
                  fullWidth
                  label={lang.name}
                  value={titleTranslations[lang.code] || ''}
                  onChange={(e) => handleTitleChange(lang.code, e.target.value)}
                  multiline
                  rows={2}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {onDescriptionChange && (
        <Box>
          <Typography variant="subtitle1" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
            Описание
          </Typography>
          <Grid container spacing={2}>
            {LANGUAGES.map((lang) => (
              <Grid item xs={12} sm={6} key={lang.code}>
                <TextField
                  fullWidth
                  label={lang.name}
                  value={descriptionTranslations[lang.code] || ''}
                  onChange={(e) => handleDescriptionChange(lang.code, e.target.value)}
                  multiline
                  rows={4}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default TariffTranslationsEditor;


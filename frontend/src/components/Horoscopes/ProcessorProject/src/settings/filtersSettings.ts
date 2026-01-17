import { IOptionItem } from '../models/interfaces/options';

export const topicsFiltersSetting = (id: number): IOptionItem[] => {
  return [
    {
      label: 'Все темы',
      value: 'all',
      params: {}
    },
    {
      label: 'Мои темы',
      value: 'my_topic',
      params: { user: id }
    },
    {
      label: 'Участник тем',
      value: 'user',
      params: { membership_user: id }
    },
    {
      label: 'Избранное',
      value: 'favorite',
      params: { type: 'favorite' }
    },
    {
      label: 'Комментируемые',
      value: 'commented',
      params: { user: id }
    }
  ];
};

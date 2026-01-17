export const topicsFiltersSetting = (useId: number) => {
  return [
    {
      label: 'Категории',
      value: 'categories',
      params: {}
    },
    {
      label: 'Все темы',
      value: 'all',
      params: {}
    },
    {
      label: 'Мои темы',
      value: 'my_topic',
      params: { user: useId }
    },
    {
      label: 'Участник тем',
      value: 'user',
      params: { membership_user: useId }
    },
    {
      label: 'Избранное',
      value: 'favorite',
      params: { type: 'favorite' }
    },
    {
      label: 'Комментируемые',
      value: 'commented',
      params: { user: useId }
    }
  ];
};

export const topicsSortsSetting = [
  {
    label: 'Новые',
    value: 'new',
    params: {
      ordering: '-published_at'
    }
  },
  {
    label: 'Популярные',
    value: 'popular',
    params: {
      ordering: '-popular'
    }
  },
  {
    label: 'Все',
    value: 'all',
    params: {}
  }
];

export const topicsFiltersSettings = (id: number) => ([
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
    label: 'Избранное',
    value: 'favorite',
    params: { type: 'favorite' }
  },
  {
    label: 'Комментируемые',
    value: 'commented',
    params: { user: id }
  }
]);

export const topicsSortsSettings = [
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

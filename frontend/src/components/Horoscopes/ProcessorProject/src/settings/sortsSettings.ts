export const topicsSorts = [
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

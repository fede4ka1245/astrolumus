import { FilterType } from './models';

export const privateTopicUsersFiltersSettings = [
  {
    label: 'Участники',
    value: FilterType.members,
    params: {
      status: 'accepted',
      user_status: 'accepted'
    }
  },
  {
    label: 'Пригласить',
    value: FilterType.users,
    params: {}
  },
  {
    label: 'Приглашенные',
    value: FilterType.invited,
    params: {
      status: 'accepted',
      user_status: 'invited'
    }
  },
  {
    label: 'Запросы доступа',
    value: FilterType.requests,
    params: {
      status: 'invited',
      user_status: 'accepted'
    }
  },
  {
    label: 'Отклоненные',
    value: FilterType.rejected,
    params: {
      status: 'rejected'
    }
  }
];

export const publicTopicUsersFiltersSettings = [
  {
    label: 'Участники',
    value: FilterType.members,
    params: {
      status: 'accepted',
      user_status: 'accepted'
    }
  },
  {
    label: 'Пригласить',
    value: FilterType.users,
    params: {}
  },
  {
    label: 'Приглашенные',
    value: FilterType.invited,
    params: {
      status: 'accepted',
      user_status: 'invited'
    }
  },
  {
    label: 'Отклоненные',
    value: FilterType.rejected,
    params: {
      status: 'rejected'
    }
  }
];

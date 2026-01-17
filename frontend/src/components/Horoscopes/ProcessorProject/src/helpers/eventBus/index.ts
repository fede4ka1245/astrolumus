import EventBus from 'js-event-bus';

export enum EventBusEvents {
  triggerForumRestrictionBanner = 'triggerForumRestrictionBanner',
  triggerNotificationPageOpen = 'triggerNotificationPageOpen',
  triggerFirebaseEvent = 'triggerFirebaseEvent'
}

export const eventBus = new EventBus();

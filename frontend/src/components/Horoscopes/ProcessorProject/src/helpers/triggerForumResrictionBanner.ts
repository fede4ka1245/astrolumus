import { eventBus, EventBusEvents } from './eventBus';

export const triggerForumRestrictionBanner = () => {
  eventBus.emit(EventBusEvents.triggerForumRestrictionBanner);
};

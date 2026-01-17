import { FirebaseAnalytics, LogEventOptions } from '@capacitor-firebase/analytics';
import { eventBus, EventBusEvents } from '../eventBus';

export const logFirebaseEvent = (event: LogEventOptions) => {
  eventBus.emit(EventBusEvents.triggerFirebaseEvent, null, event);
};

export const enableFirebaseAnalytics = () => {
  FirebaseAnalytics.setEnabled({
    enabled: true
  }).then(() => {
    eventBus.on(EventBusEvents.triggerFirebaseEvent, async (event: LogEventOptions) => {
      await FirebaseAnalytics.logEvent(event);
    });
  });
};

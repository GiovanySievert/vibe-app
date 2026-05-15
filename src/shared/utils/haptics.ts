import * as Haptics from 'expo-haptics';

const triggerHaptic = (action: () => Promise<void>) => {
  action().catch(() => undefined);
};

export const triggerLightHaptic = () => {
  triggerHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
};

export const triggerSuccessHaptic = () => {
  triggerHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
};

export const triggerBadgeUnlockHaptic = () => {
  triggerHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
  triggerHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
};

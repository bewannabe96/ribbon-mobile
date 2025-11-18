import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { AndroidHaptics } from "expo-haptics";

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).then();
        } else if (process.env.EXPO_OS === "android") {
          Haptics.performAndroidHapticsAsync(
            AndroidHaptics.Keyboard_Tap,
          ).then();
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}

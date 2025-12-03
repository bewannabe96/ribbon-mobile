/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Color } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function useThemeColor(
  colorName: keyof typeof Color.light & keyof typeof Color.dark,
  props?: { light?: string; dark?: string },
) {
  const theme = useColorScheme() ?? "light";
  return props?.[theme] || Color[theme][colorName] || "transparent";
}

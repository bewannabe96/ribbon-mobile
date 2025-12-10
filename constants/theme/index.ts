export const StaticColor = {
  indigo50: "#eef2ff",
  indigo100: "#e0e7ff",
  indigo200: "#c7d2fe",
  indigo300: "#a5b4fc",
  indigo400: "#818cf8",
  indigo500: "#6366f1",
  indigo600: "#4f46e5",
  indigo700: "#4338ca",
  indigo800: "#3730a3",
  indigo900: "#312e81",
  indigo950: "#1e1b4b",

  gray50: "#FAFAFA",
  gray100: "#F5F5F5",
  gray200: "#E5E5E5",
  gray300: "#D6D6D6",
  gray400: "#A3A3A3",
  gray500: "#737373",
  gray600: "#525252",
  gray700: "#404040",
  gray800: "#262626",
  gray900: "#1A1A1A",
  gray950: "#0A0A0A",

  red50: "#fef2f2",
  red100: "#fee2e2",
  red200: "#fecaca",
  red300: "#fca5a5",
  red400: "#f87171",
  red500: "#ef4444",
  red600: "#dc2626",
  red700: "#b91c1c",
  red800: "#991b1b",
  red900: "#7f1d1d",
  red950: "#450a0a",

  orange50: "#fff7ed",
  orange100: "#ffedd5",
  orange200: "#fed7aa",
  orange300: "#fdba74",
  orange400: "#fb923c",
  orange500: "#f97316",
  orange600: "#ea580c",
  orange700: "#c2410c",
  orange800: "#9a3412",
  orange900: "#7c2d12",
  orange950: "#431407",

  yellow50: "#fefce8",
  yellow100: "#fef9c3",
  yellow200: "#fef08a",
  yellow300: "#fde047",
  yellow400: "#facc15",
  yellow500: "#eab308",
  yellow600: "#ca8a04",
  yellow700: "#a16207",
  yellow800: "#854d0e",
  yellow900: "#713f12",
  yellow950: "#422006",

  green50: "#f0fdf4",
  green100: "#dcfce7",
  green200: "#bbf7d0",
  green300: "#86efac",
  green400: "#4ade80",
  green500: "#22c55e",
  green600: "#16a34a",
  green700: "#15803d",
  green800: "#166534",
  green900: "#14532d",
  green950: "#052e16",

  blue50: "#eff6ff",
  blue100: "#dbeafe",
  blue200: "#bfdbfe",
  blue300: "#93c5fd",
  blue400: "#60a5fa",
  blue500: "#3b82f6",
  blue600: "#2563eb",
  blue700: "#1d4ed8",
  blue800: "#1e40af",
  blue900: "#1e3a8a",
  blue950: "#172554",
};

export const ColorOpacity = {
  5: "0d",
  10: "1a",
  20: "33",
  30: "4d",
  40: "66",
  50: "80",
  60: "99",
  70: "b3",
  80: "cc",
  90: "e6",
};

export const Color = {
  text: "#11181C",
  background: "#ffffff",
  border: StaticColor.gray200,
  surface: StaticColor.gray100,

  light: {
    text: "#11181C",
    background: "#fff",
    tint: StaticColor.indigo600,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: StaticColor.indigo600,
    surface: "#f1f1f1",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: StaticColor.indigo50,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: StaticColor.indigo50,
    surface: "#0a0a0a",
  },
};

const SizingScaleUnit = 4;

const SizingScaleOptions = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32,
] as const;

type SizingScaleOptionType = (typeof SizingScaleOptions)[number];

type SizingScaleType = Record<SizingScaleOptionType, number>;

export const SizingScale: SizingScaleType = SizingScaleOptions.reduce(
  (sizingScale, opt) => ({
    ...sizingScale,
    [opt]: opt * SizingScaleUnit,
  }),
  {} as SizingScaleType,
);

export const Sizing = {
  screenPaddingX: SizingScale[4],
};

import React, { useMemo } from "react";
import { SizingScale, StaticColor, Color } from "@/constants/theme";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

type ButtonProps = {
  label: string;
  IconComponent?: React.ReactElement<{ color: string; size: number }>;
  variant?: "primary" | "secondary" | "outline" | "default";
  size?: "md" | "lg";
  color?: "indigo" | "red" | "orange" | "yellow" | "green" | "blue" | "gray";
  flexFill?: boolean;
  silentlyDisabled?: boolean;
} & Omit<TouchableOpacityProps, "style" | "activeOpacity">;

export default function Button(props: ButtonProps) {
  const color = useMemo(() => props.color || "indigo", [props.color]);

  const containerColorStyle = useMemo(() => {
    if (props.variant === "primary") {
      return {
        backgroundColor: StaticColor[`${color}600`],
        borderColor: StaticColor[`${color}600`],
      };
    } else if (props.variant === "secondary") {
      return {
        backgroundColor: StaticColor[`${color}100`],
        borderColor: StaticColor[`${color}100`],
      };
    } else if (props.variant === "outline") {
      return {
        backgroundColor: "transparent",
        borderColor: StaticColor[`${color}600`],
      };
    }

    return {
      backgroundColor: StaticColor.gray100,
      borderColor: StaticColor.gray100,
    };
  }, [color, props.variant]);

  const containerSizeStyle = useMemo(() => {
    if (props.size === "lg") {
      return {
        paddingHorizontal: SizingScale[6],
        paddingVertical: SizingScale[4],
        borderRadius: SizingScale[3],
        gap: SizingScale[1],
      };
    }

    return {
      paddingHorizontal: SizingScale[4],
      paddingVertical: SizingScale[2.5],
      borderRadius: SizingScale[2],
      gap: SizingScale[1],
    };
  }, [props.size]);

  const textAndIconSize = useMemo(() => {
    return 16;
  }, []);

  const textColor = useMemo(() => {
    if (props.variant === "primary") {
      return Color.background;
    } else if (props.variant === "secondary") {
      return StaticColor[`${color}700`];
    } else if (props.variant === "outline") {
      return StaticColor[`${color}600`];
    }

    return StaticColor.gray900;
  }, [color, props.variant]);

  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.container,
        containerColorStyle,
        containerSizeStyle,
        props.disabled && { opacity: 0.5 },
        props.flexFill && { flex: 1 },
      ]}
      activeOpacity={0.6}
      disabled={props.disabled || props.silentlyDisabled}
    >
      <View style={styles.content}>
        {props.IconComponent &&
          React.cloneElement(props.IconComponent, {
            size: textAndIconSize,
            color: textColor,
          })}
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontSize: textAndIconSize,
              lineHeight: textAndIconSize + 4,
            },
          ]}
        >
          {props.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SizingScale[2],
  },

  text: {
    fontWeight: "bold",
  },
});

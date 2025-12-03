import React, { useMemo } from "react";
import { SizingScale, StaticColor } from "@/constants/theme";
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type PillProps = {
  name: string;
  IconComponent?: React.ReactElement<{ color: string; size: number }>;
  variant?: "primary" | "secondary" | "outline" | "default";
  size?: "sm";
  color?: "indigo" | "red" | "orange" | "yellow" | "green" | "blue";
  onPress?: (e: GestureResponderEvent) => void;
};

export default function Pill(props: PillProps) {
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
        borderColor: StaticColor.gray300,
      };
    }

    return {
      backgroundColor: StaticColor.gray100,
      borderColor: StaticColor.gray100,
    };
  }, [color, props.variant]);

  const containerSizeStyle = useMemo(() => {
    if (props.size === "sm") {
      return {
        paddingHorizontal: SizingScale[3],
        paddingVertical: SizingScale[1.5],
        borderRadius: SizingScale[8],
      };
    }

    return {
      paddingHorizontal: SizingScale[4],
      paddingVertical: SizingScale[2.5],
      borderRadius: SizingScale[10],
      gap: SizingScale[1],
    };
  }, [props.size]);

  const textAndIconSize = useMemo(() => {
    if (props.size === "sm") return 14;
    return 16;
  }, [props.size]);

  const textColor = useMemo(() => {
    if (props.variant === "primary") {
      return "white";
    } else if (props.variant === "secondary") {
      return StaticColor[`${color}700`];
    } else if (props.variant === "outline") {
      return StaticColor.gray700;
    }

    return StaticColor.gray700;
  }, [color, props.variant]);

  return (
    <TouchableOpacity
      style={[styles.container, containerColorStyle, containerSizeStyle]}
      activeOpacity={0.6}
      onPress={props.onPress}
    >
      {props.IconComponent &&
        React.cloneElement(props.IconComponent, {
          size: textAndIconSize,
          color: textColor,
        })}
      <Text style={{ fontSize: textAndIconSize, color: textColor }}>
        {props.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
});

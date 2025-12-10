import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  LayoutChangeEvent,
  LayoutRectangle,
  Text,
  StyleProp,
} from "react-native";
import { SizingScale, StaticColor } from "@/constants/theme";

const GAP = 12;
const ARROW_HEIGHT = 8;
const ARROW_WIDTH = 6;

type TooltipProps = {
  children: React.ReactElement<{
    onLayout: (event: LayoutChangeEvent) => void;
  }>;

  content: React.ReactNode | string;
  position: "top" | "bottom" | "left" | "right";
};

export default function Tooltip(props: TooltipProps) {
  const [rect, setRect] = useState<LayoutRectangle | null>(null);

  const onLayoutChildren = useCallback((event: LayoutChangeEvent) => {
    if (event.nativeEvent.layout !== null) {
      setRect(event.nativeEvent.layout);
    }
  }, []);

  const containerStyle: StyleProp<any> = useMemo(() => {
    if (!rect) return null;

    switch (props.position) {
      case "top":
        return {
          left: rect.x + rect.width / 2,
          bottom: rect.height + rect.y + GAP,
          transform: [{ translateX: "-50%" }],
        };
      case "bottom":
        return {
          left: rect.x + rect.width / 2,
          top: rect.y + rect.height + GAP,
          transform: [{ translateX: "-50%" }],
        };
      case "left":
        return {
          right: rect.x + rect.width + GAP,
          top: rect.y + rect.height / 2,
          transform: [{ translateY: "-50%" }],
        };
      case "right":
        return {
          left: rect.x + rect.width + GAP,
          top: rect.y + rect.height / 2,
          transform: [{ translateY: "-50%" }],
        };
    }
  }, [rect, props.position]);

  const arrowStyle: StyleProp<any> = useMemo(() => {
    switch (props.position) {
      case "top":
        return {
          bottom: -ARROW_HEIGHT,
          left: "50%",
          marginLeft: -ARROW_WIDTH,
          borderLeftWidth: ARROW_WIDTH,
          borderRightWidth: ARROW_WIDTH,
          borderTopWidth: ARROW_HEIGHT,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: StaticColor.gray600,
        };
      case "bottom":
        return {
          top: -ARROW_HEIGHT,
          left: "50%",
          marginLeft: -ARROW_WIDTH,
          borderLeftWidth: ARROW_WIDTH,
          borderRightWidth: ARROW_WIDTH,
          borderBottomWidth: ARROW_HEIGHT,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: StaticColor.gray600,
        };
      case "left":
        return {
          right: -ARROW_HEIGHT,
          top: "50%",
          marginTop: -ARROW_WIDTH,
          borderTopWidth: ARROW_WIDTH,
          borderBottomWidth: ARROW_WIDTH,
          borderLeftWidth: ARROW_HEIGHT,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: StaticColor.gray600,
        };
      case "right":
        return {
          left: -ARROW_HEIGHT,
          top: "50%",
          marginTop: -ARROW_WIDTH,
          borderTopWidth: ARROW_WIDTH,
          borderBottomWidth: ARROW_WIDTH,
          borderRightWidth: ARROW_HEIGHT,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderRightColor: StaticColor.gray600,
        };
    }
  }, [props.position]);

  return (
    <>
      {React.cloneElement(props.children, { onLayout: onLayoutChildren })}

      {containerStyle && (
        <View style={[styles.container, containerStyle]}>
          <View style={styles.tooltipBox}>
            {typeof props.content === "string" && (
              <Text style={styles.defaultText}>{props.content}</Text>
            )}
          </View>
          <View style={[styles.arrow, arrowStyle]} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  defaultText: {
    fontSize: 14,
    color: "#ffffff",
  },

  container: {
    position: "absolute",
  },

  tooltipBox: {
    backgroundColor: StaticColor.gray600,
    paddingHorizontal: SizingScale[3],
    paddingVertical: SizingScale[2],
    borderRadius: 6,
  },

  arrow: {
    position: "absolute",
    width: 0,
    height: 0,
  },
});

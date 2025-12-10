import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChevronRight, Calendar, MapPin, Tag } from "lucide-react-native";
import { Color, SizingScale } from "@/constants/theme";
import { router } from "expo-router";
import { DateTime } from "luxon";
import { useMemo } from "react";

type EventCardProps = {
  uuid: string;
  title: string;
  periodStart: DateTime;
  periodEnd: DateTime;
  location: string | null;
  participationFee: number | null;
  isLast: boolean;
};

export default function EventCard(props: EventCardProps) {
  const participationFeeText = useMemo(
    () =>
      props.participationFee === undefined || props.participationFee === null
        ? null
        : props.participationFee === 0
          ? "무료"
          : props.participationFee === -1
            ? "유료"
            : props.participationFee.toLocaleString() + "원",
    [props.participationFee],
  );

  const periodText = useMemo(() => {
    const start = props.periodStart.toFormat("yyyy. MM. dd");
    const end = props.periodEnd.toFormat("yyyy. MM. dd");
    if (start === end) {
      return `${start} (당일)`;
    }
    return `${start} - ${end}`;
  }, [props.periodStart, props.periodEnd]);

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() =>
          router.push(`/event-detail/${props.uuid}?prevent_view_record=true`)
        }
        activeOpacity={0.6}
      >
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle} numberOfLines={1}>
            {props.title}
          </Text>
          <View style={styles.detailRow}>
            <Calendar size={14} color={Color.text} />
            <Text style={styles.detailText}>{periodText}</Text>
          </View>
          {props.location !== null && (
            <View style={styles.detailRow}>
              <MapPin size={14} color={Color.text} />
              <Text style={styles.detailText}>{props.location}</Text>
            </View>
          )}
          {participationFeeText !== null && (
            <View style={styles.detailRow}>
              <Tag size={14} color={Color.text} />
              <Text style={styles.detailText}>{participationFeeText}</Text>
            </View>
          )}
        </View>
        <ChevronRight size={20} color={Color.text} />
      </TouchableOpacity>
      {!props.isLast && <View style={styles.separator} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SizingScale[5],
  },

  separator: {
    height: 1,
    backgroundColor: Color.border,
    marginVertical: SizingScale[3],
  },

  eventInfo: {
    flex: 1,
    gap: SizingScale[2],
  },

  eventTitle: {
    fontSize: 16,
    color: Color.text,
    fontFamily: "Pretendard",
    fontWeight: 600,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SizingScale[1.5],
  },

  detailText: {
    fontSize: 14,
    fontFamily: "Pretendard",
  },
});

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  DimensionValue,
} from "react-native";
import React, { useMemo, PropsWithChildren } from "react";
import { Clock, Calendar, MapPin, Tag } from "lucide-react-native";
import { Color, SizingScale, StaticColor } from "@/constants/theme";
import Pill from "@/components/ui/pill";
import { DateTime } from "luxon";
import { router } from "expo-router";

interface InfoRowProps {
  IconComponent: React.ReactElement;
  label: string;
}

function InfoRow(props: PropsWithChildren<InfoRowProps>) {
  return (
    <View style={infoRowStyles.container}>
      <View style={infoRowStyles.iconView}>{props.IconComponent}</View>
      <View>
        <Text style={infoRowStyles.infoLabel}>{props.label}</Text>
        {props.children}
      </View>
    </View>
  );
}

const infoRowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: SizingScale[2],
  },

  iconView: {
    marginTop: 2,
  },

  infoLabel: {
    fontSize: 14,
    color: StaticColor.gray600,
    marginBottom: SizingScale[2.5],
  },
});

interface FullHeightEventItemProps {
  width?: DimensionValue;
  preventViewRecord?: boolean;

  uuid: string;
  name: string;
  category: string;
  registrationStart: DateTime | null;
  registrationEnd: DateTime | null;
  eventStart: DateTime;
  eventEnd: DateTime;
  location: string | null;
  participationFee: number | null;
  registrationStatus: "upcoming" | "opened" | "closed" | null;
}

export default function BasicEventItem(props: FullHeightEventItemProps) {
  const periodText = useMemo(() => {
    const start = props.eventStart.toFormat("yyyy. MM. dd");
    const end = props.eventEnd.toFormat("yyyy. MM. dd");
    if (start === end) {
      return `${start} (당일)`;
    }
    return `${start} - ${end}`;
  }, [props.eventStart, props.eventEnd]);

  const participationFeeText = useMemo(() => {
    if (props.participationFee === null) return null;
    else if (props.participationFee === 0) return "무료";
    else if (props.participationFee === -1) return "유료";
    return props.participationFee.toLocaleString() + "원";
  }, [props.participationFee]);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.container, { width: props.width }]}
      onPress={() =>
        router.push(
          `/event-detail/${props.uuid}?prevent_view_record=${props.preventViewRecord}`,
        )
      }
    >
      {/* Badge & Like */}
      <View style={styles.header}>
        <View style={styles.pillContainer}>
          {props.registrationStatus === "upcoming" ? (
            <Pill name="접수전" size="sm" color="blue" variant="secondary" />
          ) : props.registrationStatus === "opened" ? (
            <Pill name="접수중" size="sm" color="green" variant="secondary" />
          ) : props.registrationStatus === "closed" ? (
            <Pill name="접수마감" size="sm" color="red" variant="secondary" />
          ) : null}

          <Pill name={props.category} size="sm" />
        </View>

        {/* TODO: should be implemented later on */}
        {/*<TouchableOpacity*/}
        {/*  onPress={handleLikePress}*/}
        {/*  style={styles.likeButton}*/}
        {/*  activeOpacity={0.6}*/}
        {/*>*/}
        {/*  <Heart*/}
        {/*    size={24}*/}
        {/*    color={isLiked ? StaticColor.red500 : StaticColor.gray400}*/}
        {/*    fill={isLiked ? StaticColor.red500 : "none"}*/}
        {/*  />*/}
        {/*</TouchableOpacity>*/}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {props.name}
      </Text>

      <View style={styles.centerContainer}>
        {(props.registrationStart !== null ||
          props.registrationEnd !== null) && (
          <InfoRow
            IconComponent={<Clock size={16} color={StaticColor.gray400} />}
            label="신청기간"
          >
            <View style={styles.registrationDates}>
              {props.registrationStart !== null && (
                <Text style={styles.valueText}>
                  시작:{"  "}
                  {props.registrationStart.toFormat("yyyy. MM. dd HH:mm")}
                </Text>
              )}
              {props.registrationEnd !== null && (
                <Text style={styles.valueText}>
                  종료:{"  "}
                  {props.registrationEnd.toFormat("yyyy. MM. dd HH:mm")}
                </Text>
              )}
            </View>
          </InfoRow>
        )}

        <InfoRow
          IconComponent={<Calendar size={16} color={StaticColor.gray400} />}
          label="진행기간"
        >
          <Text style={styles.valueText}>{periodText}</Text>
        </InfoRow>

        {props.location !== null && (
          <InfoRow
            IconComponent={<MapPin size={16} color={StaticColor.gray400} />}
            label="장소"
          >
            <Text style={styles.valueText}>{props.location}</Text>
          </InfoRow>
        )}
      </View>

      {participationFeeText !== null && (
        <View style={styles.priceContainer}>
          <Tag size={16} color={StaticColor.gray400} />
          <Text style={styles.priceLabel}>참가비</Text>
          <Text style={styles.priceValue}>{participationFeeText}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.background,
    borderRadius: SizingScale[4],
    borderWidth: 2,
    borderColor: StaticColor.gray400,
    paddingTop: SizingScale[4],
    paddingBottom: SizingScale[6],
    paddingHorizontal: SizingScale[4],
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SizingScale[2],
  },

  pillContainer: {
    flexDirection: "row",
    gap: SizingScale[2],
    flexWrap: "wrap",
    flex: 1,
  },

  likeButton: {
    padding: SizingScale[1.5],
  },

  title: {
    fontSize: 24,
    marginBottom: SizingScale[6],
    fontWeight: "bold",
  },

  centerContainer: {
    flex: 1,
    gap: SizingScale[6],
  },

  registrationDates: {
    gap: SizingScale[2.5],
  },

  valueText: {
    fontSize: 16,
    lineHeight: 17,
  },

  priceContainer: {
    borderTopWidth: 1,
    borderTopColor: Color.border,
    flexDirection: "row",
    alignItems: "center",
    gap: SizingScale[2],
    marginTop: SizingScale[6],
    paddingTop: SizingScale[6],
  },

  priceLabel: {
    fontSize: 16,
    color: StaticColor.gray600,
  },

  priceValue: {
    fontSize: 18,
    lineHeight: 19,
    color: StaticColor.indigo600,
    marginStart: "auto",
  },
});

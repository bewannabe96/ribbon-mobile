import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Linking,
  useWindowDimensions,
} from "react-native";
import { Color, Sizing, SizingScale, StaticColor } from "@/constants/theme";
import { useCallback, useMemo } from "react";
import {
  Phone,
  Globe,
  MapPin,
  Calendar,
  Clock,
  Users,
  Tag,
} from "lucide-react-native";
import { useEventDetailScreenView } from "@/views/event-detail/context/use-event-detail-screen-view";
import * as WebBrowser from "expo-web-browser";
import Pill from "@/components/ui/pill";
import { InfoRow } from "./info-row";
import RenderHtml from "react-native-render-html";
import { Section, SectionBody, SectionTitle } from "@/components/ui/section";

export function EventDetailScrollContent() {
  const { eventDetail } = useEventDetailScreenView();

  const handlePhonePress = useCallback(async (phoneNumber?: string) => {
    if (phoneNumber) {
      await Linking.openURL(`tel:${phoneNumber}`);
    }
  }, []);

  const handleWebsitePress = useCallback(async (website?: string) => {
    if (website) {
      await WebBrowser.openBrowserAsync(website, {
        dismissButtonStyle: "close",
      });
    }
  }, []);

  const formattedPrice = useMemo(() => {
    if (!eventDetail || eventDetail.fee === null) return null;
    if (eventDetail.fee === 0) return "무료";
    if (eventDetail.fee === -1) return "유료";
    return `${eventDetail.fee.toLocaleString()}원`;
  }, [eventDetail]);

  // UI

  const { width } = useWindowDimensions();

  if (!eventDetail) return null;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topView}>
        <View style={styles.categoriesContainer}>
          {eventDetail.categories.map((category, index) => (
            <Pill key={index} name={category} size="sm" variant="secondary" />
          ))}
        </View>

        <Text style={styles.subTitleText}>{eventDetail.name}</Text>

        <Text style={styles.mainTitleText}>{eventDetail.refinedName}</Text>
      </View>

      {(eventDetail.capacity !== null || formattedPrice) && (
        <Section>
          <SectionBody>
            <View style={styles.recruitmentGrid}>
              {eventDetail.capacity !== null && (
                <View style={styles.recruitmentItem}>
                  <Text style={styles.titleText}>모집인원</Text>
                  <View style={styles.recruitmentValueRow}>
                    <Users size={18} color={StaticColor.indigo600} />
                    <Text style={styles.bodyText}>
                      {eventDetail.capacity}명
                    </Text>
                  </View>
                </View>
              )}
              {formattedPrice && (
                <View style={styles.recruitmentItem}>
                  <Text style={styles.titleText}>참가비</Text>
                  <View style={styles.recruitmentValueRow}>
                    <Tag size={18} color={StaticColor.indigo600} />
                    <Text style={styles.bodyText}>{formattedPrice}</Text>
                  </View>
                </View>
              )}
            </View>
          </SectionBody>
        </Section>
      )}

      <Section>
        <SectionBody>
          <InfoRow icon={Calendar} label="일정">
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleLabel}>시작</Text>
              <Text style={styles.bodyText}>
                {eventDetail.period.start.toISODate()}
              </Text>
            </View>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleLabel}>종료</Text>
              <Text style={styles.bodyText}>
                {eventDetail.period.end.toISODate()}
              </Text>
            </View>
          </InfoRow>
        </SectionBody>
      </Section>

      {eventDetail.timetable.length > 0 && (
        <Section>
          <SectionBody>
            <InfoRow icon={Clock} label="시간표">
              <View style={styles.listView}>
                {eventDetail.timetable.map((slot, index) => (
                  <View key={index}>
                    <Text style={styles.bodyText}>
                      {`[${slot[0]}]  ${slot[1]} ~ ${slot[2]}`}
                    </Text>
                  </View>
                ))}
              </View>
            </InfoRow>
          </SectionBody>
        </Section>
      )}

      {eventDetail.registrationSessions.length > 0 && (
        <Section>
          <SectionBody>
            <InfoRow icon={Clock} label="신청기간">
              <View style={styles.listView}>
                {eventDetail.registrationSessions.map((session, index) => (
                  <View key={index}>
                    <Text style={styles.applicationText}>[{index + 1}차]</Text>
                    {session.open && (
                      <View style={styles.scheduleRow}>
                        <Text style={styles.scheduleLabel}>시작</Text>
                        <Text style={styles.bodyText}>
                          {session.open.toFormat("yyyy-MM-dd (HH:mm)")}
                        </Text>
                      </View>
                    )}
                    {session.close && (
                      <View style={styles.scheduleRow}>
                        <Text style={styles.scheduleLabel}>종료</Text>
                        <Text style={styles.bodyText}>
                          {session.close.toFormat("yyyy-MM-dd (HH:mm)")}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </InfoRow>
          </SectionBody>
        </Section>
      )}

      <Section>
        <SectionBody>
          <InfoRow icon={MapPin} label="장소">
            {eventDetail.venue.name !== eventDetail.venue.address && (
              <Text style={styles.bodyText} numberOfLines={1}>
                {eventDetail.venue.name}
              </Text>
            )}
            <Text style={styles.locationAddress} numberOfLines={1}>
              {eventDetail.venue.address}
            </Text>
          </InfoRow>
        </SectionBody>
      </Section>

      <Section>
        <SectionTitle title="상세정보" />
        {eventDetail && (
          <SectionBody>
            <RenderHtml
              contentWidth={width - 4 * Sizing.screenPaddingX}
              tagsStyles={htmlStyles}
              source={{ html: eventDetail.description }}
            />
          </SectionBody>
        )}
      </Section>

      <Section>
        <SectionBody>
          <View style={styles.organizationRow}>
            <View style={styles.organizationInfo}>
              <Text style={styles.titleText}>주최</Text>
              <Text style={styles.bodyText}>{eventDetail.institutionName}</Text>
            </View>
            <View style={styles.organizationActions}>
              {eventDetail.contactPhone && (
                <TouchableOpacity
                  onPress={handlePhonePress.bind(
                    null,
                    eventDetail.contactPhone,
                  )}
                  style={styles.iconButton}
                  activeOpacity={0.6}
                >
                  <Phone size={20} color={StaticColor.gray700} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => handleWebsitePress(eventDetail.websiteUrl)}
                style={styles.iconButton}
                activeOpacity={0.6}
              >
                <Globe size={20} color={StaticColor.gray700} />
              </TouchableOpacity>
            </View>
          </View>
        </SectionBody>
      </Section>
    </ScrollView>
  );
}

const htmlStyles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: Color.text,
  },
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[6],
    gap: SizingScale[4],
  },

  topView: {
    paddingHorizontal: SizingScale[2],
    marginBottom: SizingScale[4],
  },

  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SizingScale[2],
    marginBottom: SizingScale[4],
  },

  subTitleText: {
    fontSize: 16,
    color: StaticColor.gray500,
    marginBottom: SizingScale[1],
  },

  mainTitleText: {
    fontSize: 24,
    lineHeight: 32,
    color: StaticColor.gray900,
    fontWeight: "bold",
  },

  titleText: {
    fontSize: 14,
    color: StaticColor.gray500,
    marginBottom: SizingScale[2],
  },

  bodyText: {
    fontSize: 16,
    color: StaticColor.gray900,
  },

  organizationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SizingScale[4],
  },

  organizationInfo: {
    flex: 1,
  },

  organizationActions: {
    flexDirection: "row",
    gap: SizingScale[4],
  },

  iconButton: {
    padding: SizingScale[2],
    borderRadius: "100%",
    backgroundColor: StaticColor.gray100,
  },

  recruitmentGrid: {
    flexDirection: "row",
    gap: SizingScale[4],
  },

  recruitmentItem: {
    flex: 1,
  },

  recruitmentValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SizingScale[2],
  },

  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SizingScale[1],
  },

  scheduleLabel: {
    fontSize: 14,
    color: StaticColor.gray500,
    marginRight: SizingScale[2],
  },

  listView: {
    gap: SizingScale[3],
  },

  timetableItem: {
    gap: SizingScale[1],
  },

  applicationText: {
    fontSize: 16,
    color: StaticColor.indigo600,
    marginBottom: SizingScale[1],
  },

  locationAddress: {
    fontSize: 16,
    color: StaticColor.gray600,
  },
});

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Sizing } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { router } from "expo-router";
import RenderHtml from "react-native-render-html";
import { useColorScheme } from "@/hooks/use-color-scheme";

const IS_REGISTERING = false;
const SAMPLE_HTML =
  // "<dd> <div> <p> o 강사 프로필</p> <p> - 영어지도사(TESOL): 미국 San Diego Stat Univ.</p> <p> - <span>영어지도사(TESOL): 한국외국어대학교</span></p> <p><span> - 스마트인지훈련지도사 : 한국치매예방강사협회</span></p> <p><span> - 실버인지놀이 지도사 : 한국치매예방강사협회</span></p> <p><span> - 대전시 지족초등학교 : 방과후 영어강사</span></p> <p><span> - 대전시 전민초등학교 : 방과후 영어강사</span></p> <p><span> - 한국과학기술연구원 영어 직원교육 등 </span></p> <p><span><br/></span></p> <p><span>o 강좌명 : 생활영어(AI 없어도 스스로 해내는 생활영어)</span></p> <p><span> - 대 상 : 성인(시니어)</span></p> <p><span> - 강의 목적: 성인(시니어)이 기본 영어로 대화 가능</span></p> <p><span> </span></p> <p><span> </span></p> <p><span><br/></span></p> <p><span><br/></span></p> <p><span> </span></p> <p><span> </span></p> <p> </p> </div> </dd>";
  // '<div><figure><img src="https://www.songpa.go.kr/learn/upfile/editor/20250825093105569.jpg"/></figure><figure><img src="https://www.songpa.go.kr/learn/upfile/editor/20250825093102744.jpg"/></figure><figure><img src="https://www.songpa.go.kr/learn/upfile/editor/20250528060605206.jpg"/></figure><p> </p><p> </p></div>';
  '<div><figure><img src="https://www.songpa.go.kr/learn/upfile/editor/20251024022232944.jpg"/></figure></div>';

type PillProps = {
  name: string;
};

function Pill(props: PillProps) {
  const themeTint = useThemeColor({}, "tint");

  return (
    <View
      style={[
        pillStyles.container,
        { backgroundColor: themeTint + "22", borderColor: themeTint },
      ]}
    >
      <Text style={[pillStyles.text, { color: themeTint }]}>{props.name}</Text>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    paddingHorizontal: 10,
    borderRadius: 4,
    height: 28,
  },

  text: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default function EventDetailScreen() {
  const themeBackground = useThemeColor({}, "background");
  const themeTint = useThemeColor({}, "tint");
  const themeText = useThemeColor({}, "text");
  const theme = useColorScheme() ?? "light";
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { backgroundColor: themeBackground }]}>
      <SafeAreaView
        style={[styles.navigationBar, { backgroundColor: themeBackground }]}
        edges={["top"]}
      >
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.6}
          onPress={() => router.back()}
        >
          <MaterialIcons size={28} name="arrow-back" color={themeText} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6}>
          <MaterialIcons
            size={28}
            name={"favorite-outline"}
            color={themeText}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6}>
          <MaterialIcons size={28} name="share" color={themeText} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        style={styles.bodyScrollView}
        contentContainerStyle={[
          styles.bodyScrollViewContainer,
          { backgroundColor: theme === "light" ? "#f1f1f1" : "#0a0a0a" },
        ]}
      >
        <View
          style={[styles.sectionView, { backgroundColor: themeBackground }]}
        >
          <View style={styles.pillView}>
            <Pill name="강의/강좌" />
            <Pill name="건강" />
          </View>
          <Text style={[styles.originalTitleText, { color: themeText }]}>
            SNPE(바른자세 척추운동)교실(2025.4분기)
          </Text>
          <Text style={[styles.titleText, { color: themeText }]}>
            바른 자세 척추 운동 교실
          </Text>

          <View style={styles.institutionView}>
            <Text style={[styles.institutionText, { color: themeText }]}>
              송파런
            </Text>
            <TouchableOpacity
              activeOpacity={0.6}
              style={[styles.institutionButton, { borderColor: themeText }]}
            >
              <Text
                style={[styles.institutionButtonText, { color: themeText }]}
              >
                전화
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={[styles.institutionButton, { borderColor: themeText }]}
            >
              <Text
                style={[styles.institutionButtonText, { color: themeText }]}
              >
                웹사이트
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.shortInfoView}>
            <View style={styles.shortInfoFragment}>
              <MaterialIcons size={20} name="groups" color={themeText} />
              <Text style={[styles.shortInfoText, { color: themeText }]}>
                20명
              </Text>
            </View>
            <View style={styles.shortInfoFragment}>
              <MaterialIcons size={20} name="paid" color={themeText} />
              <Text style={[styles.shortInfoText, { color: themeText }]}>
                5,000원
              </Text>
            </View>
          </View>

          <View style={styles.infoView}>
            <Text style={[styles.infoTitleText, { color: themeText }]}>
              교육일정
            </Text>
            <Text style={[styles.infoValueText, { color: themeText }]}>
              2025 / 10 / 31 ~ 2025 / 11 / 03
            </Text>
            <Text style={[styles.infoValueText, { color: themeText }]}>
              - 토요일 (오후 02 : 30 ~ 오후 03 : 30)
            </Text>
            <Text style={[styles.infoValueText, { color: themeText }]}>
              - 토요일 (오후 02 : 30 ~ 오후 03 : 30)
            </Text>
          </View>

          <View style={styles.infoView}>
            <Text style={[styles.infoTitleText, { color: themeText }]}>
              신청기간
            </Text>
            <Text style={[styles.infoValueText, { color: themeText }]}>
              [1차]
            </Text>
            <Text style={[styles.infoValueText, { color: themeText }]}>
              시작 - 2025 / 10 / 31 (오전 09 : 00)
            </Text>
            <Text style={[styles.infoValueText, { color: themeText }]}>
              마감 - 2025 / 10 / 31 (오후 06 : 00)
            </Text>
          </View>
        </View>

        <View
          style={[styles.sectionView, { backgroundColor: themeBackground }]}
        >
          <Text style={[styles.sectionTitle, { color: themeText }]}>장소</Text>
          <View style={styles.infoView}>
            <Text style={[styles.infoValueText, { color: themeText }]}>
              송파구 평생학습원 (위례, Creative룸)
            </Text>
            <Text
              style={[styles.infoValueText, { color: themeText, opacity: 0.5 }]}
            >
              서울 송파구 마천로35길 12
            </Text>
          </View>
        </View>

        <View
          style={[styles.sectionView, { backgroundColor: themeBackground }]}
        >
          <Text style={[styles.sectionTitle, { color: themeText }]}>
            상세내용
          </Text>
          <RenderHtml
            contentWidth={width - 2 * Sizing.horizontalScreenPadding}
            tagsStyles={htmlStyles}
            source={{ html: `<body>${SAMPLE_HTML}</body>` }}
          />
        </View>
      </ScrollView>

      <SafeAreaView
        style={[styles.bottomBar, { backgroundColor: themeBackground }]}
        edges={["bottom"]}
      >
        <View style={styles.bottomLeft}>
          <Text style={[styles.bottomLeftSubText, { color: themeText }]}>
            {IS_REGISTERING ? "전화, 온라인" : "신청까지"}
          </Text>
          <Text style={[styles.bottomLeftMainText, { color: themeText }]}>
            {IS_REGISTERING ? "신청중" : "D-23"}
          </Text>
        </View>
        {IS_REGISTERING ? (
          <>
            <TouchableOpacity
              style={[
                styles.bottomButton,
                { borderWidth: 0.5, borderColor: themeTint },
              ]}
              activeOpacity={0.6}
            >
              <Text style={[styles.buttonText, { color: themeTint }]}>
                전화 걸기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bottomButton, { backgroundColor: themeTint }]}
              activeOpacity={0.6}
            >
              <Text style={[styles.buttonText, { color: themeBackground }]}>
                온라인 신청
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[
              styles.bottomButton,
              { borderWidth: 0.5, borderColor: themeTint },
            ]}
            activeOpacity={0.6}
          >
            <Text style={[styles.buttonText, { color: themeTint }]}>
              찜하기
            </Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
}

const htmlStyles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  navigationBar: {
    paddingHorizontal: Sizing.horizontalScreenPadding,
    paddingVertical: 20,
    flexDirection: "row",
    gap: 16,
  },

  backButton: {
    marginEnd: "auto",
  },

  bodyScrollView: {
    flex: 1,
  },

  bodyScrollViewContainer: {
    gap: 8,
  },

  pillView: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  originalTitleText: {
    fontSize: 16,
    opacity: 0.5,
    marginBottom: 2,
  },

  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 36,
  },

  institutionView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },

  institutionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginEnd: "auto",
  },

  institutionButton: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 4,
  },

  institutionButtonText: {
    fontSize: 14,
  },

  shortInfoView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 36,
    gap: 28,
  },

  shortInfoFragment: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  shortInfoText: {
    fontWeight: "bold",
    fontSize: 14,
  },

  infoView: {
    paddingBottom: 32,
  },

  infoTitleText: {
    fontWeight: "bold",
    fontSize: 14,
    opacity: 0.5,
    marginBottom: 8,
  },

  infoValueText: {
    fontSize: 16,
    marginBottom: 6,
  },

  sectionView: {
    paddingHorizontal: Sizing.horizontalScreenPadding,
  },

  sectionTitle: {
    paddingVertical: 24,
    fontSize: 18,
    fontWeight: "bold",
  },

  bottomBar: {
    paddingHorizontal: Sizing.horizontalScreenPadding,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
  },

  bottomLeft: {
    marginEnd: "auto",
  },

  bottomLeftSubText: {
    fontSize: 14,
    opacity: 0.5,
    marginBottom: 4,
  },

  bottomLeftMainText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  bottomButton: {
    borderRadius: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

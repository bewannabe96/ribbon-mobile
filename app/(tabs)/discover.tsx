import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type DropdownProps = {
  title: string;
};

function Dropdown(props: DropdownProps) {
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        flexDirection: "row",
        backgroundColor: "#FFFEFD33",
        borderColor: "#FFFFFF1A",
        alignItems: "center",
        paddingStart: 14,
        paddingEnd: 10,
        paddingVertical: 6,
        borderRadius: 20,
      }}
    >
      <Text style={{ color: "white" }}>{props.title}</Text>
      <MaterialCommunityIcons name="chevron-down" color="white" size={18} />
    </TouchableOpacity>
  );
}

export default function DiscoverScreen() {
  return (
    <View style={{ height: "100%" }}>
      <Image
        source={require("@/assets/images/landing-dummy.png")}
        style={styles.image}
        contentFit="cover"
      />
      <Image
        source={require("@/assets/images/landing-dummy.png")}
        style={styles.imageMirror}
        contentFit="cover"
      />
      <SafeAreaView style={{ position: "absolute", width: "100%" }}>
        <ScrollView
          horizontal
          contentContainerStyle={{
            minWidth: "100%",
            paddingHorizontal: 20,
            paddingVertical: 20,
            gap: 12,
          }}
          showsHorizontalScrollIndicator={false}
        >
          <Dropdown title="Dating Intentions" />
          <Dropdown title="Location" />
          <Dropdown title="Education" />
        </ScrollView>
      </SafeAreaView>
      <View style={styles.bottomOverlayView}>
        <MaskedView
          maskElement={
            <LinearGradient
              style={StyleSheet.absoluteFill}
              colors={["transparent", "black"]}
            />
          }
          style={StyleSheet.absoluteFill}
        >
          <BlurView
            intensity={50}
            style={StyleSheet.absoluteFill}
            tint="dark"
          />
        </MaskedView>
        <View style={styles.contentView}>
          <View style={{ flex: 1 }}>
            <Text style={styles.nameText}>{"Jaewon Lee"}</Text>
            <Text style={styles.descText}>
              {
                "나에 대한 간단 소개 키워드로 어떻게 보여줄지 고민합니다. 어떻게 보여줄지 저렇게 보여줄지 모르겠어요."
              }
            </Text>
            <View style={styles.uploadTimeRow}>
              <MaterialIcons name="access-time" color="white" size={16} />
              <Text style={styles.uploadTimeText}>Just now</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.likeButton}>
            <MaterialCommunityIcons
              name="heart-outline"
              color="white"
              size={24}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const IMAGE_CUTOFF_RATIO = "80%";

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: IMAGE_CUTOFF_RATIO,
  },
  imageMirror: {
    width: "100%",
    height: IMAGE_CUTOFF_RATIO,
    position: "absolute",
    top: IMAGE_CUTOFF_RATIO,
    transform: [{ scaleY: -1 }],
  },
  bottomOverlayView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  contentView: {
    flexDirection: "row",
    gap: 36,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 80,
  },
  nameText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 28,
    letterSpacing: 1,
  },
  descText: {
    color: "white",
    opacity: 0.75,
    marginVertical: 20,
  },
  uploadTimeRow: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  uploadTimeText: {
    color: "white",
  },
  likeButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
});

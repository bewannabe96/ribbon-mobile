import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Section } from "@/components/ui/section";
import { Color, Sizing, SizingScale } from "@/constants/theme";
import { ChevronRight } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback } from "react";
import * as WebBrowser from "expo-web-browser";
import { useLoadingStore } from "@/store";

export default function SettingsSection() {
  const { isSignedIn, signOut } = useAuth();
  const { show, hide } = useLoadingStore();

  const onTermsOfServicePressed = useCallback(async () => {
    const url = process.env.EXPO_PUBLIC_TERMS_OF_SERVICE_URL;
    if (url) await WebBrowser.openBrowserAsync(url);
  }, []);

  const onPrivacyPolicyPressed = useCallback(async () => {
    const url = process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL;
    if (url) await WebBrowser.openBrowserAsync(url);
  }, []);

  const onFeedbackPressed = useCallback(async () => {
    const url = process.env.EXPO_PUBLIC_FEEDBACK_URL;
    if (url) await WebBrowser.openBrowserAsync(url);
  }, []);

  const onCustomerServicePressed = useCallback(async () => {
    const url = process.env.EXPO_PUBLIC_CUSTOMER_SERVICE_URL;
    if (url) await Linking.openURL(url);
  }, []);

  const onSignOut = useCallback(async () => {
    const confirmed = await new Promise((resolve) =>
      Alert.alert("로그아웃", "정말로 로그아웃 하시겠습니까?", [
        { text: "취소", style: "cancel", onPress: resolve.bind(null, false) },
        { text: "확인", onPress: resolve.bind(null, true) },
      ]),
    );

    if (!confirmed) return;

    try {
      show();
      await signOut();
    } finally {
      hide();
    }
  }, [hide, show, signOut]);

  return (
    <Section>
      <View style={styles.listButtonView}>
        <TouchableOpacity
          style={styles.listButton}
          onPress={onTermsOfServicePressed}
        >
          <Text style={styles.listButtonText}>서비스 이용약관</Text>
          <ChevronRight size={20} color={Color.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listButton}
          onPress={onPrivacyPolicyPressed}
        >
          <Text style={styles.listButtonText}>개인정보처리 방침</Text>
          <ChevronRight size={20} color={Color.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listButton}
          onPress={onCustomerServicePressed}
        >
          <Text style={styles.listButtonText}>고객센터</Text>
          <ChevronRight size={20} color={Color.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.listButton} onPress={onFeedbackPressed}>
          <Text style={styles.listButtonText}>피드백</Text>
          <ChevronRight size={20} color={Color.text} />
        </TouchableOpacity>
        {isSignedIn && (
          <TouchableOpacity style={styles.listButton} onPress={onSignOut}>
            <Text style={styles.listButtonText}>로그아웃</Text>
            <ChevronRight size={20} color={Color.text} />
          </TouchableOpacity>
        )}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  listButtonView: {
    gap: SizingScale[4],
  },

  listButton: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[3],
    flexDirection: "row",
    justifyContent: "space-between",
  },

  listButtonText: {
    fontSize: 16,
    color: Color.text,
    fontFamily: "Pretendard",
  },
});

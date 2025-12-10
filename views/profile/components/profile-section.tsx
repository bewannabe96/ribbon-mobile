import { StyleSheet, Text, View } from "react-native";
import { Section, SectionBody } from "@/components/ui/section";
import { SizingScale, StaticColor } from "@/constants/theme";
import Button from "@/components/ui/button";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileSection() {
  const { user } = useAuth();

  return (
    <Section>
      <SectionBody>
        {user ? (
          <View style={styles.profileView}>
            {user.profileImageUrl && (
              <Image
                style={styles.profileImage}
                source={user.profileImageUrl}
                contentFit="cover"
              />
            )}
            <View>
              <View style={styles.usernameView}>
                <Text style={styles.usernameText}>{user.username}</Text>
                <Text style={styles.usernameSuffixText}>님</Text>
              </View>
              <Text style={styles.usernameSuffixText}>안녕하세요!</Text>
            </View>
          </View>
        ) : (
          <Button
            label="로그인 / 회원가입"
            variant="outline"
            size="lg"
            onPress={() => router.push("/sign-in")}
          />
        )}
      </SectionBody>
    </Section>
  );
}

const styles = StyleSheet.create({
  profileView: {
    flexDirection: "row",
    gap: SizingScale[1],
    alignItems: "center",
  },

  profileImage: {
    height: 64,
    width: 64,
    borderRadius: 64,
    backgroundColor: StaticColor.gray100,
    marginEnd: SizingScale[3],
  },

  usernameView: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: SizingScale[1],
  },

  usernameText: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "bold",
    fontFamily: "Pretendard",
  },

  usernameSuffixText: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: "Pretendard",
  },
});

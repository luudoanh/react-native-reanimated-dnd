import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";

export function Footer() {
  const handlePress = () => {
    Linking.openURL("https://github.com/entropyconquers");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Made with <Text style={styles.heart}>❤️</Text>
        {" by "}
        <TouchableOpacity onPress={handlePress} style={styles.linkContainer}>
          <Text style={styles.link}>Vishesh Raheja</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: "#000000",
    borderTopWidth: 0.5,
    borderTopColor: "#2C2C2E",
  },
  text: {
    fontSize: 14,
    fontFamily: "KumbhSans_400Regular",
    color: "#8E8E93",
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  heart: {
    fontSize: 14,
    color: "#FF3B30",
  },
  linkContainer: {
    // This allows the TouchableOpacity to be inline with the text
  },
  link: {
    fontSize: 14,
    fontFamily: "KumbhSans_500Medium",
    color: "#FF3B30",
    textDecorationLine: "underline",
  },
});

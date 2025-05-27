// App.tsx
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppNavigator } from "./navigation/AppNavigator";
import { Platform, StyleSheet, View } from "react-native";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#000000" }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#000000",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={Platform.OS === "web" ? styles.webContainer : styles.container}
        >
          <AppNavigator />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

// Styles are no longer needed here as they are in CustomDndExample.tsx
const styles = StyleSheet.create({
  webContainer: {
    maxHeight: 750,
    maxWidth: 350,
    height: "100%",
    width: "100%",
    borderWidth: 5,
    borderColor: "#66666640",
    borderRadius: 50,
    backgroundColor: "#000000",
    overflow: "hidden",
    paddingVertical: 12,
    paddingTop: 20,
  },
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "#000000",
  },
});

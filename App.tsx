// App.tsx
import React from "react";
// import { View, Text, StyleSheet } from "react-native"; // No longer directly used
// import { DropProvider } from "./context/DropContext"; // Handled within CustomDndExample
// import { Droppable } from "./components/Droppable"; // No longer directly used
// import { Draggable } from "./components/Draggable"; // No longer directly used
// import { GestureHandlerRootView } from "react-native-gesture-handler"; // Handled within CustomDndExample
import CustomDndExample from "./components/CustomDndExample";

export default function App() {
  return <CustomDndExample />;
}

// Styles are no longer needed here as they are in CustomDndExample.tsx
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fafafa",
//   },
//   slot: {
//     position: "absolute",
//     width: 120,
//     height: 60,
//     borderWidth: 2,
//     borderStyle: "dashed",
//     borderColor: "#666",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   slotActive: {
//     backgroundColor: "#e0ffe0",
//     borderColor: "#3c763d",
//   },
//   card: {
//     position: "absolute",
//     width: 100,
//     height: 50,
//     backgroundColor: "#fff",
//     borderRadius: 6,
//     borderWidth: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

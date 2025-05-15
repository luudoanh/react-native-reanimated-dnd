// App.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DropProvider, Droppable } from "./components/Droppable";
import { Draggable } from "./components/Draggable";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider>
        <View style={styles.container}>
          {/* Two drop zones */}
          <Droppable
            style={[styles.slot, { top: 200, left: 30 }]}
            onDrop={(data) =>
              alert("Dropped in zone #1: " + JSON.stringify(data))
            }
          >
            <Text>Zone #1</Text>
          </Droppable>

          <Droppable
            style={[styles.slot, { top: 80, left: 200 }]}
            onDrop={(data) =>
              alert("Dropped in zone #2: " + JSON.stringify(data))
            }
          >
            <Text>Zone #2</Text>
          </Droppable>

          {/* Two draggable cards */}
          <Draggable
            data={{ word: "Intrepid" }}
            style={[styles.card, { top: 300, left: 30 }]}
          >
            <Text>Intrepid</Text>
          </Draggable>

          <Draggable
            data={{ word: "Lucid" }}
            style={[styles.card, { top: 300, left: 180 }]}
          >
            <Text>Lucid</Text>
          </Draggable>
        </View>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  slot: {
    position: "absolute",
    width: 120,
    height: 60,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#666",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    position: "absolute",
    width: 100,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

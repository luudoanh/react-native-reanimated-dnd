import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  useDraggable,
  UseDraggableOptions,
  UseDraggableReturn,
} from "../hooks/useDraggable";
import {
  useDroppable,
  UseDroppableOptions,
  UseDroppableReturn,
} from "../hooks/useDroppable";
import { DropProvider } from "../context/DropContext";

// 1. Custom Draggable Component using the hook
interface MyDraggableProps<TData> extends UseDraggableOptions<TData> {
  children: React.ReactNode;
  initialStyle?: StyleProp<ViewStyle>;
}

const MyDraggable = <TData extends object>({
  children,
  initialStyle,
  ...draggableOptions
}: MyDraggableProps<TData>) => {
  const animatedViewRef = useRef<Animated.View>(null);
  const { animatedViewProps, gesture }: UseDraggableReturn =
    useDraggable<TData>(draggableOptions, animatedViewRef);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        ref={animatedViewRef}
        {...animatedViewProps}
        style={[initialStyle, animatedViewProps.style]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

// 2. Custom Droppable Component using the hook
interface MyDroppableProps<TData> extends UseDroppableOptions<TData> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const MyDroppable = <TData extends object>({
  children,
  style,
  onActiveChange,
  ...droppableOptions
}: MyDroppableProps<TData>) => {
  const viewRef = useRef<View>(null);
  const { viewProps, isActive }: UseDroppableReturn = useDroppable<TData>(
    {
      ...droppableOptions,
      onActiveChange,
    },
    viewRef
  );

  return (
    <View
      ref={viewRef}
      {...viewProps}
      style={[style, isActive && styles.slotActive]}
    >
      {children}
    </View>
  );
};

// 3. Example Usage
export default function CustomDndExample() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider>
        <View style={styles.container}>
          <MyDroppable<{
            id: number;
            message: string;
          }>
            style={styles.customSlot1}
            onDrop={(data) =>
              alert(`Dropped on Custom Zone 1: ${data.message}`)
            }
            onActiveChange={(active) => {
              console.log("Custom Zone 1 active (from example usage):", active);
            }}
          >
            <Text>Custom Drop Zone 1</Text>
          </MyDroppable>

          <MyDroppable<{
            id: number;
            message: string;
          }>
            style={styles.customSlot2}
            onDrop={(data) =>
              alert(`Dropped on Custom Zone 2: ${data.message}`)
            }
          >
            <Text>Custom Drop Zone 2 (active style, no log)</Text>
          </MyDroppable>

          <MyDraggable<{
            id: number;
            message: string;
          }>
            data={{ id: 1, message: "Hello from Draggable 1" }}
            initialStyle={styles.customCard1}
            onDragStart={() => console.log("Drag Start: Card 1")}
            onDragEnd={() => console.log("Drag End: Card 1")}
          >
            <View style={styles.cardContent}>
              <Text>Drag Me (1)</Text>
            </View>
          </MyDraggable>

          <MyDraggable<{
            id: number;
            message: string;
          }>
            data={{ id: 2, message: "Greetings from Draggable 2" }}
            initialStyle={styles.customCard2}
          >
            <View style={styles.cardContent}>
              <Text>Drag Me (2)</Text>
            </View>
          </MyDraggable>
        </View>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#f0f0f0",
  },
  customSlot1: {
    position: "absolute",
    top: 100,
    left: 30,
    width: 200,
    height: 80,
    borderWidth: 2,
    borderColor: "blue",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightblue",
  },
  customSlot2: {
    position: "absolute",
    top: 250,
    left: 150,
    width: 180,
    height: 100,
    borderWidth: 2,
    borderColor: "purple",
    borderStyle: "dotted",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6e6fa",
  },
  slotActive: {
    backgroundColor: "#add8e6",
    borderColor: "darkblue",
  },
  customCard1: {
    position: "absolute",
    top: 400,
    left: 50,
  },
  customCard2: {
    position: "absolute",
    top: 500,
    left: 150,
  },
  cardContent: {
    width: 120,
    height: 60,
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "darkgreen",
  },
});

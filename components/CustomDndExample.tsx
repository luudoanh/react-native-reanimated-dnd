import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Alert,
  ScrollView,
} from "react-native";
import Animated, { withTiming, Easing } from "react-native-reanimated";
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

// 1. Custom Draggable Component using the hook (restored)
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

// 2. Custom Droppable Component using the hook (restored)
interface MyDroppableProps<TData> extends UseDroppableOptions<TData> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const MyDroppable = <TData extends object>({
  children,
  style,
  ...droppableOptions
}: MyDroppableProps<TData>) => {
  const viewRef = useRef<View>(null);
  const { viewProps, isActive }: UseDroppableReturn = useDroppable<TData>(
    droppableOptions,
    viewRef
  );

  const activeStyle = droppableOptions.onActiveChange ? styles.slotActive : {};

  return (
    <View ref={viewRef} {...viewProps} style={[style, isActive && activeStyle]}>
      {children}
    </View>
  );
};

// Example of a custom animation function
const customAnimation: UseDraggableOptions<any>["animationFunction"] = (
  toValue
) => {
  "worklet";
  return withTiming(toValue, {
    duration: 300,
    easing: Easing.out(Easing.cubic),
  });
};

interface DraggableItemData {
  id: string;
  label: string;
  backgroundColor: string;
}

export default function CustomDndExample() {
  const boundsViewRef = useRef<View>(null);
  const commonCardStyle = styles.cardContent;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider>
        <ScrollView
          style={styles.scrollViewBase}
          contentContainerStyle={styles.scrollContentContainer}
        >
          <Text style={styles.header}>Drag & Drop Playground</Text>

          {/* Section 1: Free Draggables & Multiple Drop Zones */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Free Movement & Drop Zones</Text>
            <View style={styles.dropZoneArea}>
              <MyDroppable<DraggableItemData>
                style={[styles.dropZone, styles.dropZone1]}
                onDrop={(data) =>
                  Alert.alert("Drop!", `"${data.label}" dropped on Zone Alpha`)
                }
                onActiveChange={(active) =>
                  console.log(`Zone Alpha active: ${active}`)
                }
              >
                <Text style={styles.dropZoneText}>Drop Zone Alpha</Text>
              </MyDroppable>
              <MyDroppable<DraggableItemData>
                style={[styles.dropZone, styles.dropZone2]}
                onDrop={(data) =>
                  Alert.alert("Drop!", `"${data.label}" dropped on Zone Beta`)
                }
              >
                <Text style={styles.dropZoneText}>Drop Zone Beta</Text>
              </MyDroppable>
            </View>

            <View style={styles.draggableItemsArea}>
              <MyDraggable<DraggableItemData>
                data={{
                  id: "D1",
                  label: "Draggable 1 (Basic)",
                  backgroundColor: "#a2d2ff",
                }}
                initialStyle={[
                  styles.draggable,
                  { top: 0, left: 0, backgroundColor: "#a2d2ff" },
                ]}
                onDragStart={(item) => console.log(`Drag Start: ${item.label}`)}
                onDragEnd={(item) => console.log(`Drag End: ${item.label}`)}
                onDragging={({ tx, ty, itemData }) =>
                  console.log(
                    `Dragging ${itemData.label}: tx=${tx.toFixed(
                      0
                    )}, ty=${ty.toFixed(0)}`
                  )
                }
              >
                <View style={commonCardStyle}>
                  <Text>Item 1</Text>
                  <Text style={styles.cardSubText}>(Basic Drag)</Text>
                </View>
              </MyDraggable>

              <MyDraggable<DraggableItemData>
                data={{
                  id: "D2",
                  label: "Draggable 2 (Custom Anim)",
                  backgroundColor: "#bde0fe",
                }}
                initialStyle={[
                  styles.draggable,
                  { top: 80, left: 50, backgroundColor: "#bde0fe" },
                ]}
                animationFunction={customAnimation}
              >
                <View style={commonCardStyle}>
                  <Text>Item 2</Text>
                  <Text style={styles.cardSubText}>(Custom Anim)</Text>
                </View>
              </MyDraggable>
            </View>
          </View>

          {/* Section 2: Bounded Dragging */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bounded Dragging Area</Text>
            <View ref={boundsViewRef} style={styles.boundsContainer}>
              <MyDraggable<DraggableItemData>
                data={{
                  id: "D3",
                  label: "Draggable 3 (Bounded)",
                  backgroundColor: "#ffafcc",
                }}
                dragBoundsRef={boundsViewRef}
                initialStyle={{ backgroundColor: "#ffafcc" }}
              >
                <View style={commonCardStyle}>
                  <Text>Item 3</Text>
                  <Text style={styles.cardSubText}>(Bounded)</Text>
                </View>
              </MyDraggable>
            </View>
          </View>

          {/* Section 3: Disabled Elements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disabled Elements</Text>
            <View style={styles.disabledItemsArea}>
              <MyDraggable<DraggableItemData>
                data={{
                  id: "D4",
                  label: "Draggable 4 (Disabled)",
                  backgroundColor: "#cccccc",
                }}
                dragDisabled={true}
                initialStyle={{ backgroundColor: "#cccccc" }}
              >
                <View style={commonCardStyle}>
                  <Text>Item 4</Text>
                  <Text style={styles.cardSubText}>(Drag Disabled)</Text>
                </View>
              </MyDraggable>
              <MyDroppable<DraggableItemData>
                style={[styles.dropZone, styles.dropZoneDisabled]}
                onDrop={() =>
                  Alert.alert("Error", "Should not drop on disabled zone!")
                }
                dropDisabled={true}
              >
                <Text style={styles.dropZoneText}>Drop Zone Gamma</Text>
                <Text style={styles.cardSubText}>(Drop Disabled)</Text>
              </MyDroppable>
            </View>
          </View>
        </ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollViewBase: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  scrollContentContainer: {
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#555",
  },
  dropZoneArea: {
    flexDirection: "row",
    justifyContent: "space-around",
    minHeight: 100,
    marginBottom: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  dropZone: {
    width: 130,
    height: 80,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: 5,
  },
  dropZone1: {
    borderColor: "#007bff",
    backgroundColor: "rgba(0, 123, 255, 0.1)",
  },
  dropZone2: {
    borderColor: "#28a745",
    backgroundColor: "rgba(40, 167, 69, 0.1)",
  },
  dropZoneText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
  },
  slotActive: {
    backgroundColor: "rgba(0, 123, 255, 0.2)",
    borderColor: "#0056b3",
  },
  draggableItemsArea: {
    minHeight: 150,
    position: "relative",
  },
  draggable: {
    position: "absolute",
  },
  cardContent: {
    width: 110,
    height: 65,
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  cardSubText: {
    fontSize: 10,
    color: "#333",
    marginTop: 2,
  },
  boundsContainer: {
    minHeight: 150,
    borderWidth: 2,
    borderColor: "#dc3545",
    backgroundColor: "rgba(220, 53, 69, 0.05)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  disabledItemsArea: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  dropZoneDisabled: {
    borderColor: "#6c757d",
    backgroundColor: "rgba(108, 117, 125, 0.1)",
  },
});

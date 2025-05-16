import React, { useRef, useCallback } from "react";
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
import {
  DropProvider,
  DropAlignment,
  DropOffset,
  DropProviderRef,
} from "../context/DropContext";
import { Droppable } from "../components/Droppable";
import { Draggable } from "../components/Draggable";

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
  const {
    animatedViewProps,
    gesture,
    isDragging,
    activeStyle,
  }: UseDraggableReturn = useDraggable<TData>(
    draggableOptions,
    animatedViewRef
  );

  // Apply active style when dragging
  const combinedStyle = [
    initialStyle,
    animatedViewProps.style,
    isDragging && activeStyle,
  ];

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        ref={animatedViewRef}
        {...animatedViewProps}
        style={combinedStyle}
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
  const boundsViewRef2 = useRef<View>(null);
  const commonCardStyle = styles.cardContent;
  const dropProviderRef = useRef<DropProviderRef>(null);

  const handleScrollEnd = useCallback(() => {
    // Debounce the call to prevent rapid firing during scroll bounce
    // User had removed the timeout ref, re-adding a simplified version here
    // as direct calls on every micro-scroll-end can be excessive.
    // This is a local debounce, not using the previous shared timeout ref.
    let localScrollTimeout: NodeJS.Timeout | null = null;
    if (localScrollTimeout) {
      clearTimeout(localScrollTimeout);
    }
    localScrollTimeout = setTimeout(() => {
      dropProviderRef.current?.requestPositionUpdate();
    }, 50);
  }, []);

  const handleLayoutUpdateComplete = useCallback(() => {
    // This can be used for logging or other side effects after positions are updated.
    // console.log('DropProvider: Position recalculation completed.');
  }, []);

  // Custom active styles for different drop zones
  const pulseActiveStyle: StyleProp<ViewStyle> = {
    borderColor: "#ff6b6b",
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  };

  const glowActiveStyle: StyleProp<ViewStyle> = {
    borderColor: "#4cc9f0",
    backgroundColor: "rgba(76, 201, 240, 0.2)",
    shadowColor: "#4cc9f0",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 10,
  };

  // Custom active styles for draggables
  const draggablePulseStyle: StyleProp<ViewStyle> = {
    borderColor: "#ff6b6b",
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  };

  const draggableGlowStyle: StyleProp<ViewStyle> = {
    borderColor: "#4cc9f0",
    backgroundColor: "rgba(76, 201, 240, 0.3)",
    shadowColor: "#4cc9f0",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 10,
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider
        ref={dropProviderRef}
        onLayoutUpdateComplete={handleLayoutUpdateComplete}
      >
        <ScrollView
          style={styles.scrollViewBase}
          contentContainerStyle={styles.scrollContentContainer}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
        >
          <Text style={styles.header}>Drag & Drop Playground</Text>

          {/* Add new section for draggable active styles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Draggable Active Styles</Text>
            <Text style={styles.sectionDescription}>
              These items show different active styles when being dragged
            </Text>

            <View style={styles.draggableItemsArea}>
              <Draggable<DraggableItemData>
                data={{
                  id: "D-AS1",
                  label: "Pulse Effect Draggable",
                  backgroundColor: "#ffd6ff",
                }}
                style={[
                  styles.draggable,
                  { top: 0, left: 30, backgroundColor: "#ffd6ff" },
                ]}
                activeStyle={draggablePulseStyle}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Pulse Effect</Text>
                  <Text style={styles.cardHint}>Try me!</Text>
                </View>
              </Draggable>

              <Draggable<DraggableItemData>
                data={{
                  id: "D-AS2",
                  label: "Glow Effect Draggable",
                  backgroundColor: "#c8b6ff",
                }}
                style={[
                  styles.draggable,
                  { top: 0, left: 170, backgroundColor: "#c8b6ff" },
                ]}
                activeStyle={draggableGlowStyle}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Glow Effect</Text>
                  <Text style={styles.cardHint}>Try me!</Text>
                </View>
              </Draggable>

              {/* Using MyDraggable with activeStyle */}
              <MyDraggable<DraggableItemData>
                data={{
                  id: "D-AS3",
                  label: "Custom Component with Active Style",
                  backgroundColor: "#b8e0d2",
                }}
                initialStyle={[
                  styles.draggable,
                  { top: 100, left: 30, backgroundColor: "#b8e0d2" },
                ]}
                activeStyle={{
                  borderWidth: 2,
                  borderColor: "#006d77",
                  shadowColor: "#006d77",
                  shadowOpacity: 0.7,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: 8,
                }}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Custom Comp</Text>
                  <Text style={styles.cardHint}>With Active Style</Text>
                </View>
              </MyDraggable>

              {/* Another example with different style */}
              <MyDraggable<DraggableItemData>
                data={{
                  id: "D-AS4",
                  label: "Zoom Effect",
                  backgroundColor: "#eac4d5",
                }}
                initialStyle={[
                  styles.draggable,
                  { top: 100, left: 170, backgroundColor: "#eac4d5" },
                ]}
                activeStyle={{
                  transform: [{ scale: 1.2 }],
                  zIndex: 10,
                }}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Zoom</Text>
                  <Text style={styles.cardHint}>Scale up</Text>
                </View>
              </MyDraggable>
            </View>
          </View>

          {/* Section 1: Free Draggables & Multiple Drop Zones */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Drag & Drop</Text>
            <View style={styles.dropZoneArea}>
              <MyDroppable<DraggableItemData>
                style={[styles.dropZone, styles.dropZoneBlue]}
                onDrop={(data) =>
                  Alert.alert("Drop!", `"${data.label}" dropped on Zone Alpha`)
                }
              >
                <Text style={styles.dropZoneText}>Zone Alpha</Text>
                <Text style={styles.dZoneSubText}>(Align: Center)</Text>
              </MyDroppable>
              <MyDroppable<DraggableItemData>
                style={[styles.dropZone, styles.dropZoneGreen]}
                onDrop={(data) =>
                  Alert.alert("Drop!", `"${data.label}" dropped on Zone Beta`)
                }
                dropAlignment="top-left"
              >
                <Text style={styles.dropZoneText}>Zone Beta</Text>
                <Text style={styles.dZoneSubText}>(Align: TL, Offset)</Text>
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
                  { top: 0, left: 20, backgroundColor: "#a2d2ff" },
                ]}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Basic</Text>
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
                  { top: 0, left: 170, backgroundColor: "#bde0fe" },
                ]}
                animationFunction={customAnimation}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Custom Anim</Text>
                </View>
              </MyDraggable>
            </View>
          </View>

          {/* Section with custom activeStyle prop examples */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom Active Styles</Text>
            <View style={styles.dropZoneArea}>
              <View style={styles.dropZoneColumn}>
                <Text style={styles.customStyleLabel}>Pulse Effect</Text>
                <Droppable<DraggableItemData>
                  style={[styles.dropZone, styles.customDropZone]}
                  onDrop={(data: DraggableItemData) =>
                    Alert.alert("Dropped!", `${data.label} on pulse zone`)
                  }
                  activeStyle={pulseActiveStyle}
                >
                  <Text>Pulse Zone</Text>
                </Droppable>
              </View>

              <View style={styles.dropZoneColumn}>
                <Text style={styles.customStyleLabel}>Glow Effect</Text>
                <Droppable<DraggableItemData>
                  style={[styles.dropZone, styles.customDropZone]}
                  onDrop={(data: DraggableItemData) =>
                    Alert.alert("Dropped!", `${data.label} on glow zone`)
                  }
                  activeStyle={glowActiveStyle}
                >
                  <Text>Glow Zone</Text>
                </Droppable>
              </View>
            </View>

            <View style={styles.draggableItemsArea}>
              <MyDraggable<DraggableItemData>
                data={{
                  id: "D10",
                  label: "Drop me on the custom zones",
                  backgroundColor: "#c1a1d3",
                }}
                initialStyle={[
                  styles.draggable,
                  { top: 0, left: 100, backgroundColor: "#c1a1d3" },
                ]}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Try Me</Text>
                </View>
              </MyDraggable>
            </View>
          </View>

          {/* Section 2: Bounded Dragging */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bounded Dragging</Text>
            <View ref={boundsViewRef} style={styles.boundsContainer}>
              <MyDroppable<DraggableItemData>
                style={[styles.innerDropZone, styles.dropZoneBlue]}
                onDrop={(data) =>
                  Alert.alert(
                    "Drop!",
                    `"${data.label}" dropped in bounded zone`
                  )
                }
              >
                <Text style={styles.dropZoneText}>Drop Here</Text>
              </MyDroppable>

              <MyDraggable<DraggableItemData>
                data={{
                  id: "D3",
                  label: "Draggable 3 (Bounded)",
                  backgroundColor: "#ffafcc",
                }}
                dragBoundsRef={boundsViewRef}
                initialStyle={[
                  styles.cardCentered,
                  { backgroundColor: "#ffafcc" },
                ]}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Bounded</Text>
                </View>
              </MyDraggable>
            </View>
          </View>

          {/* Section 3: Axis Constrained Draggables */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>X-Axis Constrained Dragging</Text>
            <View style={styles.axisConstraintContainer}>
              <MyDroppable<DraggableItemData>
                style={[
                  styles.xAxisDropZone,
                  styles.dropZoneBlue,
                  { left: 10 },
                ]}
                onDrop={(data) =>
                  Alert.alert("Drop!", `"${data.label}" dropped on left zone`)
                }
              >
                <Text style={styles.dropZoneText}>Left</Text>
              </MyDroppable>

              <MyDroppable<DraggableItemData>
                style={[
                  styles.xAxisDropZone,
                  styles.dropZoneGreen,
                  { right: 10 },
                ]}
                onDrop={(data) =>
                  Alert.alert("Drop!", `"${data.label}" dropped on right zone`)
                }
              >
                <Text style={styles.dropZoneText}>Right</Text>
              </MyDroppable>

              <MyDraggable<DraggableItemData>
                data={{
                  id: "D5",
                  label: "X-axis Constrained",
                  backgroundColor: "#80ed99",
                }}
                dragAxis="x"
                initialStyle={[
                  styles.cardCentered,
                  { backgroundColor: "#80ed99", alignSelf: "center" },
                ]}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>X-Axis Only</Text>
                  <Text style={styles.cardHint}>←→</Text>
                </View>
              </MyDraggable>
            </View>
          </View>

          {/* Section 4: Y-Axis Constrained */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Y-Axis Constrained Dragging</Text>
            <View style={styles.yAxisConstraintContainer}>
              <MyDroppable<DraggableItemData>
                style={[styles.yAxisDropZone, styles.dropZoneBlue, { top: 10 }]}
                onDrop={(data) =>
                  Alert.alert("Drop!", `"${data.label}" dropped on top zone`)
                }
              >
                <Text style={styles.dropZoneText}>Top</Text>
              </MyDroppable>

              <MyDroppable<DraggableItemData>
                style={[
                  styles.yAxisDropZone,
                  styles.dropZoneGreen,
                  { bottom: 10 },
                ]}
                onDrop={(data) =>
                  Alert.alert("Drop!", `"${data.label}" dropped on bottom zone`)
                }
              >
                <Text style={styles.dropZoneText}>Bottom</Text>
              </MyDroppable>

              <MyDraggable<DraggableItemData>
                data={{
                  id: "D6",
                  label: "Y-axis Constrained",
                  backgroundColor: "#f7d9c4",
                }}
                dragAxis="y"
                initialStyle={[
                  styles.cardCentered,
                  { backgroundColor: "#f7d9c4", alignSelf: "center" },
                ]}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Y-Axis Only</Text>
                  <Text style={styles.cardHint}>↑↓</Text>
                </View>
              </MyDraggable>
            </View>
          </View>

          {/* Section 5: Combined Constraints (Bounds + Y-axis) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bounded Y-Axis Dragging</Text>
            <View ref={boundsViewRef2} style={styles.verticalBoundsContainer}>
              <MyDroppable<DraggableItemData>
                style={[styles.yAxisBoundedDropZone, styles.dropZoneBlue]}
                onDrop={(data) =>
                  Alert.alert(
                    "Drop!",
                    `"${data.label}" dropped in bounded Y-axis zone`
                  )
                }
                dropAlignment="top-center"
              >
                <Text style={styles.dropZoneText}>Target</Text>
              </MyDroppable>

              <MyDraggable<DraggableItemData>
                data={{
                  id: "D7",
                  label: "Bounded Y-axis",
                  backgroundColor: "#c6def1",
                }}
                dragBoundsRef={boundsViewRef2}
                dragAxis="y"
                initialStyle={[
                  styles.cardCentered,
                  { backgroundColor: "#c6def1", marginTop: 20 },
                ]}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Bounded Y</Text>
                  <Text style={styles.cardHint}>↕</Text>
                </View>
              </MyDraggable>
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
    backgroundColor: "#f8f9fa",
  },
  scrollContentContainer: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#343a40",
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#343a40",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    paddingBottom: 8,
  },
  dropZoneArea: {
    flexDirection: "row",
    justifyContent: "space-around",
    minHeight: 90,
    marginBottom: 24,
  },
  dropZoneColumn: {
    alignItems: "center",
    width: "45%",
  },
  customStyleLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
    color: "#666",
  },
  customDropZone: {
    borderColor: "#adb5bd",
    backgroundColor: "rgba(173, 181, 189, 0.08)",
    height: 100,
    width: "100%",
  },
  dropZone: {
    width: "45%",
    height: 90,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: 5,
  },
  dropZoneBlue: {
    borderColor: "#4361ee",
    backgroundColor: "rgba(67, 97, 238, 0.08)",
  },
  dropZoneGreen: {
    borderColor: "#38b000",
    backgroundColor: "rgba(56, 176, 0, 0.08)",
  },
  dropZoneText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#343a40",
  },
  dZoneSubText: {
    fontSize: 10,
    color: "#6c757d",
    marginTop: 4,
  },
  slotActive: {
    backgroundColor: "rgba(67, 97, 238, 0.15)",
    borderColor: "#4361ee",
    transform: [{ scale: 1.05 }],
  },
  draggableItemsArea: {
    minHeight: 80,
    position: "relative",
  },
  draggable: {
    position: "absolute",
  },
  cardContent: {
    width: 100,
    height: 60,
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#343a40",
  },
  cardHint: {
    fontSize: 18,
    marginTop: 4,
    color: "#6c757d",
  },
  cardSubText: {
    fontSize: 10,
    color: "#6c757d",
    marginTop: 2,
  },
  boundsContainer: {
    minHeight: 180,
    borderWidth: 2,
    borderColor: "#4cc9f0",
    backgroundColor: "rgba(76, 201, 240, 0.05)",
    borderRadius: 12,
    padding: 16,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  verticalBoundsContainer: {
    height: 240,
    borderWidth: 2,
    width: 150,
    borderColor: "#4cc9f0",
    backgroundColor: "rgba(76, 201, 240, 0.05)",
    borderRadius: 12,
    padding: 16,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  innerDropZone: {
    width: "80%",
    height: 60,
    marginBottom: 20,
  },
  axisConstraintContainer: {
    height: 120,
    position: "relative",
    justifyContent: "center",
  },
  xAxisDropZone: {
    width: 90,
    height: 90,
    top: 15,
    position: "absolute",
  },
  yAxisConstraintContainer: {
    height: 200,
    position: "relative",
    justifyContent: "center",
  },
  yAxisDropZone: {
    position: "absolute",
    width: "100%",
    height: 60,
    left: 0,
    right: 0,
  },
  yAxisBoundedDropZone: {
    width: "90%",
    height: 50,
  },
  cardCentered: {
    alignSelf: "center",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 16,
  },
});

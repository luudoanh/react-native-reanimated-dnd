import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
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
  CollisionAlgorithm,
  DraggableState,
} from "../hooks/useDraggable";
import {
  useDroppable,
  UseDroppableOptions,
  UseDroppableReturn,
} from "../hooks/useDroppable";
import {
  DropProvider,
  DropProviderRef,
  DroppedItemsMap,
} from "../context/DropContext";
import { Droppable } from "../components/Droppable";
import { Draggable } from "../components/Draggable";
import { BasicDraggable } from "./BasicDraggable";
import { CustomDraggable } from "./CustomDraggable";

// 1. Custom Draggable Component using the hook (restored and modified)
interface MyDraggableProps<TData> extends UseDraggableOptions<TData> {
  children: React.ReactNode;
  initialStyle?: StyleProp<ViewStyle>;
}

// Create a context for MyDraggable
interface MyDraggableContextValue {
  gesture: any;
}

const MyDraggableContext = createContext<MyDraggableContextValue | null>(null);

// Handle component for MyDraggable
interface MyHandleProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const MyHandle = ({ children, style }: MyHandleProps) => {
  const draggableContext = useContext(MyDraggableContext);

  if (!draggableContext) {
    console.warn(
      "MyDraggable.Handle must be used within a MyDraggable component"
    );
    return <>{children}</>;
  }

  return (
    <GestureDetector gesture={draggableContext.gesture}>
      <Animated.View style={style}>{children}</Animated.View>
    </GestureDetector>
  );
};

const MyDraggableComponent = <TData extends object>({
  children,
  initialStyle,
  ...draggableOptions
}: MyDraggableProps<TData>) => {
  const animatedViewRef = useRef<Animated.View>(null);
  const { animatedViewProps, gesture, hasHandle } = useDraggable<TData>(
    {
      ...draggableOptions,
      children,
      handleComponent: MyHandle,
    },
    animatedViewRef
  );

  const combinedStyle = [initialStyle, animatedViewProps.style];

  // Create simplified context value
  const contextValue: MyDraggableContextValue = {
    gesture,
  };

  // Render with context
  const content = (
    <Animated.View
      ref={animatedViewRef}
      {...animatedViewProps}
      style={combinedStyle}
    >
      <MyDraggableContext.Provider value={contextValue}>
        {children}
      </MyDraggableContext.Provider>
    </Animated.View>
  );

  // If a handle is found, let the handle control the dragging
  // Otherwise, the entire component is draggable
  if (hasHandle) {
    return content;
  } else {
    return <GestureDetector gesture={gesture}>{content}</GestureDetector>;
  }
};

// Attach Handle as a static property
const MyDraggable = Object.assign(MyDraggableComponent, { Handle: MyHandle });

// 2. Custom Droppable Component using the hook (restored)
interface MyDroppableProps<TData> extends UseDroppableOptions<TData> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  droppableId?: string;
}

const MyDroppable = <TData extends object>({
  children,
  style,
  droppableId,
  ...droppableOptions
}: MyDroppableProps<TData>) => {
  const viewRef = useRef<View>(null);
  const { viewProps, isActive }: UseDroppableReturn = useDroppable<TData>(
    {
      ...droppableOptions,
      droppableId,
    },
    viewRef
  );

  const droppableActiveStyle = droppableOptions.onActiveChange
    ? styles.slotActive
    : {};

  return (
    <View
      ref={viewRef}
      {...viewProps}
      style={[style, isActive && droppableActiveStyle]}
    >
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
  collisionText?: string;
}

export default function CustomDndExample() {
  const boundsViewRef = useRef<View>(null);
  const boundsViewRef2 = useRef<View>(null);
  const commonCardStyle = styles.cardContent;
  const dropProviderRef = useRef<DropProviderRef>(null);

  // New state for tracking drag state of the example item
  const [dragState, setDragState] = useState<DraggableState>(
    DraggableState.IDLE
  );
  // New state to track the current dropped items map
  const [droppedItemsMap, setDroppedItemsMap] = useState<DroppedItemsMap>({});

  // Replace the interval with a callback
  const handleDroppedItemsUpdate = useCallback((items: DroppedItemsMap) => {
    setDroppedItemsMap(items);
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider
        ref={dropProviderRef}
        onDroppedItemsUpdate={handleDroppedItemsUpdate}
      >
        <ScrollView
          style={styles.scrollViewBase}
          contentContainerStyle={styles.scrollContentContainer}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
        >
          <Text style={styles.header}>Drag & Drop Playground</Text>

          {/* Add new section for Dropped Items Map tracking */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dropped Items Map Demo</Text>
            <Text style={styles.sectionDescription}>
              This example demonstrates tracking which draggables are currently
              dropped on which droppables.
            </Text>

            <View style={styles.dropZoneArea}>
              <Droppable<DraggableItemData>
                droppableId="drop-zone-1"
                style={[styles.dropZone, styles.dropZoneBlue]}
                onDrop={(data) => {
                  Alert.alert(
                    "Item Dropped",
                    `Item "${data.label}" dropped on Zone 1`
                  );
                }}
              >
                <Text style={styles.dropZoneText}>Zone 1</Text>
                <Text style={styles.dZoneSubText}>(ID: drop-zone-1)</Text>
              </Droppable>

              <Droppable<DraggableItemData>
                droppableId="drop-zone-2"
                style={[styles.dropZone, styles.dropZoneGreen]}
                onDrop={(data) => {
                  Alert.alert(
                    "Item Dropped",
                    `Item "${data.label}" dropped on Zone 2`
                  );
                }}
              >
                <Text style={styles.dropZoneText}>Zone 2</Text>
                <Text style={styles.dZoneSubText}>(ID: drop-zone-2)</Text>
              </Droppable>
            </View>

            <View style={styles.draggableItemsArea}>
              <Draggable<DraggableItemData>
                key="map-item-1"
                draggableId="map-item-1"
                data={{
                  id: "map-item-1",
                  label: "Item Alpha",
                  backgroundColor: "#f94144",
                }}
                style={[
                  styles.draggable,
                  {
                    top: 0,
                    left: 20,
                    backgroundColor: "#f94144",
                    borderRadius: 12,
                  },
                ]}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Item Alpha</Text>
                  <Text style={styles.cardHint}>ID: map-item-1</Text>
                </View>
              </Draggable>

              <Draggable<DraggableItemData>
                key="map-item-2"
                draggableId="map-item-2"
                data={{
                  id: "map-item-2",
                  label: "Item Beta",
                  backgroundColor: "#f3722c",
                }}
                style={[
                  styles.draggable,
                  {
                    top: 0,
                    left: 160,
                    backgroundColor: "#f3722c",
                    borderRadius: 12,
                  },
                ]}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Item Beta</Text>
                  <Text style={styles.cardHint}>ID: map-item-2</Text>
                </View>
              </Draggable>
            </View>

            {/* Add section to display the current mapping */}
            <View style={styles.mappingContainer}>
              <Text style={styles.mappingTitle}>Current Dropped Items:</Text>
              {Object.keys(droppedItemsMap).length === 0 ? (
                <Text style={styles.mappingEmpty}>
                  No items currently dropped
                </Text>
              ) : (
                Object.entries(droppedItemsMap).map(([draggableId, info]) => (
                  <View key={draggableId} style={styles.mappingItem}>
                    <Text style={styles.mappingText}>
                      <Text style={styles.mappingLabel}>{draggableId}</Text> is
                      dropped on zone{" "}
                      <Text style={styles.mappingValue}>
                        {info.droppableId}
                      </Text>
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>

          {/* New Section for Drag State Demo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Drag State Management Demo</Text>
            <Text style={styles.sectionDescription}>
              This example demonstrates the DraggableState enum and
              onStateChange callback. Current State:{" "}
              <Text style={getStateStyle(dragState)}>{dragState}</Text>
            </Text>

            <View style={styles.dropZoneArea}>
              <Droppable<DraggableItemData>
                droppableId="state-demo-drop-zone"
                style={[styles.dropZone, styles.dropZoneBlue]}
                onDrop={(data) => {
                  Alert.alert(
                    "Drop!",
                    `Item "${data.label}" dropped with state: ${dragState}`
                  );
                }}
              >
                <Text style={styles.dropZoneText}>Drop Target</Text>
                <Text style={styles.dZoneSubText}>(Check state changes)</Text>
              </Droppable>
            </View>

            <View style={styles.draggableItemsArea}>
              <Draggable<DraggableItemData>
                key="D-State-Demo"
                data={{
                  id: "state-demo-item",
                  label: "State Demo Item",
                  backgroundColor: "#e63946",
                }}
                style={[
                  styles.draggable,
                  {
                    top: 0,
                    left: "25%",
                    backgroundColor: "#e63946",
                    borderWidth: 2,
                    borderColor: getBorderColor(dragState),
                    borderRadius: 12,
                  },
                ]}
                onStateChange={(state) => {
                  setDragState(state);
                }}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Drag Me</Text>
                  <Text style={styles.cardHint}>State: {dragState}</Text>
                </View>
              </Draggable>
            </View>

            <View style={styles.stateInfo}>
              <View style={styles.stateItem}>
                <View
                  style={[
                    styles.stateIndicator,
                    { backgroundColor: "#90be6d" },
                  ]}
                />
                <Text style={styles.stateText}>
                  IDLE: Initial or reset state
                </Text>
              </View>
              <View style={styles.stateItem}>
                <View
                  style={[
                    styles.stateIndicator,
                    { backgroundColor: "#f8961e" },
                  ]}
                />
                <Text style={styles.stateText}>
                  DRAGGING: Currently being dragged
                </Text>
              </View>
              <View style={styles.stateItem}>
                <View
                  style={[
                    styles.stateIndicator,
                    { backgroundColor: "#577590" },
                  ]}
                />
                <Text style={styles.stateText}>
                  DROPPED: Successfully dropped on target
                </Text>
              </View>
            </View>
          </View>

          {/* Section for Collision Detection Algorithm Demo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Collision Detection Demo</Text>
            <Text style={styles.sectionDescription}>
              Try dragging the items over the drop zones. Note how 'center',
              'intersect' (default), and 'contain' behave differently.
            </Text>
            <View
              style={[
                styles.dropZoneArea,
                { minHeight: 150, justifyContent: "space-between" },
              ]}
            >
              <MyDroppable<DraggableItemData>
                droppableId="narrow-zone"
                style={[
                  styles.dropZone,
                  styles.dropZoneBlue,
                  { width: "30%", height: 120 },
                ]} // Narrow zone
                onDrop={(data) =>
                  Alert.alert(
                    "Drop!",
                    `Item "${data.label}" with ${data.collisionText} dropped on Narrow Zone!`
                  )
                }
              >
                <Text style={styles.dropZoneText}>Narrow Zone</Text>
                <Text style={styles.dZoneSubText}>
                  (Good for Center/Intersect Demo)
                </Text>
              </MyDroppable>
              <MyDroppable<DraggableItemData>
                droppableId="contain-zone"
                style={[
                  styles.dropZone,
                  styles.dropZoneGreen,
                  { width: "45%", height: 150 },
                ]} // Wider, taller zone
                onDrop={(data) =>
                  Alert.alert(
                    "Drop!",
                    `Item "${data.label}" with ${data.collisionText} dropped on Contain Zone!`
                  )
                }
              >
                <Text style={styles.dropZoneText}>Contain Zone</Text>
                <Text style={styles.dZoneSubText}>(Good for Contain Demo)</Text>
              </MyDroppable>
            </View>

            <View style={[styles.draggableItemsArea, { minHeight: 240 }]}>
              {/* Draggable with 'center' collision */}
              <CustomDraggable<DraggableItemData>
                key="D-Collision-Center"
                data={{
                  id: "D-Col-Center",
                  label: "Center Collision Draggable",
                  backgroundColor: "#ffca3a",
                  collisionText: "'center' collision",
                }}
                collisionAlgorithm="center"
                initialStyle={[
                  styles.draggable,
                  {
                    top: 0,
                    left: "5%",
                    width: "90%", // Wide item
                    backgroundColor: "#ffca3a",
                    borderRadius: 12,
                    zIndex: 20,
                  },
                ]}
              >
                <View style={[commonCardStyle, { width: "100%" }]}>
                  <Text style={styles.cardLabel}>Center</Text>
                  <Text style={styles.cardHint}>(Wide)</Text>
                </View>
              </CustomDraggable>

              {/* Draggable with default 'intersect' collision */}
              <CustomDraggable<DraggableItemData>
                key="D-Collision-Intersect"
                data={{
                  id: "D-Col-Intersect",
                  label: "Intersect Collision Draggable (Default)",
                  backgroundColor: "#8ac926",
                  collisionText: "'intersect' collision (default)",
                }}
                initialStyle={[
                  styles.draggable,
                  {
                    top: 80,
                    left: "5%",
                    width: "90%", // Wide item
                    backgroundColor: "#8ac926",
                    borderRadius: 12,
                    zIndex: 10,
                  },
                ]}
              >
                <View style={[commonCardStyle, { width: "100%" }]}>
                  <Text style={styles.cardLabel}>Intersect</Text>
                  <Text style={styles.cardHint}>(Default, Wide)</Text>
                </View>
              </CustomDraggable>

              {/* Draggable with 'contain' collision */}
              <CustomDraggable<DraggableItemData>
                key="D-Collision-Contain"
                data={{
                  id: "D-Col-Contain",
                  label: "Contain Collision Draggable",
                  backgroundColor: "#1982c4",
                  collisionText: "'contain' collision",
                }}
                collisionAlgorithm="contain"
                initialStyle={[
                  styles.draggable,
                  {
                    top: 160,
                    left: "25%",
                    width: 180,
                    backgroundColor: "#1982c4",
                    borderRadius: 12,
                  },
                ]}
              >
                <View style={[commonCardStyle, { width: "100%" }]}>
                  <Text style={styles.cardLabel}>Contain</Text>
                  <Text style={styles.cardHint}>(Smaller)</Text>
                </View>
              </CustomDraggable>
            </View>
          </View>

          {/* Section 1: Free Draggables & Multiple Drop Zones */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Drag & Drop</Text>
            <View style={styles.dropZoneArea}>
              <MyDroppable<DraggableItemData>
                droppableId="zone-alpha"
                style={[styles.dropZone, styles.dropZoneBlue]}
                onDrop={(data) =>
                  Alert.alert("Drop!", `"${data.label}" dropped on Zone Alpha`)
                }
              >
                <Text style={styles.dropZoneText}>Zone Alpha</Text>
                <Text style={styles.dZoneSubText}>(Align: Center)</Text>
              </MyDroppable>
              <MyDroppable<DraggableItemData>
                droppableId="zone-beta"
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
              <CustomDraggable<DraggableItemData>
                key="D1"
                data={{
                  id: "D1",
                  label: "Draggable 1 (Basic)",
                  backgroundColor: "#a2d2ff",
                }}
                initialStyle={[
                  styles.draggable,
                  {
                    top: 0,
                    left: 20,
                    backgroundColor: "#a2d2ff",
                    borderRadius: 12,
                  },
                ]}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Basic</Text>
                </View>
              </CustomDraggable>

              <CustomDraggable<DraggableItemData>
                key="D2"
                data={{
                  id: "D2",
                  label: "Draggable 2 (Custom Anim)",
                  backgroundColor: "#bde0fe",
                }}
                initialStyle={[
                  styles.draggable,
                  {
                    top: 0,
                    left: 160,
                    backgroundColor: "#bde0fe",
                    borderRadius: 12,
                  },
                ]}
                animationFunction={customAnimation}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Custom Anim</Text>
                </View>
              </CustomDraggable>
            </View>
          </View>

          {/* Section with custom activeStyle prop examples */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Droppable Active Styles</Text>
            <View style={styles.dropZoneArea}>
              <View style={styles.dropZoneColumn}>
                <Text style={styles.customStyleLabel}>Pulse Effect</Text>
                <Droppable<DraggableItemData>
                  droppableId="pulse-zone"
                  style={[styles.dropZone, styles.customDropZone]}
                  onDrop={(data: DraggableItemData) =>
                    Alert.alert("Dropped!", `${data.label} on pulse zone`)
                  }
                  activeStyle={pulseActiveStyle}
                >
                  <Text style={styles.dropZoneText}>Pulse Zone</Text>
                </Droppable>
              </View>

              <View style={styles.dropZoneColumn}>
                <Text style={styles.customStyleLabel}>Glow Effect</Text>
                <Droppable<DraggableItemData>
                  droppableId="glow-zone"
                  style={[styles.dropZone, styles.customDropZone]}
                  onDrop={(data: DraggableItemData) =>
                    Alert.alert("Dropped!", `${data.label} on glow zone`)
                  }
                  activeStyle={glowActiveStyle}
                >
                  <Text style={styles.dropZoneText}>Glow Zone</Text>
                </Droppable>
              </View>
            </View>

            <View style={styles.draggableItemsArea}>
              <CustomDraggable<DraggableItemData>
                key="D10"
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
              </CustomDraggable>
            </View>
          </View>

          {/* Section 2: Bounded Dragging */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bounded Dragging</Text>
            <View ref={boundsViewRef} style={styles.boundsContainer}>
              <MyDroppable<DraggableItemData>
                droppableId="bounded-zone"
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

              <CustomDraggable<DraggableItemData>
                key="D3"
                data={{
                  id: "D3",
                  label: "Draggable 3 (Bounded)",
                  backgroundColor: "#ffafcc",
                }}
                dragBoundsRef={boundsViewRef}
                initialStyle={[
                  styles.cardCentered,
                  {
                    backgroundColor: "#ffafcc",
                    borderRadius: 12,
                  },
                ]}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Bounded</Text>
                </View>
              </CustomDraggable>
            </View>
          </View>

          {/* Section 3: Axis Constrained Draggables */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>X-Axis Constrained Dragging</Text>
            <View style={styles.axisConstraintContainer}>
              <MyDroppable<DraggableItemData>
                droppableId="x-axis-left"
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
                droppableId="x-axis-right"
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

              <CustomDraggable<DraggableItemData>
                key="D5"
                data={{
                  id: "D5",
                  label: "X-axis Constrained",
                  backgroundColor: "#80ed99",
                }}
                dragAxis="x"
                initialStyle={[
                  styles.cardCentered,
                  {
                    backgroundColor: "#80ed99",
                    alignSelf: "center",
                    borderRadius: 12,
                  },
                ]}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>X-Axis Only</Text>
                  <Text style={styles.cardHint}>←→</Text>
                </View>
              </CustomDraggable>
            </View>
          </View>

          {/* Section 4: Y-Axis Constrained */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Y-Axis Constrained Dragging</Text>
            <View style={styles.yAxisConstraintContainer}>
              <MyDroppable<DraggableItemData>
                droppableId="y-axis-top"
                style={[styles.yAxisDropZone, styles.dropZoneBlue, { top: 10 }]}
                onDrop={(data) =>
                  Alert.alert("Drop!", `"${data.label}" dropped on top zone`)
                }
              >
                <Text style={styles.dropZoneText}>Top</Text>
              </MyDroppable>

              <MyDroppable<DraggableItemData>
                droppableId="y-axis-bottom"
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

              <CustomDraggable<DraggableItemData>
                key="D6"
                data={{
                  id: "D6",
                  label: "Y-axis Constrained",
                  backgroundColor: "#f7d9c4",
                }}
                dragAxis="y"
                initialStyle={[
                  styles.cardCentered,
                  {
                    backgroundColor: "#f7d9c4",
                    alignSelf: "center",
                    borderRadius: 12,
                  },
                ]}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Y-Axis Only</Text>
                  <Text style={styles.cardHint}>↑↓</Text>
                </View>
              </CustomDraggable>
            </View>
          </View>

          {/* Section 5: Combined Constraints (Bounds + Y-axis) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bounded Y-Axis Dragging</Text>
            <View ref={boundsViewRef2} style={styles.verticalBoundsContainer}>
              <MyDroppable<DraggableItemData>
                droppableId="bounded-y-axis-target"
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

              <CustomDraggable<DraggableItemData>
                key="D7"
                data={{
                  id: "D7",
                  label: "Bounded Y-axis",
                  backgroundColor: "#c6def1",
                }}
                dragBoundsRef={boundsViewRef2}
                dragAxis="y"
                initialStyle={[
                  styles.cardCentered,
                  {
                    backgroundColor: "#c6def1",
                    marginTop: 20,
                    borderRadius: 12,
                  },
                ]}
              >
                <View style={commonCardStyle}>
                  <Text style={styles.cardLabel}>Bounded Y</Text>
                  <Text style={styles.cardHint}>↕</Text>
                </View>
              </CustomDraggable>
            </View>
          </View>

          {/* Add a new demo section for capacity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Droppable Capacity Demo</Text>
            <Text style={styles.sectionDescription}>
              This example demonstrates droppable zones with different
              capacities. Try dropping multiple items on each zone.
            </Text>

            <View style={styles.dropZoneArea}>
              <View style={styles.dropZoneColumn}>
                <Text style={styles.customStyleLabel}>
                  Capacity: 1 (Default)
                </Text>
                <Droppable<DraggableItemData>
                  droppableId="capacity-1"
                  style={[styles.dropZone, styles.customDropZone]}
                  onDrop={(data) =>
                    Alert.alert("Dropped!", `${data.label} on capacity-1 zone`)
                  }
                  // Default capacity is 1
                >
                  <Text style={styles.dropZoneText}>Single Item</Text>
                  <Text style={styles.dZoneSubText}>(Max: 1 Item)</Text>
                </Droppable>
              </View>

              <View style={styles.dropZoneColumn}>
                <Text style={styles.customStyleLabel}>Capacity: 2</Text>
                <Droppable<DraggableItemData>
                  droppableId="capacity-2"
                  capacity={2}
                  style={[styles.dropZone, styles.customDropZone]}
                  onDrop={(data) =>
                    Alert.alert("Dropped!", `${data.label} on capacity-2 zone`)
                  }
                >
                  <Text style={styles.dropZoneText}>Multi Item</Text>
                  <Text style={styles.dZoneSubText}>(Max: 2 Items)</Text>
                </Droppable>
              </View>
            </View>

            <View style={styles.dropZoneArea}>
              <View style={styles.dropZoneColumn}>
                <Text style={styles.customStyleLabel}>Capacity: 3</Text>
                <Droppable<DraggableItemData>
                  droppableId="capacity-3"
                  capacity={3}
                  style={[
                    styles.dropZone,
                    styles.customDropZone,
                    { height: 140 },
                  ]}
                  onDrop={(data) =>
                    Alert.alert("Dropped!", `${data.label} on capacity-3 zone`)
                  }
                >
                  <Text style={styles.dropZoneText}>Large Capacity</Text>
                  <Text style={styles.dZoneSubText}>(Max: 3 Items)</Text>
                </Droppable>
              </View>

              <View style={styles.dropZoneColumn}>
                <Text style={styles.customStyleLabel}>Capacity: Unlimited</Text>
                <Droppable<DraggableItemData>
                  droppableId="capacity-unlimited"
                  capacity={Infinity}
                  style={[
                    styles.dropZone,
                    styles.customDropZone,
                    { height: 140 },
                  ]}
                  onDrop={(data) =>
                    Alert.alert(
                      "Dropped!",
                      `${data.label} on unlimited capacity zone`
                    )
                  }
                >
                  <Text style={styles.dropZoneText}>Unlimited</Text>
                  <Text style={styles.dZoneSubText}>(No Limit)</Text>
                </Droppable>
              </View>
            </View>

            <View style={[styles.draggableItemsArea, { minHeight: 200 }]}>
              {/* Create 5 draggable items to test capacity */}
              {Array.from({ length: 5 }).map((_, index) => (
                <CustomDraggable<DraggableItemData>
                  key={`capacity-demo-item-${index}`}
                  draggableId={`capacity-demo-item-${index}`}
                  data={{
                    id: `capacity-item-${index}`,
                    label: `Item ${index + 1}`,
                    backgroundColor: `hsl(${index * 40}, 80%, 60%)`,
                  }}
                  initialStyle={[
                    {
                      backgroundColor: `hsl(${index * 40}, 80%, 60%)`,
                      borderRadius: 12,
                      zIndex: 100 - index,
                      marginLeft: 10,
                      marginTop: 10,
                    },
                  ]}
                >
                  <View style={commonCardStyle}>
                    <Text style={styles.cardLabel}>{`Item ${index + 1}`}</Text>
                  </View>
                </CustomDraggable>
              ))}
            </View>

            {/* Add counter to show items in each drop zone */}
            <View style={styles.mappingContainer}>
              <Text style={styles.mappingTitle}>Dropped Items Count:</Text>
              {Object.entries(
                // Group by droppable ID
                Object.values(droppedItemsMap).reduce(
                  (acc, { droppableId }) => {
                    acc[droppableId] = (acc[droppableId] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>
                )
              ).map(([droppableId, count]) => (
                <View key={droppableId} style={styles.mappingItem}>
                  <Text style={styles.mappingText}>
                    <Text style={styles.mappingLabel}>{droppableId}</Text>:{" "}
                    <Text style={styles.mappingValue}>{count}</Text> item
                    {count !== 1 ? "s" : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Drag Handle Demo Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Drag Handle Demo</Text>
            <Text style={styles.sectionDescription}>
              This example demonstrates using drag handles for more precise
              control.
            </Text>

            <View style={styles.dropZoneArea}>
              <Droppable<DraggableItemData>
                droppableId="handle-drop-zone"
                style={[styles.dropZone, styles.dropZoneBlue, { height: 150 }]}
                onDrop={(data) => {
                  Alert.alert(
                    "Item Dropped",
                    `Item "${data.label}" dropped in handle demo zone`
                  );
                }}
              >
                <Text style={styles.dropZoneText}>Drop Target</Text>
                <Text style={styles.dZoneSubText}>(For handle examples)</Text>
              </Droppable>
            </View>

            <View
              style={[
                styles.draggableItemsArea,
                { minHeight: 260, marginTop: 30 },
              ]}
            >
              {/* Example 1: Entire item is a drag handle */}
              <CustomDraggable<DraggableItemData>
                key="handle-demo-item-1"
                draggableId="handle-demo-item-1"
                data={{
                  id: "handle-demo-item-1",
                  label: "Full Handle Item",
                  backgroundColor: "#2a9d8f",
                }}
                initialStyle={[
                  styles.draggable,
                  {
                    top: 0,
                    left: 40,
                    backgroundColor: "#2a9d8f",
                    borderRadius: 12,
                  },
                ]}
              >
                <CustomDraggable.Handle>
                  <View style={commonCardStyle}>
                    <Text style={styles.cardLabel}>Fully Draggable</Text>
                    <Text style={styles.cardHint}>Drag from anywhere</Text>
                  </View>
                </CustomDraggable.Handle>
              </CustomDraggable>

              {/* Example 2: Drag handle as part of the UI */}
              <CustomDraggable<DraggableItemData>
                key="handle-demo-item-2"
                draggableId="handle-demo-item-2"
                data={{
                  id: "handle-demo-item-2",
                  label: "Handle-Only Item",
                  backgroundColor: "#e9c46a",
                }}
                initialStyle={[
                  styles.draggable,
                  {
                    top: 120,
                    left: 40,
                    backgroundColor: "#e9c46a",
                    borderRadius: 12,
                    width: 200,
                    padding: 0,
                  },
                ]}
              >
                <View style={[commonCardStyle, { width: "100%" }]}>
                  <Text style={styles.cardLabel}>Handle-Only Draggable</Text>
                  <Text style={styles.cardHint}>
                    Drag from the handle below
                  </Text>

                  {/* The handle is only part of the draggable */}
                  <CustomDraggable.Handle>
                    <View style={styles.dragHandle}>
                      <Text style={styles.handleText}>⬌ DRAG HERE ⬌</Text>
                    </View>
                  </CustomDraggable.Handle>
                </View>
              </CustomDraggable>

              {/* Example 3: Real-world Card with Header as Handle */}
              <CustomDraggable<DraggableItemData>
                key="handle-demo-item-3"
                draggableId="handle-demo-item-3"
                data={{
                  id: "handle-demo-item-3",
                  label: "Card with Header Handle",
                  backgroundColor: "#606c38",
                }}
                initialStyle={[
                  styles.draggable,
                  {
                    top: 0,
                    right: 40,
                    backgroundColor: "#ffffff",
                    borderRadius: 12,
                    width: 200,
                    overflow: "hidden",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  },
                ]}
              >
                {/* Card with header as drag handle */}
                <View style={styles.cardWithHeader}>
                  <CustomDraggable.Handle>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardHeaderText}>Drag Card</Text>
                      <Text style={styles.cardHeaderIcon}>⬌</Text>
                    </View>
                  </CustomDraggable.Handle>

                  <View style={styles.cardBody}>
                    <Text style={styles.cardBodyTitle}>Card Content</Text>
                    <Text style={styles.cardBodyText}>
                      This area is not draggable. Only the header can be used to
                      drag this card.
                    </Text>
                  </View>
                </View>
              </CustomDraggable>
            </View>
          </View>

          {/* After the existing drag handle demo section, add a new section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Custom Draggable with Handle
            </Text>
            <Text style={styles.sectionDescription}>
              This example demonstrates using drag handles with the custom
              draggable component.
            </Text>

            <View style={styles.dropZoneArea}>
              <MyDroppable<DraggableItemData>
                droppableId="my-handle-drop-zone"
                style={[styles.dropZone, styles.dropZoneGreen, { height: 120 }]}
                onDrop={(data) => {
                  Alert.alert(
                    "Item Dropped",
                    `Item "${data.label}" dropped in CustomDraggable handle demo zone`
                  );
                }}
              >
                <Text style={styles.dropZoneText}>Custom Drop Zone</Text>
                <Text style={styles.dZoneSubText}>
                  (For CustomDraggable.Handle)
                </Text>
              </MyDroppable>
            </View>

            <View
              style={[
                styles.draggableItemsArea,
                { minHeight: 240, marginTop: 30 },
              ]}
            >
              {/* Example using CustomDraggable with handle */}
              <CustomDraggable<DraggableItemData>
                key="my-handle-demo"
                data={{
                  id: "my-handle-demo",
                  label: "CustomDraggable Handle Demo",
                  backgroundColor: "#4361ee",
                }}
                initialStyle={[
                  styles.draggable,
                  {
                    top: 0,
                    left: "25%",
                    backgroundColor: "#4361ee",
                    borderRadius: 12,
                    width: 180,
                  },
                ]}
              >
                <View style={[commonCardStyle, { width: "100%" }]}>
                  <Text style={styles.cardLabel}>Custom Draggable</Text>
                  <Text style={styles.cardHint}>Non-draggable content</Text>

                  <CustomDraggable.Handle>
                    <View
                      style={[
                        styles.dragHandle,
                        { backgroundColor: "#3a0ca3" },
                      ]}
                    >
                      <Text style={styles.handleText}>CUSTOM HANDLE</Text>
                    </View>
                  </CustomDraggable.Handle>
                </View>
              </CustomDraggable>
            </View>
          </View>

          {/* Add a section for the BasicDraggable */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minimal BasicDraggable Demo</Text>
            <Text style={styles.sectionDescription}>
              This example demonstrates the minimal implementation of a
              draggable component.
            </Text>

            <View style={styles.dropZoneArea}>
              <MyDroppable<DraggableItemData>
                droppableId="basic-drop-zone"
                style={[styles.dropZone, styles.dropZoneBlue, { height: 120 }]}
                onDrop={(data) => {
                  Alert.alert(
                    "Item Dropped",
                    `Item "${data.label}" dropped in basic demo zone`
                  );
                }}
              >
                <Text style={styles.dropZoneText}>Drop Zone</Text>
                <Text style={styles.dZoneSubText}>
                  (For BasicDraggable demo)
                </Text>
              </MyDroppable>
            </View>

            <View
              style={[
                styles.draggableItemsArea,
                { minHeight: 120, marginTop: 30 },
              ]}
            >
              {/* Example using BasicDraggable */}
              <BasicDraggable<DraggableItemData>
                key="basic-draggable-demo"
                data={{
                  id: "basic-draggable-demo",
                  label: "Basic Draggable Demo",
                  backgroundColor: "#f72585",
                }}
                style={[
                  styles.draggable,
                  {
                    top: 0,
                    left: "25%",
                    backgroundColor: "#f72585",
                    borderRadius: 12,
                    padding: 16,
                    width: 180,
                  },
                ]}
              >
                <View style={[commonCardStyle, { width: "100%" }]}>
                  <Text style={styles.cardLabel}>Minimal Draggable</Text>
                  <Text style={styles.cardHint}>Simple implementation</Text>
                </View>
              </BasicDraggable>
            </View>
          </View>
        </ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

// Helper function to get state-specific text style
function getStateStyle(state: DraggableState): StyleProp<TextStyle> {
  switch (state) {
    case DraggableState.IDLE:
      return { color: "#90be6d", fontWeight: "700" };
    case DraggableState.DRAGGING:
      return { color: "#f8961e", fontWeight: "700" };
    case DraggableState.DROPPED:
      return { color: "#577590", fontWeight: "700" };
  }
}

// Helper function to get state-specific border color
function getBorderColor(state: DraggableState): string {
  switch (state) {
    case DraggableState.IDLE:
      return "#90be6d"; // Green
    case DraggableState.DRAGGING:
      return "#f8961e"; // Orange
    case DraggableState.DROPPED:
      return "#577590"; // Blue
  }
}

const styles = StyleSheet.create({
  scrollViewBase: {
    flex: 1,
    backgroundColor: "#0a0c10",
  },
  scrollContentContainer: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 32,
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 32,
    padding: 24,
    backgroundColor: "#161b22",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  sectionDescription: {
    fontSize: 15,
    color: "#a3b3bc",
    marginBottom: 24,
    lineHeight: 22,
  },
  dropZoneArea: {
    flexDirection: "row",
    justifyContent: "space-around",
    minHeight: 100,
    marginBottom: 32,
  },
  dropZoneColumn: {
    alignItems: "center",
    width: "45%",
  },
  customStyleLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    color: "#e6edf3",
    letterSpacing: 0.2,
  },
  customDropZone: {
    borderColor: "#30363d",
    backgroundColor: "#1c2128",
    height: 120,
    width: "100%",
    borderRadius: 16,
  },
  dropZone: {
    width: "45%",
    height: 100,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 8,
  },
  dropZoneBlue: {
    borderColor: "#58a6ff",
    backgroundColor: "rgba(88, 166, 255, 0.08)",
  },
  dropZoneGreen: {
    borderColor: "#3fb950",
    backgroundColor: "rgba(63, 185, 80, 0.08)",
  },
  dropZoneText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#e6edf3",
    letterSpacing: 0.2,
  },
  dZoneSubText: {
    fontSize: 12,
    color: "#a3b3bc",
    marginTop: 6,
    letterSpacing: 0.1,
  },
  slotActive: {
    backgroundColor: "rgba(88, 166, 255, 0.15)",
    borderColor: "#58a6ff",
    transform: [{ scale: 1.02 }],
  },
  draggableItemsArea: {
    minHeight: 100,
    position: "relative",
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  draggable: {
    position: "absolute",
  },
  cardContent: {
    width: 120,
    height: 72,
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c2128",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e6edf3",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  cardHint: {
    fontSize: 13,
    marginTop: 6,
    color: "#a3b3bc",
    letterSpacing: 0.1,
    textAlign: "center",
  },
  cardSubText: {
    fontSize: 12,
    color: "#a3b3bc",
    marginTop: 4,
    letterSpacing: 0.1,
    textAlign: "center",
  },
  boundsContainer: {
    minHeight: 200,
    borderWidth: 2,
    borderColor: "#58a6ff",
    backgroundColor: "rgba(88, 166, 255, 0.08)",
    borderRadius: 16,
    padding: 24,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  verticalBoundsContainer: {
    height: 280,
    borderWidth: 2,
    width: 180,
    borderColor: "#58a6ff",
    backgroundColor: "rgba(88, 166, 255, 0.08)",
    borderRadius: 16,
    padding: 24,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  innerDropZone: {
    width: "80%",
    height: 72,
    marginBottom: 24,
  },
  axisConstraintContainer: {
    height: 140,
    position: "relative",
    justifyContent: "center",
    backgroundColor: "#161b22",
    borderRadius: 16,
    padding: 16,
  },
  xAxisDropZone: {
    width: 100,
    height: 100,
    top: 20,
    position: "absolute",
    borderRadius: 12,
  },
  yAxisConstraintContainer: {
    height: 240,
    position: "relative",
    justifyContent: "center",
    backgroundColor: "#161b22",
    borderRadius: 16,
    padding: 16,
  },
  yAxisDropZone: {
    position: "absolute",
    width: "100%",
    height: 72,
    left: 0,
    right: 0,
    borderRadius: 12,
  },
  yAxisBoundedDropZone: {
    width: "90%",
    height: 60,
    borderRadius: 12,
  },
  cardCentered: {
    alignSelf: "center",
  },
  stateInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
  },
  stateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stateIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  stateText: {
    fontSize: 14,
    color: "#e6edf3",
  },
  mappingContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
  },
  mappingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#e6edf3",
  },
  mappingItem: {
    padding: 10,
    marginVertical: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
  },
  mappingText: {
    fontSize: 14,
    color: "#e6edf3",
  },
  mappingEmpty: {
    fontSize: 14,
    color: "#a3b3bc",
    fontStyle: "italic",
  },
  mappingLabel: {
    fontWeight: "600",
    color: "#58a6ff",
  },
  mappingValue: {
    fontWeight: "600",
    color: "#3fb950",
  },
  dragHandle: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 6,
    width: "100%",
  },
  handleText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  cardWithHeader: {
    flexDirection: "column",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    width: "100%",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#606c38",
    width: "100%",
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  cardHeaderIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  cardBody: {
    padding: 12,
  },
  cardBodyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  cardBodyText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
});

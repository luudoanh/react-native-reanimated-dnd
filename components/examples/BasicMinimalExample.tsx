import React, { useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider, DropProviderRef } from "../../context/DropContext";
import { Droppable } from "../Droppable";
import { BasicDraggable } from "../BasicDraggable";
import { ExampleHeader } from "../ExampleHeader";

interface DraggableItemData {
  id: string;
  label: string;
  backgroundColor: string;
}

interface BasicMinimalExampleProps {
  onBack: () => void;
}

export function BasicMinimalExample({ onBack }: BasicMinimalExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);

  const handleScrollEnd = useCallback(() => {
    let localScrollTimeout: NodeJS.Timeout | null = null;
    if (localScrollTimeout) {
      clearTimeout(localScrollTimeout);
    }
    localScrollTimeout = setTimeout(() => {
      dropProviderRef.current?.requestPositionUpdate();
    }, 50);
  }, []);

  const handleLayoutUpdateComplete = useCallback(() => {
    // console.log('DropProvider: Position recalculation completed.');
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ExampleHeader title="Minimal Basic" onBack={onBack} />

        <DropProvider
          ref={dropProviderRef}
          onLayoutUpdateComplete={handleLayoutUpdateComplete}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            onScrollEndDrag={handleScrollEnd}
            onMomentumScrollEnd={handleScrollEnd}
            scrollEventThrottle={16}
          >
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                This example demonstrates the minimal implementation of a
                draggable component. BasicDraggable provides a simple, no-frills
                dragging experience.
              </Text>

              <View style={styles.dropZoneArea}>
                <Droppable<DraggableItemData>
                  droppableId="basic-drop-zone"
                  style={[
                    styles.dropZone,
                    styles.dropZoneBlue,
                    { height: 120 },
                  ]}
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
                </Droppable>
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
                  <View style={[styles.cardContent, { width: "100%" }]}>
                    <Text style={styles.cardLabel}>Minimal Draggable</Text>
                    <Text style={styles.cardHint}>Simple implementation</Text>
                  </View>
                </BasicDraggable>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#f72585" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    BasicDraggable: Minimal draggable component implementation
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#58a6ff" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Drop zone for testing basic dragging functionality
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#8E8E93" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    No handles, constraints, or special features - just dragging
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </DropProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    padding: 24,
    backgroundColor: "#000000",
    marginBottom: 20,
  },
  sectionDescription: {
    fontSize: 15,
    color: "#8E8E93",
    marginBottom: 24,
    lineHeight: 22,
  },
  dropZoneArea: {
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 120,
    marginBottom: 32,
  },
  dropZone: {
    width: "70%",
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
  dropZoneText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  dZoneSubText: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 6,
    letterSpacing: 0.1,
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
    backgroundColor: "#1C1C1E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  cardHint: {
    fontSize: 13,
    marginTop: 6,
    color: "#8E8E93",
    letterSpacing: 0.1,
    textAlign: "center",
  },
  infoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#FFFFFF",
    flex: 1,
    lineHeight: 20,
  },
});

import React, { useRef, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider, DropProviderRef } from "../../context/DropContext";
import { Droppable } from "../Droppable";
import { CustomDraggable } from "../CustomDraggable";
import { ExampleHeader } from "../ExampleHeader";

interface DraggableItemData {
  id: string;
  label: string;
  backgroundColor: string;
}

interface AlignmentOffsetExampleProps {
  onBack: () => void;
}

type DropAlignment =
  | "center"
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "center-left"
  | "center-right";

const alignmentOptions: { label: string; value: DropAlignment }[] = [
  { label: "Center", value: "center" },
  { label: "Top Left", value: "top-left" },
  { label: "Top Center", value: "top-center" },
  { label: "Top Right", value: "top-right" },
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Bottom Center", value: "bottom-center" },
  { label: "Bottom Right", value: "bottom-right" },
  { label: "Left Center", value: "center-left" },
  { label: "Right Center", value: "center-right" },
];

const offsetOptions = [
  { label: "No Offset", value: { x: 0, y: 0 } },
  { label: "Small (10px)", value: { x: 10, y: 10 } },
  { label: "Medium (20px)", value: { x: 20, y: 20 } },
  { label: "Large (30px)", value: { x: 30, y: 30 } },
  { label: "X Only (20px)", value: { x: 20, y: 0 } },
  { label: "Y Only (20px)", value: { x: 0, y: 20 } },
];

export function AlignmentOffsetExample({
  onBack,
}: AlignmentOffsetExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const [selectedAlignment, setSelectedAlignment] =
    useState<DropAlignment>("center");
  const [selectedOffset, setSelectedOffset] = useState({ x: 0, y: 0 });
  const [showAlignmentDropdown, setShowAlignmentDropdown] = useState(false);
  const [showOffsetDropdown, setShowOffsetDropdown] = useState(false);

  const selectedAlignmentLabel =
    alignmentOptions.find((option) => option.value === selectedAlignment)
      ?.label || "Center";

  const selectedOffsetLabel =
    offsetOptions.find(
      (option) =>
        option.value.x === selectedOffset.x &&
        option.value.y === selectedOffset.y
    )?.label || "No Offset";

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ExampleHeader title="Alignment & Offset" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                Control how dropped items are positioned within drop zones. Try
                different alignment and offset combinations.
              </Text>

              {/* Alignment Dropdown */}
              <View style={styles.controlSection}>
                <Text style={styles.controlTitle}>Drop Alignment</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowAlignmentDropdown(true)}
                >
                  <Text style={styles.dropdownText}>
                    {selectedAlignmentLabel}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>

              {/* Offset Dropdown */}
              <View style={styles.controlSection}>
                <Text style={styles.controlTitle}>Drop Offset</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowOffsetDropdown(true)}
                >
                  <Text style={styles.dropdownText}>{selectedOffsetLabel}</Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dropZoneArea}>
                <Droppable<DraggableItemData>
                  droppableId="alignment-demo-zone"
                  style={[styles.dropZone, styles.dropZoneBlue]}
                  dropAlignment={selectedAlignment}
                  dropOffset={selectedOffset}
                  onDrop={(data) =>
                    Alert.alert(
                      "Drop!",
                      `"${data.label}" dropped with alignment: ${selectedAlignment}, offset: (${selectedOffset.x}, ${selectedOffset.y})`
                    )
                  }
                >
                  <Text style={styles.dropZoneText}>Demo Zone</Text>
                  <Text style={styles.dZoneSubText}>
                    Alignment: {selectedAlignment}
                  </Text>
                  <Text style={styles.dZoneSubText}>
                    Offset: ({selectedOffset.x}, {selectedOffset.y})
                  </Text>
                </Droppable>
              </View>

              <View style={styles.draggableItemsArea}>
                <CustomDraggable<DraggableItemData>
                  key={`alignment-item-1-${selectedAlignment}-${selectedOffset.x}-${selectedOffset.y}`}
                  data={{
                    id: "alignment-item-1",
                    label: "Test Item 1",
                    backgroundColor: "#ff6b6b",
                  }}
                  initialStyle={[
                    styles.draggable,
                    {
                      top: 0,
                      left: 20,
                      backgroundColor: "#ff6b6b",
                      borderRadius: 12,
                    },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Test 1</Text>
                    <Text style={styles.cardHint}>Try alignment</Text>
                  </View>
                </CustomDraggable>

                <CustomDraggable<DraggableItemData>
                  key={`alignment-item-2-${selectedAlignment}-${selectedOffset.x}-${selectedOffset.y}`}
                  data={{
                    id: "alignment-item-2",
                    label: "Test Item 2",
                    backgroundColor: "#4ecdc4",
                  }}
                  initialStyle={[
                    styles.draggable,
                    {
                      top: 0,
                      left: 160,
                      backgroundColor: "#4ecdc4",
                      borderRadius: 12,
                    },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Test 2</Text>
                    <Text style={styles.cardHint}>Try offset</Text>
                  </View>
                </CustomDraggable>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#FF3B30" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Alignment controls where items are positioned within the
                    drop zone
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
                    Offset adds additional pixel displacement from the alignment
                    point
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Alignment Dropdown Modal */}
          <Modal
            visible={showAlignmentDropdown}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowAlignmentDropdown(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowAlignmentDropdown(false)}
            >
              <View style={styles.dropdownModal}>
                <Text style={styles.modalTitle}>Select Alignment</Text>
                {alignmentOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.modalOption,
                      selectedAlignment === option.value &&
                        styles.selectedModalOption,
                    ]}
                    onPress={() => {
                      setSelectedAlignment(option.value);
                      setShowAlignmentDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        selectedAlignment === option.value &&
                          styles.selectedModalOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Offset Dropdown Modal */}
          <Modal
            visible={showOffsetDropdown}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowOffsetDropdown(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowOffsetDropdown(false)}
            >
              <View style={styles.dropdownModal}>
                <Text style={styles.modalTitle}>Select Offset</Text>
                {offsetOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modalOption,
                      selectedOffset.x === option.value.x &&
                        selectedOffset.y === option.value.y &&
                        styles.selectedModalOption,
                    ]}
                    onPress={() => {
                      setSelectedOffset(option.value);
                      setShowOffsetDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        selectedOffset.x === option.value.x &&
                          selectedOffset.y === option.value.y &&
                          styles.selectedModalOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
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
  controlSection: {
    marginBottom: 24,
  },
  controlTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    borderRadius: 8,
    backgroundColor: "#1C1C1E",
  },
  dropdownText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
    marginLeft: 4,
  },
  dropZoneArea: {
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 160,
    marginBottom: 32,
  },
  dropZone: {
    width: "80%",
    height: 140,
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
    marginBottom: 4,
  },
  dZoneSubText: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
    letterSpacing: 0.1,
    textAlign: "center",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  modalOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    borderRadius: 8,
    backgroundColor: "#1C1C1E",
    marginBottom: 8,
  },
  selectedModalOption: {
    borderColor: "#FF3B30",
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  modalOptionText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  selectedModalOptionText: {
    color: "#FF3B30",
  },
});

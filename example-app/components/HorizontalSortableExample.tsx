import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Modal,
} from "react-native";
import { HorizontalSortable } from "../components/HorizontalSortable";
import { HorizontalSortableItem } from "../components/HorizontalSortableItem";
import { HorizontalSortableRenderItemProps } from "../types/sortable";
import { Footer } from "./Footer";

interface TagItem {
  id: string;
  label: string;
  color: string;
  category: string;
  count: number;
}

const MOCK_TAGS: TagItem[] = [
  {
    id: "1",
    label: "React",
    color: "#61DAFB",
    category: "Library",
    count: 1250,
  },
  {
    id: "2",
    label: "TypeScript",
    color: "#3178C6",
    category: "Language",
    count: 980,
  },
  {
    id: "3",
    label: "JavaScript",
    color: "#F7DF1E",
    category: "Language",
    count: 2100,
  },
  {
    id: "4",
    label: "React Native",
    color: "#0FA5E9",
    category: "Framework",
    count: 750,
  },
  {
    id: "5",
    label: "Node.js",
    color: "#68A063",
    category: "Runtime",
    count: 1400,
  },
  {
    id: "6",
    label: "Vue",
    color: "#4FC08D",
    category: "Framework",
    count: 650,
  },
  {
    id: "7",
    label: "Angular",
    color: "#DD0031",
    category: "Framework",
    count: 580,
  },
  {
    id: "8",
    label: "Python",
    color: "#3776AB",
    category: "Language",
    count: 1800,
  },
  {
    id: "9",
    label: "Swift",
    color: "#FA7343",
    category: "Language",
    count: 420,
  },
  {
    id: "10",
    label: "Kotlin",
    color: "#7F52FF",
    category: "Language",
    count: 380,
  },
  {
    id: "11",
    label: "Flutter",
    color: "#02569B",
    category: "Framework",
    count: 320,
  },
  {
    id: "12",
    label: "Go",
    color: "#00ADD8",
    category: "Language",
    count: 290,
  },
  {
    id: "13",
    label: "Rust",
    color: "#000000",
    category: "Language",
    count: 150,
  },
  {
    id: "14",
    label: "Docker",
    color: "#2496ED",
    category: "Tool",
    count: 890,
  },
  {
    id: "15",
    label: "GraphQL",
    color: "#E10098",
    category: "Query Language",
    count: 340,
  },
];

// Item width for horizontal sortable list
const ITEM_WIDTH = 120;
const ITEM_GAP = 12;
const PADDING_HORIZONTAL = 12;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

interface HorizontalSortableExampleProps {
  onBack?: () => void;
}

export function HorizontalSortableExample({
  onBack,
}: HorizontalSortableExampleProps = {}) {
  const [isDragHandleMode, setIsDragHandleMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWebModal, setShowWebModal] = useState(Platform.OS === "web");

  // this is just to defer loading a large list during navigation
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Render each horizontal sortable item
  const renderItem = useCallback(
    (props: HorizontalSortableRenderItemProps<TagItem>) => {
      const {
        item,
        id,
        positions,
        leftBound,
        autoScrollDirection,
        itemsCount,
        itemWidth,
        gap,
        paddingHorizontal,
      } = props;

      const isPopularTag = item.count > 1000;

      return (
        <HorizontalSortableItem
          key={id}
          id={id}
          data={item}
          positions={positions}
          leftBound={leftBound}
          autoScrollDirection={autoScrollDirection}
          itemsCount={itemsCount}
          itemWidth={itemWidth}
          gap={gap}
          paddingHorizontal={paddingHorizontal}
          containerWidth={windowWidth}
          style={styles.itemContainer}
          onMove={(currentId, from, to) => {
            console.log(`Tag ${currentId} moved from ${from} to ${to}`);
          }}
          onDragStart={(currentId, position) => {
            console.log(`Tag ${currentId} dragged from ${position}`);
          }}
          onDrop={(currentId, position) => {
            console.log(`Tag ${currentId} dropped at ${position}`);
          }}
          onDragging={(currentId, overItemId, xPosition) => {
            console.log(
              `Tag ${currentId} dragging over ${overItemId} at ${xPosition}`
            );
          }}
        >
          <View
            style={[
              styles.tagContainer,
              { backgroundColor: item.color },
              isPopularTag && styles.popularTag,
            ]}
          >
            <View style={styles.tagContent}>
              <Text style={styles.tagLabel} numberOfLines={1}>
                {item.label}
              </Text>
              <Text style={styles.tagCategory} numberOfLines={1}>
                {item.category}
              </Text>
              <Text style={styles.tagCount}>{item.count.toLocaleString()}</Text>
            </View>

            {isDragHandleMode && (
              <HorizontalSortableItem.Handle style={styles.dragHandle}>
                <View style={styles.dragIconContainer}>
                  <View style={styles.dragColumn}>
                    <View style={styles.dragDot} />
                    <View style={styles.dragDot} />
                    <View style={styles.dragDot} />
                  </View>
                  <View style={styles.dragColumn}>
                    <View style={styles.dragDot} />
                    <View style={styles.dragDot} />
                    <View style={styles.dragDot} />
                  </View>
                </View>
              </HorizontalSortableItem.Handle>
            )}
          </View>
        </HorizontalSortableItem>
      );
    },
    [isDragHandleMode]
  );

  const isWeb = Platform.OS === "web";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.header}>Tech Tags</Text>
            <Text style={styles.tipText}>
              {isDragHandleMode
                ? "Drag the handle to reorder horizontally"
                : "Hold and drag tags to reorder horizontally"}
            </Text>
          </View>

          <View style={styles.toggleButtonContainer}>
            {!isLoading && (
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setIsDragHandleMode(!isDragHandleMode)}
              >
                <Text style={styles.toggleText}>
                  {isDragHandleMode ? "Handle" : "Full"}
                </Text>
                <View
                  style={[
                    styles.toggleIndicator,
                    {
                      backgroundColor: isDragHandleMode ? "#FF3B30" : "#8E8E93",
                    },
                  ]}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3B30" />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {MOCK_TAGS.length} Technology Tags
            </Text>
            <Text style={styles.statsSubtext}>
              Drag to reorder by preference
            </Text>
          </View>

          <View style={styles.listContainer}>
            <HorizontalSortable
              data={MOCK_TAGS}
              renderItem={renderItem}
              itemWidth={ITEM_WIDTH}
              gap={ITEM_GAP}
              paddingHorizontal={PADDING_HORIZONTAL}
              style={styles.list}
            />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.popularDot]} />
                <Text style={styles.legendText}>Popular (&gt;1K)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.normalDot]} />
                <Text style={styles.legendText}>Normal</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <Footer />

      {/* Web Platform Modal */}
      <Modal
        visible={showWebModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWebModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Web Platform Notice</Text>
            <Text style={styles.modalMessage}>
              This horizontal sortable example doesn't work on web due to
              platform limitations with React Native Reanimated and Gesture
              Handler.
            </Text>
            <Text style={styles.modalSubMessage}>
              Please try this example on iOS or Android.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowWebModal(false)}
              >
                <Text style={styles.modalButtonText}>Continue Anyway</Text>
              </TouchableOpacity>
              {onBack && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={onBack}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      styles.modalButtonTextPrimary,
                    ]}
                  >
                    Go Back
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  headerContainer: {
    backgroundColor: "#000000",
    borderBottomWidth: 0.5,
    borderBottomColor: "#2C2C2E",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    minHeight: 50,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingRight: 12,
    width: 80,
  },
  backIcon: {
    fontSize: 24,
    color: "#FF3B30",
    fontWeight: "300",
    marginRight: 6,
    lineHeight: 28,
  },
  backText: {
    fontSize: 17,
    color: "#FF3B30",
    fontWeight: "400",
  },
  titleContainer: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  tipText: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 16,
  },
  toggleButtonContainer: {
    width: 80,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#3A3A3C",
    borderRadius: 8,
    backgroundColor: "#1C1C1E",
    minWidth: 70,
    justifyContent: "center",
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 6,
  },
  toggleIndicator: {
    width: 12,
    height: 2.5,
    borderRadius: 1.25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  statsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statsSubtext: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "400",
  },
  listContainer: {
    height: 140,
    paddingVertical: 20,
    backgroundColor: "blue",
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  tagContainer: {
    width: ITEM_WIDTH,
    height: 100,
    borderRadius: 12,
    padding: 12,
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  popularTag: {
    borderWidth: 2,
    borderColor: "#FFD700",
    shadowOpacity: 0.3,
  },
  tagContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  tagLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 4,
  },
  tagCategory: {
    fontSize: 11,
    fontWeight: "500",
    color: "#FFFFFF",
    opacity: 0.8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tagCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginTop: 4,
  },
  dragHandle: {
    position: "absolute",
    top: 4,
    right: 4,
    padding: 4,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dragIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  dragColumn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 1.5,
  },
  dragDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#FFFFFF",
    opacity: 0.8,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  popularDot: {
    backgroundColor: "#FFD700",
  },
  normalDot: {
    backgroundColor: "#8E8E93",
  },
  legendText: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 20,
  },
  modalSubMessage: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FF3B30",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 12,
    color: "#FF3B30",
  },
  modalButtonPrimary: {
    backgroundColor: "#FF3B30",
  },
  modalButtonTextPrimary: {
    color: "#FFFFFF",
  },
});

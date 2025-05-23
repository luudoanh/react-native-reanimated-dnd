import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Sortable } from "./Sortable";
import { SortableItem } from "./SortableItem";
import { SortableRenderItemProps } from "./sortableTypes";

interface Item {
  id: string;
  name: string;
  cover_image_url: string;
  artist: string;
  duration: string;
}

const MUSIC_DATA_RAW = [
  {
    id: 1,
    name: "Thinking Out Loud",
    cover_image_url: "https://picsum.photos/id/11/200/200",
    artist: "Ed Sheeran",
    duration: "5:09",
  },
  {
    id: 2,
    name: "Let Her Go",
    cover_image_url: "https://picsum.photos/id/12/200/200",
    artist: "Passenger",
    duration: "5:29",
  },
  {
    id: 3,
    name: "Counting Stars",
    cover_image_url: "https://picsum.photos/id/13/200/200",
    artist: "OneRepublic",
    duration: "4:04",
  },
  {
    id: 4,
    name: "Cheap Thrills",
    cover_image_url: "https://picsum.photos/id/14/200/200",
    artist: "Sia",
    duration: "2:19",
  },
  {
    id: 5,
    name: "Faded",
    cover_image_url: "https://picsum.photos/id/15/200/200",
    artist: "Alan Walker",
    duration: "5:56",
  },
  {
    id: 6,
    name: "Senorita",
    cover_image_url: "https://picsum.photos/id/16/200/200",
    artist: "Shawn Mendes & Camila Cabello",
    duration: "2:01",
  },
  {
    id: 7,
    name: "Old Town Road",
    cover_image_url: "https://picsum.photos/id/17/200/200",
    artist: "Lil Nas X",
    duration: "3:47",
  },
  {
    id: 8,
    name: "Sunflower",
    cover_image_url: "https://picsum.photos/id/18/200/200",
    artist: "Post Malone & Swae Lee",
    duration: "4:33",
  },
  {
    id: 9,
    name: "All of Me",
    cover_image_url: "https://picsum.photos/id/19/200/200",
    artist: "John Legend",
    duration: "3:12",
  },
  {
    id: 10,
    name: "Bad Guy",
    cover_image_url: "https://picsum.photos/id/20/200/200",
    artist: "Billie Eilish",
    duration: "2:45",
  },
  {
    id: 11,
    name: "Waka Waka",
    cover_image_url: "https://picsum.photos/id/21/200/200",
    artist: "Shakira",
    duration: "4:11",
  },
  {
    id: 12,
    name: "Counting Stars",
    cover_image_url: "https://picsum.photos/id/22/200/200",
    artist: "OneRepublic",
    duration: "3:56",
  },
  {
    id: 13,
    name: "Perfect",
    cover_image_url: "https://picsum.photos/id/23/200/200",
    artist: "Ed Sheeran",
    duration: "2:34",
  },
  {
    id: 14,
    name: "Rockstar",
    cover_image_url: "https://picsum.photos/id/24/200/200",
    artist: "Post Malone ft. 21 Savage",
    duration: "4:52",
  },
  {
    id: 15,
    name: "Blinding Lights",
    cover_image_url: "https://picsum.photos/id/25/200/200",
    artist: "The Weeknd",
    duration: "3:18",
  },
  {
    id: 16,
    name: "Happy",
    cover_image_url: "https://picsum.photos/id/26/200/200",
    artist: "Pharrell Williams",
    duration: "5:23",
  },
  {
    id: 17,
    name: "Memories",
    cover_image_url: "https://picsum.photos/id/27/200/200",
    artist: "Maroon 5",
    duration: "2:47",
  },
  {
    id: 18,
    name: "Shape of You",
    cover_image_url: "https://picsum.photos/id/28/200/200",
    artist: "Ed Sheeran",
    duration: "4:09",
  },
  {
    id: 19,
    name: "Uptown Funk",
    cover_image_url: "https://picsum.photos/id/29/200/200",
    artist: "Mark Ronson ft. Bruno Mars",
    duration: "3:55",
  },
  {
    id: 20,
    name: "Dance Monkey",
    cover_image_url: "https://picsum.photos/id/30/200/200",
    artist: "Tones and I",
    duration: "2:22",
  },
  {
    id: 21,
    name: "Roar",
    cover_image_url: "https://picsum.photos/id/31/200/200",
    artist: "Katy Perry",
    duration: "4:44",
  },
  {
    id: 22,
    name: "Girls Like You",
    cover_image_url: "https://picsum.photos/id/32/200/200",
    artist: "Maroon 5 ft. Cardi B",
    duration: "3:27",
  },
  {
    id: 23,
    name: "Rolling in the Deep",
    cover_image_url: "https://picsum.photos/id/33/200/200",
    artist: "Adele",
    duration: "5:31",
  },
  {
    id: 24,
    name: "Havana",
    cover_image_url: "https://picsum.photos/id/34/200/200",
    artist: "Camila Cabello",
    duration: "2:53",
  },
  {
    id: 25,
    name: "Despacito",
    cover_image_url: "https://picsum.photos/id/35/200/200",
    artist: "Luis Fonsi & Daddy Yankee",
    duration: "4:17",
  },
  {
    id: 26,
    name: "Grenade",
    cover_image_url: "https://picsum.photos/id/36/200/200",
    artist: "Bruno Mars",
    duration: "3:08",
  },
  {
    id: 27,
    name: "Shallow",
    cover_image_url: "https://picsum.photos/id/37/200/200",
    artist: "Lady Gaga & Bradley Cooper",
    duration: "5:02",
  },
  {
    id: 28,
    name: "Someone Like You",
    cover_image_url: "https://picsum.photos/id/38/200/200",
    artist: "Adele",
    duration: "2:39",
  },
  {
    id: 29,
    name: "Believer",
    cover_image_url: "https://picsum.photos/id/39/200/200",
    artist: "Imagine Dragons",
    duration: "4:21",
  },
  {
    id: 30,
    name: "Love Yourself",
    cover_image_url: "https://picsum.photos/id/40/200/200",
    artist: "Justin Bieber",
    duration: "3:14",
  },
];

const MOCK_DATA: Item[] = MUSIC_DATA_RAW.map((item) => ({
  ...item,
  id: String(item.id),
}));

// Item height for sortable list
const ITEM_HEIGHT = 70;
const windowHeight = Dimensions.get("window").height;

interface SortableExampleProps {
  onBack?: () => void;
}

export function SortableExample({ onBack }: SortableExampleProps = {}) {
  const [isDragHandleMode, setIsDragHandleMode] = useState(true);

  // Render each sortable item
  const renderItem = useCallback(
    (props: SortableRenderItemProps<Item>) => {
      const {
        item,
        id,
        positions,
        lowerBound,
        autoScrollDirection,
        itemsCount,
        itemHeight,
      } = props;

      return (
        <SortableItem
          key={id}
          id={id}
          data={item}
          positions={positions}
          lowerBound={lowerBound}
          autoScrollDirection={autoScrollDirection}
          itemsCount={itemsCount}
          itemHeight={itemHeight}
          containerHeight={windowHeight * 0.8}
          style={styles.itemContainer}
          onMove={(currentId, from, to) => {
            console.log(`Item ${currentId} moved from ${from} to ${to}`);
          }}
          onDragStart={(currentId, position) => {
            console.log(`Item ${currentId} dragged from ${position}`);
          }}
          onDrop={(currentId, position) => {
            console.log(`Item ${currentId} dropped at ${position}`);
          }}
          onDragging={(currentId, overItemId, yPosition) => {
            console.log(
              `Item ${currentId} dragging over ${overItemId} at ${yPosition}`
            );
          }}
        >
          <View style={styles.itemContent}>
            <Image
              source={{ uri: item.cover_image_url }}
              style={styles.coverImage}
            />
            <View style={styles.textContainer}>
              <Text style={styles.songName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.artistName} numberOfLines={1}>
                {item.artist}
              </Text>
            </View>
            <Text style={styles.durationText}>{item.duration}</Text>
            {isDragHandleMode && (
              <SortableItem.Handle style={styles.dragHandle}>
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
              </SortableItem.Handle>
            )}
          </View>
        </SortableItem>
      );
    },
    [isDragHandleMode]
  );

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
            <Text style={styles.header}>Playing Now</Text>
          </View>

          <View style={styles.toggleButtonContainer}>
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
                  { backgroundColor: isDragHandleMode ? "#FF3B30" : "#8E8E93" },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.listContainer}>
        <Sortable
          data={MOCK_DATA}
          renderItem={renderItem}
          itemHeight={ITEM_HEIGHT}
          style={styles.list}
        />
      </View>
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
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 6,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingRight: 16,
    flex: 1,
  },
  backIcon: {
    fontSize: 28,
    color: "#FF3B30",
    fontWeight: "300",
    marginRight: 4,
  },
  backText: {
    fontSize: 17,
    color: "#FF3B30",
    fontWeight: "400",
  },
  titleContainer: {
    alignItems: "center",
    flex: 2,
  },
  header: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    color: "#FFFFFF",
  },
  toggleButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  list: {
    flex: 1,
    backgroundColor: "#000000",
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#2C2C2E",
    backgroundColor: "#000000",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#000000",
    borderRadius: 8,
  },
  coverImage: {
    width: 52,
    height: 52,
    borderRadius: 8,
    marginRight: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  songName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 3,
  },
  artistName: {
    fontSize: 15,
    color: "#8E8E93",
    fontWeight: "400",
  },
  durationText: {
    fontSize: 15,
    color: "#FF3B30",
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
    marginRight: 8,
  },
  dragHandle: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  dragIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  dragColumn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  dragDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#8E8E93",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#3A3A3C",
    borderRadius: 6,
    backgroundColor: "#1C1C1E",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 8,
  },
  toggleIndicator: {
    width: 16,
    height: 3,
    borderRadius: 1.5,
  },
});

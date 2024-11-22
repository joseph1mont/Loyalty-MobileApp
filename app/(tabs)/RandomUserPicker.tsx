import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Modal,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

// Users data
const usersData = {
  1: { name: "Alice", points: 120 },
  2: { name: "Bob", points: 95 },
  3: { name: "Charlie", points: 85 },
  4: { name: "David", points: 110 },
  5: { name: "Eva", points: 120 },
  6: { name: "Frank", points: 130 },
  7: { name: "Grace", points: 105 },
  8: { name: "Hank", points: 115 },
  9: { name: "Ivy", points: 100 },
  10: { name: "Jack", points: 125 },
  11: { name: "Kara", points: 90 },
  12: { name: "Liam", points: 130 },
  13: { name: "Mona", points: 105 },
  14: { name: "Nathan", points: 110 },
  15: { name: "Olivia", points: 120 },
  16: { name: "Paul", points: 125 },
  17: { name: "Quinn", points: 100 },
  18: { name: "Rachel", points: 95 },
  19: { name: "Sam", points: 140 },
  20: { name: "Tina", points: 85 },
  21: { name: "Ursula", points: 110 },
  22: { name: "Vince", points: 120 },
  23: { name: "Wendy", points: 95 },
  24: { name: "Xander", points: 105 },
  25: { name: "Yara", points: 130 },
  26: { name: "Zane", points: 140 },
};

// Dynamically calculate the number of columns
const calculateColumns = (screenWidth: number) => {
  if (screenWidth > 768) return 4; // Larger screens
  if (screenWidth > 480) return 3; // Medium screens
  return 2; // Small screens
};

const RandomUserPicker: React.FC = () => {
  const usersArray = Object.keys(usersData).map((key) => ({
    id: key,
    name: usersData[key as keyof typeof usersData].name,
    points: usersData[key as keyof typeof usersData].points,
  }));

  const [users] = useState(usersArray);
  const [countdown, setCountdown] = useState(4);
  const [isChoosing, setIsChoosing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [highlightedUserIndex, setHighlightedUserIndex] = useState<
    number | null
  >(null);
  const [showModal, setShowModal] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const numColumns = calculateColumns(screenWidth);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(timer);
        if (!isChoosing) startChoosing();
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const startChoosing = () => {
    setIsChoosing(true);
    let index = 0;
    const interval = setInterval(() => {
      setHighlightedUserIndex(index % users.length);
      index++;
    }, 100); // Spinning effect every 100ms

    setTimeout(() => {
      clearInterval(interval);
      const randomIndex = Math.floor(Math.random() * users.length);
      setHighlightedUserIndex(randomIndex);
      setSelectedUser(users[randomIndex]);
      setShowModal(true); // Show modal
      setCountdown(4); // Reset countdown for the next round
      setIsChoosing(false);

      // Hide modal after 5 seconds
      setTimeout(() => {
        setShowModal(false);
      }, 5000);
    }, 4500); // Winner selection process takes 4.5 seconds
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Random Winner Selector</Text>

        {/* Countdown Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{countdown}</Text>
        </View>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.card,
                highlightedUserIndex === index && styles.highlightedCard,
              ]}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>Points: {item.points}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
          numColumns={numColumns}
        />

        {/* Winner Modal */}
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>🎉 Congratulations!</Text>
              {selectedUser && (
                <>
                  <Text style={styles.modalWinnerName}>
                    {selectedUser.name}
                  </Text>
                  <Text style={styles.modalWinnerPoints}>
                    Points: {selectedUser.points}
                  </Text>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  timerContainer: {
    alignSelf: "center",
    backgroundColor: "#6200ee",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  timerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  listContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 8,
    borderRadius: 12,
    elevation: 2,
    flex: 1,
    alignItems: "center",
  },
  highlightedCard: {
    backgroundColor: "#ffeb3b",
    borderColor: "#ff9800",
    borderWidth: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 16,
  },
  modalWinnerName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalWinnerPoints: {
    fontSize: 16,
    color: "#757575",
  },
});

export default RandomUserPicker;

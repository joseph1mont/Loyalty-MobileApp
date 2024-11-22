import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

// Example of interacting with an API
const LoyaltyProgram = () => {
  const [stamps, setStamps] = useState(0);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // Fetch current stamps and points from the backend
    const fetchStamps = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/stamps");
        const data = await response.json();
        setStamps(data.stamps);
        setPoints(data.points);
      } catch (error) {
        console.error("Error fetching stamps:", error);
      }
    };
    fetchStamps();
  }, []);

  const handleUpdateStamps = async (newStamps: number, newPoints: number) => {
    try {
      const response = await fetch("http://localhost:3000/api/update-stamps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stamps: newStamps, points: newPoints }),
      });
      if (response.ok) {
        setStamps(newStamps);
        setPoints(newPoints);
        Alert.alert("Success!", "Your stamps and points have been updated.");
      } else {
        Alert.alert("Error", "Failed to update stamps.");
      }
    } catch (error) {
      console.error("Error updating stamps:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Loyalty Program</Text>
      <Text style={styles.subheader}>Collect 9 stamps and get 1 free!</Text>

      <Text style={styles.pointsText}>
        {stamps} Stamps / {points} Points
      </Text>

      <TouchableOpacity
        onPress={() => handleUpdateStamps(stamps + 1, points + 20)}
        style={styles.simulateButton}
      >
        <Text style={styles.simulateButtonText}>Simulate Add Stamp</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheader: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },
  pointsText: {
    fontSize: 16,
    marginBottom: 20,
  },
  simulateButton: {
    padding: 15,
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
  simulateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoyaltyProgram;

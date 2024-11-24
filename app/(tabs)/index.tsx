import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Camera } from "expo-camera"; // Correct import

const stampFilled = require("@/assets/images/stamp-active.png"); // Replace with your actual path
const stampEmpty = require("@/assets/images/stamp-inactive.png"); // Replace with your actual path

const LoyaltyProgram = () => {
  const [stamps, setStamps] = useState(9); // Initially 9 stamps
  const [points, setPoints] = useState(100);
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);

  // Fetch Loyalty Data
  useEffect(() => {
    const fetchLoyaltyData = async () => {
      try {
        const response = await fetch(
          "http://localhost:10159/wp-json/loyalty/v1/options"
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("Loyalty data fetched:", data);
        setStamps(data.stamps_no || 0);
        setPoints(data.stamps_points || 0);
      } catch (error) {
        console.error("Error fetching loyalty data:", error);
        Alert.alert("Error", "Failed to fetch loyalty data.");
      }
    };

    fetchLoyaltyData();
  }, []);

  // Fetch Camera Permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync(); // Correct permission request
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    Alert.alert("QR Code Scanned", `Data: ${data}`);
    setCameraVisible(false); // Hide camera after scanning
    setStamps((prev) => (prev < 9 ? prev + 1 : prev)); // Add a stamp
    setPoints((prev) => prev + 10); // Add points
  };

  const handleSimulateAddStamp = () => {
    if (stamps < 9) {
      setStamps(stamps + 1);
      setPoints(points + 10);
    } else {
      Alert.alert("Congratulations!", "You earned a free stamp!");
      setStamps(0); // Reset stamps after 9 are earned
    }
  };

  const renderStamps = () => {
    return Array.from({ length: 9 }, (_, index) => (
      <Image
        key={index}
        source={index < stamps ? stampFilled : stampEmpty}
        style={styles.stampImage}
      />
    ));
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Loyalty Program</Text>
      <Text style={styles.subheader}>Collect 9 stamps and get 1 free!</Text>

      <View style={styles.stampGrid}>{renderStamps()}</View>

      <Text style={styles.pointsText}>
        {stamps} Stamps / {points} Points
      </Text>

      <TouchableOpacity
        onPress={handleSimulateAddStamp}
        style={styles.simulateButton}
      >
        <Text style={styles.simulateButtonText}>Simulate Add Stamp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setCameraVisible(true)}
        style={styles.scanButton}
      >
        <Text style={styles.scanButtonText}>Scan QR Code</Text>
      </TouchableOpacity>

      {cameraVisible && (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            <TouchableOpacity
              onPress={() => setCameraVisible(false)}
              style={styles.closeCameraButton}
            >
              <Text style={styles.closeCameraText}>Close Camera</Text>
            </TouchableOpacity>
          </Camera>
        </View>
      )}
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
    marginVertical: 20,
  },
  stampGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 20,
  },
  stampImage: {
    width: 60, // Increase size of stamp
    height: 60, // Increase size of stamp
    marginHorizontal: 10,
    marginVertical: 10,
  },
  simulateButton: {
    padding: 15,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    marginBottom: 15,
  },
  simulateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  scanButton: {
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    marginBottom: 15,
  },
  scanButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cameraContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "80%",
  },
  closeCameraButton: {
    padding: 10,
    backgroundColor: "#FF5722",
    borderRadius: 5,
    position: "absolute",
    bottom: 20,
  },
  closeCameraText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default LoyaltyProgram;

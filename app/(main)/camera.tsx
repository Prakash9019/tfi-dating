import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,Platform,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Defs, Ellipse, Mask, Rect } from "react-native-svg";

// Get screen dimensions to calculate the mask
const { width, height } = Dimensions.get("window");
// Define oval dimensions to match the design
const OVAL_WIDTH = width * 0.85;
const OVAL_HEIGHT = height * 0.55;
   const generateDottedOval = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  dots = 60
) => {
  const elements = [];

  for (let i = 0; i < dots; i++) {
    const angle = (2 * Math.PI * i) / dots;

    const x = cx + rx * Math.cos(angle);
    const y = cy + ry * Math.sin(angle);

    elements.push(
      <Rect
        key={i}
        x={x}
        y={y}
        width={6}
        height={6}
        fill="rgba(255,255,255,0.6)"
        rx={1}
        rotation={(angle * 180) / Math.PI}
        originX={x}
        originY={y}
      />
    );
  }

  return elements;
};

export default function CameraScreen() {
  // Get the reference image URI passed from the previous steps
  const { referenceImageUri } = useLocalSearchParams();

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!permission || !permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "white", marginBottom: 20 }}>
          Camera access needed for verification.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permBtn}>
          <Text style={{ fontWeight: "bold" }}>Grant Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhotoAndVerify = async () => {
    router.replace("/(fandom)");
    if (!cameraRef.current || isProcessing) return;
    setIsProcessing(true);

    try {
      // 1. Take the picture
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: true,
      });

      // 2. Resize/Compress so upload is faster (Optional but recommended)
      const manipulated = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 600 } }], // Resize to a reasonable width
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
      );

      // 3. SEND TO BACKEND FOR VERIFICATION
      // We send both the live photo AND the reference photo URI we got earlier
      await uploadAndCompareFaces(manipulated.uri, referenceImageUri as string);
    } catch (error) {
      Alert.alert("Error", "Failed to capture or process image.");
      setIsProcessing(false);
    }
  };

  // Replace with your actual local IP address
  const BACKEND_URL = "http://YOUR_LOCAL_IP:3000";

  const uploadAndCompareFaces = async (
    liveUri: string,
    referenceUri: string,
  ) => {
    const formData = new FormData();

    // Append live photo
    formData.append("livePhoto", {
      uri: Platform.OS === "ios" ? liveUri.replace("file://", "") : liveUri,
      type: "image/jpeg",
      name: "live-photo.jpg",
    } as any);

    // Append reference photo
    // NOTE: If referenceUri is already a remote GCS URL, send it as a string.
    // If it's a local file path from the phone library, append it as a file like above.
    // Assuming for now it's a local file path from the previous step:
    formData.append("referencePhoto", {
      uri:
        Platform.OS === "ios"
          ? referenceUri.replace("file://", "")
          : referenceUri,
      type: "image/jpeg",
      name: "reference-photo.jpg",
    } as any);

    try {
      const response = await fetch(`${BACKEND_URL}/api/verify-faces`, {
        method: "POST",
        body: formData,
        // Do NOT set Content-Type header yourself when using FormData
      });

      const data = await response.json();

      if (data.verified) {
        // SUCCESS! Go to success screen or dashboard
        router.push("/(main)/analysis"); // Or wherever success leads
      } else {
        // FAIL! Show error and let them try again
        Alert.alert(
          "Verification Failed",
          data.message || "Faces did not match.",
        );
      }
    } catch (error) {
      console.error("Backend error:", error);
      Alert.alert("Error", "Could not connect to verification server.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
<View style={styles.container}>

  {/* HEADER */}
  <View style={styles.topSection}>
    <Text style={styles.emoji}>😀 + ☝️</Text>
    <Text style={styles.title}>
      Take a selfie showing{"\n"}up your index finger
    </Text>
  </View>

  {/* CAMERA CARD */}
  <View style={styles.cameraCard}>
    <CameraView
      ref={cameraRef}
      style={StyleSheet.absoluteFill}
      facing="front"
    />

    {/* DOTTED GUIDE OVERLAY */}
<Svg style={StyleSheet.absoluteFill}>
  {generateDottedOval(width * 0.7, height * 0.3, 140, 170)}
  {generateDottedOval(width * 0.3, height * 0.75, 70, 70)}
</Svg>

    <Text style={styles.overlayText}>
      Both your face and index finger should be clearly visible
    </Text>
  </View>

  {/* BUTTON */}
  <TouchableOpacity
    style={styles.takeBtn}
    onPress={takePhotoAndVerify}
  >
    <Text style={styles.takeBtnText}>Take photo</Text>
  </TouchableOpacity>

</View>
  );
}

const styles = StyleSheet.create({
  
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  permBtn: { backgroundColor: "white", padding: 15, borderRadius: 30 },
container: {
  flex: 1,
  backgroundColor: "#F4F2EF",
  alignItems: "center",
},

topSection: {
  marginTop: 80,
  alignItems: "center",
  paddingHorizontal: 40,
},

emoji: {
  fontSize: 36,
  marginBottom: 20,
},

title: {
  fontSize: 24,
  fontWeight: "800",
  textAlign: "center",
},

cameraCard: {
  marginTop: 40,
  width: "88%",
  height: 420,
  borderRadius: 28,
  overflow: "hidden",   // 🔥 THIS clips camera inside box
  backgroundColor: "black",
  justifyContent: "center",
},

overlayText: {
  position: "absolute",
  bottom: 15,
  alignSelf: "center",
  color: "white",
  fontSize: 12,
},

takeBtn: {
  marginTop: 40,
  backgroundColor: "black",
  paddingHorizontal: 40,
  paddingVertical: 18,
  borderRadius: 40,
},

takeBtnText: {
  color: "white",
  fontSize: 18,
  fontWeight: "700",
},
});

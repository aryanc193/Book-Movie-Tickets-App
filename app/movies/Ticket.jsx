import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import dayjs from "dayjs";

const Ticket = () => {
  const router = useRouter();
  const { movieTitle, theater, date, time, seats, city, amount, img } =
    useLocalSearchParams();

  // Convert seats from string to array
  const seatsArray = seats ? seats.split(", ") : [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          onPress={() => router.back()}
          name="chevron-back"
          size={28}
          color="red"
        />
        <Text style={styles.headerTitle}>My Ticket</Text>
      </View>

      {/* Ticket Details */}
      <View style={styles.ticketDetails}>
        <Image style={styles.image} source={{ uri: img }} />
        <View style={styles.details}>
          <Text style={styles.title}>{movieTitle}</Text>
          <Text style={styles.info}>
            {theater}, {city}
          </Text>
          <Text style={styles.info}>
            {date} | {time}
          </Text>
          <View style={styles.barcodeContainer}>
            <AntDesign name="barcode" size={30} color="black" />
            <Text style={styles.barcodeText}>{seatsArray.join(", ")}</Text>
          </View>
          <Text style={styles.amount}>Total Amount: Rs {amount}</Text>
        </View>
      </View>

      {/* Continue to Home Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => router.push("../(tabs)/home")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Continue to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#E3E3E3",
    borderBottomWidth: 2,
    paddingVertical: 10,
  },
  headerTitle: {
    color: "black",
    fontWeight: "600",
    fontSize: 17,
    marginLeft: 10,
  },
  ticketDetails: {
    flexDirection: "row",
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E3E3E3",
    overflow: "hidden",
  },
  image: {
    width: 130,
    height: 180,
    borderRadius: 10,
    resizeMode: "cover",
  },
  details: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  title: {
    fontWeight: "600",
    color: "black",
    fontSize: 18,
  },
  info: {
    fontWeight: "400",
    color: "grey",
    fontSize: 14,
    marginTop: 5,
  },
  seats: {
    fontWeight: "600",
    color: "black",
    fontSize: 16,
    marginTop: 10,
  },
  barcodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  barcodeText: {
    fontWeight: "600",
    color: "black",
    fontSize: 16,
    marginLeft: 10,
  },
  amount: {
    fontWeight: "600",
    color: "black",
    fontSize: 18,
    marginTop: 20,
  },
  footer: {
    justifyContent: "flex-end",
    padding: 20,
  },
  button: {
    height: 50,
    backgroundColor: "#ff0000",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default Ticket;

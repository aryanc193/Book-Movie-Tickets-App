import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import icons from "../../constants/icons.js";
import useAppwrite from "../../lib/useAppwrite";
import { getTickets, signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import EmptyState from "../../components/EmptyState";
import InfoBox from "../../components/InfoBox.jsx";
import { router } from "expo-router";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: tickets } = useAppwrite(() => getTickets(user.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.ticketDetails}>
            <Image style={styles.image} source={{ uri: item.img }} />
            <View style={styles.details}>
              <Text style={styles.title}>{item.movie}</Text>
              <Text style={styles.info}>
                {item.theater}, {item.city}
              </Text>
              <Text style={styles.info}>
                {item.date} | {item.time}
              </Text>
              <View style={styles.barcodeContainer}>
                <AntDesign name="barcode" size={30} color="black" />
                <Text style={styles.barcodeText}>{item.seats.join(", ")}</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => <EmptyState title="No Tickets Found" />}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border -mt-5 border-secondary rounded-full flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-full"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              subtitle={user?.email}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />
            <Text className="text-black-200 mt-5 -mb-10">
              View your tickets here
            </Text>
          </View>
        )}
      />
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

export default Profile;

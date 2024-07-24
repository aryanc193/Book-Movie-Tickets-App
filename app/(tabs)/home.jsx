import React, { useState } from "react";
import {
  FlatList,
  Text,
  View,
  Image,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import { getAllPosts } from "../../lib/appwrite";
import EmptyState from "../../components/EmptyState";
import { router } from "expo-router";
import { useStoreContext } from "../../context/Wrapper"; // Import your context

const Home = () => {
  const { user } = useGlobalContext();
  const { data: selectedCity } = useStoreContext() || {}; // Default to empty object
  const { data: posts, refetch } = useAppwrite(getAllPosts) || {};
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  console.log(selectedCity);
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePress = (id) => {
    console.log("Navigating to MovieDetail with ID:", id);
    if (selectedCity) {
      router.push(`/movies/${id}?city=${selectedCity}`);
    } else {
      alert("Please select a city.");
    }
  };

  const renderMovieItem = ({ item, isTouchable }) => (
    <TouchableOpacity
      style={{ flex: 1, margin: 5 }}
      onPress={() => handlePress(item.$id)}
      disabled={!isTouchable}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: item.thumbnail }}
          style={{ width: "100%", height: 350, borderRadius: 10 }}
          resizeMode="cover"
        />
        <View style={{ position: "absolute", top: 10, left: 10 }}>
          <Ionicons name="heart" size={24} color={item.fav ? "red" : "white"} />
        </View>
        <View style={{ position: "absolute", top: 10, right: 10 }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {item.fav || 0}%
          </Text>
        </View>
      </View>
      <Text
        style={{
          color: "black",
          fontWeight: "bold",
          marginTop: 5,
          textAlign: "center",
          fontSize: 20,
        }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderSection = (title, data, isTouchable) => (
    <View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginLeft: 10,
          marginTop: 15,
          marginBottom: -10,
          color: "black",
        }}
      >
        {title}
      </Text>
      <View style={{ width: "90%", height: 1, backgroundColor: "red" }} />
      <FlatList
        data={data}
        renderItem={(item) => renderMovieItem({ ...item, isTouchable })}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        ListEmptyComponent={() => <EmptyState title="No Movies Found" />}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );

  const nowShowingMovies =
    posts?.filter((post) => post.status.toLowerCase() === "now showing") || [];
  const upcomingMovies =
    posts?.filter((post) => post.status.toLowerCase() === "upcoming") || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        ListHeaderComponent={() => (
          <View className="mt-10 px-3">
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <View>
                <Text style={{ fontSize: 18, color: "red" }}>
                  Welcome Back,
                </Text>
                <Text
                  style={{ fontSize: 36, color: "red", fontWeight: "bold" }}
                >
                  {user?.username}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Entypo name="location-pin" size={30} color="red" />
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("SelectCity");
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      color: "red",
                      fontWeight: "600",
                      marginLeft: 8,
                    }}
                  >
                    {selectedCity ? selectedCity : "Select City"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          <>
            <View style={{ marginTop: -10 }}>
              {renderSection("Now Showing", nowShowingMovies, true)}
            </View>
            <View>{renderSection("Upcoming", upcomingMovies, false)}</View>
          </>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={[]}
        renderItem={null}
      />
    </SafeAreaView>
  );
};

export default Home;

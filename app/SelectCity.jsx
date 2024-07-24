import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStoreContext } from "../context/Wrapper"; // Import your context
import { router } from "expo-router";
import { cities } from "../assets/Utils/Date";

const SelectCity = () => {
  const [isSelected, setIsSelected] = useState(null);
  const [isClicked, setIsClicked] = useState(true);
  const { data, setData } = useStoreContext();

  useEffect(() => {
    const loadCity = async () => {
      try {
        const storedCity = await AsyncStorage.getItem("selectedCity");
        if (storedCity) {
          setIsSelected(cities.indexOf(storedCity));
          setData(storedCity);
          setIsClicked(false);
        }
      } catch (error) {
        console.error("Failed to load city:", error);
      }
    };

    loadCity();
  }, []);

  const handleCitySelection = async (item, index) => {
    setIsSelected(index);
    setIsClicked(false);
    setData(item);
    try {
      await AsyncStorage.setItem("selectedCity", item);
    } catch (error) {
      console.error("Failed to save city:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 35 }}>
      <Text style={{ fontSize: 25, fontWeight: "bold" }}>Select city</Text>
      <FlatList
        style={{ marginTop: 40 }}
        numColumns={3}
        data={cities}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handleCitySelection(item, index)}
            style={{
              borderWidth: isSelected === index ? 2 : 1,
              borderColor: isSelected === index ? "red" : "gray",
              marginLeft: 20,
              marginBottom: 30,
              paddingHorizontal: 18,
              paddingVertical: 9,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontWeight: "400",
                color: isSelected === index ? "red" : "gray",
                fontSize: 16,
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
      <View style={{ flex: 0.9, justifyContent: "flex-end" }}>
        <TouchableOpacity
          disabled={isClicked}
          onPress={() => router.push("(tabs)/home")}
          style={{
            backgroundColor: isClicked ? "#E3E3E3" : "red",
            marginHorizontal: 20,
            marginBottom: 20,
            height: 55,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontWeight: "bold", color: isClicked ? "grey" : "white" }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SelectCity;

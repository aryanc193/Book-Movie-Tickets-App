import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getMovieById } from "../../lib/appwrite";
import CustomButton from "../../components/CustomButton";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";

const MovieDetail = () => {
  const { id, city } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieById(id);
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const getUpcomingWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(dayjs().add(i, "day").format("DD MMM, YYYY"));
    }
    return dates;
  };

  const handleTimeSelection = (time) => {
    if (!selectedTheater) {
      alert("Please select a theater first.");
      return;
    }
    setSelectedTime(time);
  };

  const handleBookTickets = () => {
    if (selectedDate && selectedTheater && selectedTime && city) {
      router.push(
        `./Booking?id=${movie.$id}&date=${selectedDate}&theater=${selectedTheater}&time=${selectedTime}&city=${city}&img=${movie.thumbnail}`
      );
    } else {
      alert("Please select a city, date, theater, and time.");
    }
  };

  const handleTheaterSelection = (theater) => {
    if (selectedTheater === theater) return;
    setSelectedTheater(theater);
    setSelectedTime(null); // Reset selected time when changing theaters
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setSelectedTheater(null); // Reset theater selection
    setSelectedTime(null); // Reset time selection
  };

  console.log(selectedDate);
  console.log(selectedTime);
  console.log(selectedTheater);

  if (loading) return <Text>Loading...</Text>;

  if (!movie) return <Text>Movie not found</Text>;

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle="flex-grow px-4 py-6">
        {/* Movie Title */}
        <Text className="text-3xl font-semibold mt-20 text-black left-5 uppercase">
          {movie.title}
        </Text>
        <Text className="text-lg mt-2 text-black left-5">{`City: ${city}`}</Text>

        {/* Date Selection */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {getUpcomingWeekDates().map((date, index) => (
            <TouchableOpacity
              key={index}
              className={`rounded-lg p-2 m-2 border-2 ${
                selectedDate === date ? "border-red-600" : "border-red-200"
              }`}
              style={{ minWidth: 80, alignItems: "center" }}
              onPress={() => handleDateSelection(date)}
            >
              <Text className="text-black">{date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Theater Selection */}
        <View className="mt-5">
          <Text className="text-black text-xl font-regular ml-5">Theaters</Text>
          {movie.theaters.map((theater, index) => (
            <TouchableOpacity
              key={index}
              className={`my-4 rounded-lg p-2 m-2 border-2 ${
                selectedTheater === theater ? "border-black" : "border-gray-300"
              }`}
              onPress={() => handleTheaterSelection(theater)}
            >
              <View style={{ position: "absolute", top: 10, left: 10 }}>
                <Ionicons
                  name={selectedTheater === theater ? "heart" : "heart-outline"}
                  size={24}
                  color={selectedTheater === theater ? "black" : "gray"}
                />
              </View>
              <Text className="text-black text-lg font-regular mb-2 ml-9">
                {theater}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Showtime Selection */}
        {selectedTheater && (
          <View className="mt-5">
            <Text className="text-black text-xl font-regular ml-5">
              Showtimes for {selectedTheater}
            </Text>
            <View className="flex-row flex-wrap">
              {movie.timings.map((time, idx) => (
                <TouchableOpacity
                  key={idx}
                  className={`rounded-lg p-2 m-2 border-2 ${
                    selectedTime === time ? "border-black" : "border-gray-300"
                  }`}
                  style={{ minWidth: 80, alignItems: "center" }}
                  onPress={() => handleTimeSelection(time)}
                >
                  <Text className="text-black">{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      <CustomButton
        title="BOOK TICKETS"
        handlePress={handleBookTickets}
        containerStyles="w-full mt-7"
      />
    </View>
  );
};

export default MovieDetail;

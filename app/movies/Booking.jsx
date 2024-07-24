import React, { useState, useEffect } from "react";
import { View, Text, Alert, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getMovieById, bookAppointment } from "../../lib/appwrite";
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Seats } from "../../assets/Utils/Date";
import dayjs from "dayjs";

const Booking = () => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const { id, date, theater, time, city } = useLocalSearchParams();
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const seatPrice = 100; // Example price per seat

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieById(id);
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  const handleSeatToggle = (seat) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seat)
        ? prevSelectedSeats.filter((s) => s !== seat)
        : [...prevSelectedSeats, seat]
    );
  };

  const handleBookAppointment = async () => {
    try {
      if (!movie) {
        Alert.alert("Error", "Movie information is not available.");
        return;
      }
      if (selectedSeats.length === 0) {
        Alert.alert("Error", "Please select at least one seat.");
        return;
      }
      const totalAmount = selectedSeats.length * seatPrice;

      await bookAppointment(
        user.$id,
        movie.title,
        theater,
        date,
        time,
        selectedSeats,
        city,
        movie.thumbnail
      );
      router.push(
        `./Ticket?movieTitle=${
          movie.title
        }&theater=${theater}&date=${date}&time=${time}&seats=${selectedSeats.join(
          ", "
        )}&city=${city}&amount=${totalAmount}&img=${movie.thumbnail}`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to book seats. Please try again.");
      console.error(error);
    }
  };

  const groupSeats = (seats, seatsPerRow) => {
    const rows = [];
    for (let i = 0; i < seats.length; i += seatsPerRow) {
      rows.push(seats.slice(i, i + seatsPerRow));
    }
    return rows;
  };

  const SeatsPerRow = 6; // Number of seats per row

  const groupedSeats = groupSeats(Seats, SeatsPerRow);

  if (loading) return <Text>Loading...</Text>;

  if (!movie) return <Text>Movie not found</Text>;

  const totalAmount = selectedSeats.length * seatPrice;

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle="flex-grow px-4 py-6">
        <Text className="text-3xl font-semibold mt-20 text-black left-5 uppercase">
          {movie.title}
        </Text>
        <Text className="text-lg mt-2 text-black left-5">
          {`At ${theater}, ${city}`}
        </Text>
        <Text className="text-lg mt-2 text-black left-5">{`On ${date}`}</Text>
        <Text className="text-lg mt-2 text-black left-5">
          {`Time: ${time}`}
        </Text>
        <Text className="text-lg text-black my-4 left-5">
          Select your seats and confirm!
        </Text>
        <View className="flex-1 mb-5">
          {groupedSeats.map((row, rowIndex) => (
            <View key={rowIndex} className="flex-row justify-center mb-2">
              {row.map((seat) => (
                <TouchableOpacity
                  key={seat}
                  onPress={() => handleSeatToggle(seat)}
                  className={`w-12 h-12 m-1 flex items-center justify-center ${
                    selectedSeats.includes(seat)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  <Text className="text-black">{seat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        <Text className="text-xl font-regular text-black left-5">
          Selected Seats:{" "}
        </Text>
        <Text className="text-black font-bold text-2xl mt-4 ml-10">
          {selectedSeats.join(", ")}
        </Text>
        <Text className="text-xl font-regular text-black left-5 mt-4">
          Total Amount: Rs {totalAmount}
        </Text>
      </ScrollView>
      <CustomButton
        title="Pay Now"
        handlePress={handleBookAppointment}
        containerStyles="w-full h-12 bg-secondary"
      />
    </View>
  );
};

export default Booking;

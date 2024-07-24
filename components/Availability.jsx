import { View, Text } from "react-native";
import React from "react";

const Availability = ({colors,name}) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View
        style={{
          backgroundColor:colors,
          width: 20,
          height: 20,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
        }}
      ></View>
      <Text style={{fontWeight:'400',fontSize:12,color:'grey'}}>{name}</Text>
    </View>
  );
};

export default Availability;

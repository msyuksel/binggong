import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { addExerciseStyles } from "../../styles/addExerciseStyles/addExerciseStyles";

// A component for rendering each exercise item
export const ExerciseItem = ({ item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('ExerciseDetails', {item})}>
      <View style={addExerciseStyles.itemContainer}>
        <Text style={addExerciseStyles.itemName}>{item.name}</Text>
        <View
          style={{ flexDirection: "column", margin: 0, alignSelf: "flex-end" }}
        >
          <Text style={addExerciseStyles.itemDetails}>Force: {item.force}</Text>
          <Text style={addExerciseStyles.itemDetails}>
            Primary Muscle: {item.primaryMuscles}
          </Text>
        </View>
        <TouchableOpacity style={addExerciseStyles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};


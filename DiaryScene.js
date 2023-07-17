import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  FlatList,
  useFocusEffect,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { ThemeContext } from "../contexts/ThemeContext.js";
import { useNavigation } from "@react-navigation/native";
import { ExerciseItem } from "../components/addExerciseComponents/ExerciseItem";
import { DarkStyles } from "../styles/diarySceneStyles/DarkStyles";
import { LightStyles } from "../styles/diarySceneStyles/LightStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DiaryScene = () => {
  const navigation = useNavigation();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Define a state variable to store the exercises array
  const [exercises, setExercises] = useState([]);

  const fetchExercises = async () => {
    try {
      // Get all the keys that start with "exercise_"
      const keys = await AsyncStorage.getAllKeys();
      const exerciseKeys = keys.filter((key) => key.startsWith("exercise_"));

      // Get all the values for those keys
      const values = await AsyncStorage.multiGet(exerciseKeys);

      // Parse the values as JSON objects and store them in the state variable
      const exercises = values.map(([key, value]) => JSON.parse(value));
      setExercises(exercises);
    } catch (error) {
      // Handle any errors
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  // Get theme from context
  const { isDarkMode } = useContext(ThemeContext);

  const formatDate = checkIfToday();

  updateDateFromLocalTime(currentDate, setCurrentDate);

  const handleChangeDate = changeDate();
  const { handleSwipeLeft, handleSwipeRight } = handleSwipes(handleChangeDate);

  const config = {
    velocityThreshold: 0.8,
    directionalOffsetThreshold: 45,
  };

  const styles = isDarkMode ? DarkStyles : LightStyles;

  useFocusEffect(
    React.useCallback(() => {
      fetchExercises();
    }, [])
  );

  return (
    <GestureRecognizer
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      config={config}
      style={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.dateText} onPress={() => handleChangeDate(-1)}>
            {"<"}
          </Text>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          <Text style={styles.dateText} onPress={() => handleChangeDate(1)}>
            {">"}
          </Text>
        </View>
        <View style={styles.exerciseList}>
          <Text style={styles.exerciseText}>Exercise</Text>
          <FlatList>
          data={exercises} // Pass the exercises array as the data prop
            renderItem={(
              { item } // Pass a function that renders each item as an ExerciseItem component
            ) => (
              <ExerciseItem
                name={item.name}
                date={item.date}
                force={item.force}
                primaryMuscle={item.primaryMuscles}
                secondaryMuscle={item.secondaryMuscles}
                weight={item.weight}
                restTime={item.restTime}
                sets={item.sets}
              />
            )}
            keyExtractor={(item) => item.date} // Pass a function that returns a unique key for each item
            <Button
              title="ADD EXERCISE"
              onPress={() => navigation.navigate("AddExercise")}
            />
          </FlatList>
        </View>
      </View>
    </GestureRecognizer>
  );

  function changeDate() {
    return (days) => {
      // Create a new date object by adding ;the days to the selected date
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + days);
      // Update the selected date state with the new date
      setSelectedDate(newDate);
    };
  }
};

export default DiaryScene;

function checkIfToday() {
  return (date) => {
    // If the date is today, return "Today"
    if (date.toDateString() === new Date().toDateString()) {
      return "Today";
    }
    // Otherwise, return the date in the format "Month Day, Year"
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
}

function handleSwipes(handleChangeDate) {
  const handleSwipeLeft = () => {
    // Change the selected date to the next day
    handleChangeDate(1);
  };

  // Handle swiping right
  const handleSwipeRight = () => {
    // Change the selected date to the previous day
    handleChangeDate(-1);
  };
  return { handleSwipeLeft, handleSwipeRight };
}

function updateDateFromLocalTime(currentDate, setCurrentDate) {
  useEffect(() => {
    const interval = setInterval(() => {
      // Create a new date object every second
      const now = new Date();
      // Check if the current date is different from the state current date
      if (now.toDateString() !== currentDate.toDateString()) {
        // Update the state with the new current date
        setCurrentDate(now);
      }
    }, 1000); // run every second
    return () => {
      // Clear the interval when the component unmounts
      clearInterval(interval);
    };
  }, [currentDate]);
}

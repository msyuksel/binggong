import React, { useState, useEffect, useContext } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { ThemeContext } from "../contexts/ThemeContext.js";
import { useNavigation } from "@react-navigation/native";
import { DarkStyles } from "../styles/diarySceneStyles/DarkStyles";
import { LightStyles } from "../styles/diarySceneStyles/LightStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExerciseItem } from "../components/addExerciseComponents/ExerciseItem.js";
import { ExerciseDetailsScene } from "../scenes/ExerciseDetailsScene";

const DiaryScene = () => {
  const navigation = useNavigation();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

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

          {/* <Button title="DELETE SELECTED" onPress={handleDeleteItems} /> */}
          <ScrollView>
            {/* If the exercise that's saved in ExerciseDetailsScene.js has a matching date with the formatDate,
            display the exercise in the list like with ExerciseItem.js.
            For now, display all exercise data inside boxes with the data converted to text*/}
            {exercises.map((exercise) => {
              if (exercise.date === formatDate(selectedDate)) {
                return (
                  <ExerciseItem
                    key={exercise.id}
                    exercise={exercise}
                    setSelectedDate={setSelectedDate}
                  />
                );
              }
            })}

            <Button
              title="ADD EXERCISE"
              onPress={() => navigation.navigate("AddExercise")}
            />
          </ScrollView>
        </View>
      </View>
    </GestureRecognizer>
  );

  function changeDate() {
    return (days) => {
      // Create a new date object by adding the days to the selected date
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

import React, { useState, useEffect, useContext } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { ThemeContext } from "../contexts/ThemeContext.js";
import { useNavigation } from "@react-navigation/native";
import { ExerciseItem } from "../components/addExerciseComponents/ExerciseItem";
import { DarkStyles } from "../styles/diarySceneStyles/DarkStyles";
import { LightStyles } from "../styles/diarySceneStyles/LightStyles";

const DiaryScene = () => {
  const navigation = useNavigation();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [exercises, setExercises] = useState([]);

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
            {/* Render ExerciseItem(s) here */}
              
            <Button
              title="ADD EXERCISE"
              onPress={() => navigation.navigate("AddExercise")}
            />
          </ScrollView>
        </View>
      </View>
    </GestureRecognizer>
  );

  function checkIfChecked() {
    return (id) => {
      // Find the index of the exercise with the given id in the exercises array
      const index = exercises.findIndex((exercise) => exercise.id === id);
      // Create a copy of the exercises array
      const newExercises = [...exercises];
      // Toggle the checked property of the exercise at the index
      newExercises[index].checked = !newExercises[index].checked;
      // Update the exercises state with the new array
      setExercises(newExercises);
    };
  }

  function changeDate() {
    return (days) => {
      // Create a new date object by adding ;the days to the selected date
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + days);
      // Update the selected date state with the new date
      setSelectedDate(newDate);
    };
  }

  // From AddExerciseScene.js
  // Return the main view with all the components
  return (
    <View style={addExerciseStyles.container}>
      {renderSearchBar()}
      {renderTabs()}
      {renderList()}
    </View>
  );
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

// From AddExerciseScene.js
// A function to render the list of exercises based on the filter function
const renderList = () => {
  // Render the flat list of exercises with the header and the item component
  return (
    <FlatList
      data={filterExercises()}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ExerciseItem item={item} />}
      // Here you are rendering the listHeader variable directly, without wrapping it in a Text component
      ListHeaderComponent={listHeader}
    />
  );
};

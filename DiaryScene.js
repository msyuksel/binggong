import React, { useState, useEffect } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures"; // import the library
import AsyncStorage from "@react-native-async-storage/async-storage"; // import AsyncStorage
import CheckBox from "expo-checkbox";

// Define the getExercises function
const getExercises = async (date) => {
  try {
    const jsonValue = await AsyncStorage.getItem(date); // use date as key
    if (jsonValue !== null) {
      return JSON.parse(jsonValue); // convert JSON string to exercises array
    }
  } catch (e) {
    // handle error
  }
};

// Define the saveExercises function
const saveExercises = async (date, exercises) => {
  try {
    const jsonValue = JSON.stringify(exercises); // convert exercises array to JSON string
    await AsyncStorage.setItem(date, jsonValue); // use date as key
  } catch (e) {
    // handle error
  }
};

// Define the deleteExercises function
const deleteExercises = async (date, exercises) => {
  try {
    const jsonValue = JSON.stringify(exercises); // convert exercises array to JSON string
    await AsyncStorage.setItem(date, jsonValue); // use date as key
  } catch (e) {
    // handle error
  }
};

const DiaryScene = () => {
  // Use state to store the current date and the selected date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [exercises, setExercises] = useState([]);

  // Format the date as a string
  const formatDate = (date) => {
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

  // Use effect hook to get exercises for the selected date when the component mounts or the selected date changes
  useEffect(() => {
    const fetchExercises = async () => {
      const dateKey = formatDate(selectedDate); // format the selected date as key
      const exercises = await getExercises(dateKey); // get exercises for the selected date key
      if (exercises) {
        setExercises(exercises); // update state with exercises array
      } else {
        setExercises([]); // no exercises found for the selected date key, set state to empty array
      }
    };
    fetchExercises();
  }, [selectedDate]); // run effect when selected date changes

  // Use effect hook to update the current date when it changes based on time
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
  }, [currentDate]); // run effect when current date changes

  // Handle adding a new exercise
  const handleAddExercise = async () => {
    // Create a new exercise object with a random id and name and a checked property set to false
    const newExercise = {
      id: Math.random().toString(),
      name: "New Exercise",
      checked: false,
    };
    // Update the exercises state by adding the new exercise to the end of the array
    setExercises((prevExercises) => [...prevExercises, newExercise]);
    // Save the updated exercises array for the selected date key
    const dateKey = formatDate(selectedDate); // format the selected date as key
    await saveExercises(dateKey, [...exercises, newExercise]); // save exercises array for the selected date key
  };

  // Handle changing the selected date by a given amount of days
  const handleChangeDate = (days) => {
    // Create a new date object by adding ;the days to the selected date
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days);
    // Update the selected date state with the new date
    setSelectedDate(newDate);
  };

  // Handle swiping left
  const handleSwipeLeft = () => {
    // Change the selected date to the next day
    handleChangeDate(1);
  };

  // Handle swiping right
  const handleSwipeRight = () => {
    // Change the selected date to the previous day
    handleChangeDate(-1);
  };

  // Handle toggling the checked property of an exercise
  const handleToggleCheck = (id) => {
    // Find the index of the exercise with the given id in the exercises array
    const index = exercises.findIndex((exercise) => exercise.id === id);
    // Create a copy of the exercises array
    const newExercises = [...exercises];
    // Toggle the checked property of the exercise at the index
    newExercises[index].checked = !newExercises[index].checked;
    // Update the exercises state with the new array
    setExercises(newExercises);
  };

  // Handle deleting multiple items
  const handleDeleteItems = async () => {
    // Filter out the exercises that are not checked
    const newExercises = exercises.filter((exercise) => !exercise.checked);
    // Update the exercises state with the new array
    setExercises(newExercises);
    // Delete the updated exercises array for the selected date key
    const dateKey = formatDate(selectedDate); // format the selected date as key
    await deleteExercises(dateKey, newExercises); // delete exercises array for the selected date key
  };

  // Define a config object for swipe gestures
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  return (
    // Wrap the View component with a GestureRecognizer component
    <GestureRecognizer
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      config={config}
      style={{ flex: 1 }}
    >
      {/* Add a background-color to the View component */}
      <View style={{ flex: 1, backgroundColor: "blueviolet" }}>
        {/* Header with Diary title and hamburger icon */}
        {/* Date picker with arrows */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            padding: 10,
          }}
        >
          {/* Change the color to azure for the arrows and the date */}
          <Text
            style={{ fontSize: 24, color: "#f0ffff" }}
            onPress={() => handleChangeDate(-1)}
          >
            {"<"}
          </Text>
          <Text style={{ fontSize: 24, color: "#f0ffff" }}>
            {formatDate(selectedDate)}
          </Text>
          <Text
            style={{ fontSize: 24, color: "#f0ffff" }}
            onPress={() => handleChangeDate(1)}
          >
            {">"}
          </Text>
        </View>
        {/* Exercise list with add button and delete button */}
        <View style={{ flex: 1 }}>
          {/* Change the color to azure for the Exercise text */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginLeft: 10,
              color: "#f0ffff",
            }}
          >
            Exercise
          </Text>
          {/* Render a button to delete multiple items */}
          <Button title="DELETE SELECTED" onPress={handleDeleteItems} />
          <ScrollView>
            {exercises.map((exercise) => (
              // Render each exercise as a box with its name and a checkbox
              <View
                key={exercise.id}
                style={{
                  margin: 10,
                  padding: 10,
                  backgroundColor: "#eee",
                  borderRadius: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/* Render a checkbox that toggles when pressed */}
                <CheckBox
                  value={exercise.checked}
                  onValueChange={() => handleToggleCheck(exercise.id)}
                />
                <Text style={{ fontSize: 18 }}>{exercise.name}</Text>
              </View>
            ))}
            {/* Render the add button at the end of the list */}
            <Button title="ADD EXERCISE" onPress={handleAddExercise} />
          </ScrollView>
        </View>
      </View>
    </GestureRecognizer>
  );
};

export default DiaryScene;

// Import React Native components
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

// Import the file system module
const fs = require("fs");

// Define the path to the JSON file
const filePath = "src/utils/exercises.json";

// Define a function to fetch the exercises for a given date
const fetchExercises = (date) => {
  // Return a promise that resolves with the exercises array
  return new Promise((resolve, reject) => {
    // Read the JSON file asynchronously
    fs.readFile(filePath, "utf8", (err, data) => {
      // If there is an error, reject the promise with the error
      if (err) {
        reject(err);
      }
      // If there is no error, parse the data as a JSON object
      else {
        const exercises = JSON.parse(data);
        // Filter the exercises by the date and resolve the promise with the filtered array
        const filteredExercises = exercises.filter(
          (exercise) =>
            exercise.date.getDate() === date.getDate() &&
            exercise.date.getMonth() === date.getMonth() &&
            exercise.date.getFullYear() === date.getFullYear()
        );
        resolve(filteredExercises);
      }
    });
  });
};

// Define a function to save a new exercise to the JSON file
const saveExercise = (newExercise) => {
  // Return a promise that resolves with the new exercise object
  return new Promise((resolve, reject) => {
    // Read the JSON file asynchronously
    fs.readFile(filePath, "utf8", (err, data) => {
      // If there is an error, reject the promise with the error
      if (err) {
        reject(err);
      }
      // If there is no error, parse the data as a JSON object
      else {
        const exercises = JSON.parse(data);
        // Append the new exercise to the exercises array
        exercises.push(newExercise);
        // Stringify the updated exercises array and write it back to the JSON file asynchronously
        fs.writeFile(filePath, JSON.stringify(exercises), "utf8", (err) => {
          // If there is an error, reject the promise with the error
          if (err) {
            reject(err);
          }
          // If there is no error, resolve the promise with the new exercise object
          else {
            resolve(newExercise);
          }
        });
      }
    });
  });
};

// Define a function to delete selected exercises from the JSON file
const deleteExercises = (selectedExercises) => {
  // Return a promise that resolves with nothing
  return new Promise((resolve, reject) => {
    // Read the JSON file asynchronously
    fs.readFile(filePath, "utf8", (err, data) => {
      // If there is an error, reject the promise with the error
      if (err) {
        reject(err);
      }
      // If there is no error, parse the data as a JSON object
      else {
        const exercises = JSON.parse(data);
        // Filter out the selected exercises from the exercises array
        const remainingExercises = exercises.filter(
          (exercise) => !selectedExercises.includes(exercise)
        );
        // Stringify the remaining exercises array and write it back to the JSON file asynchronously
        fs.writeFile(
          filePath,
          JSON.stringify(remainingExercises),
          "utf8",
          (err) => {
            // If there is an error, reject the promise with the error
            if (err) {
              reject(err);
            }
            // If there is no error, resolve the promise with nothing
            else {
              resolve();
            }
          }
        );
      }
    });
  });
};

// Define a custom component for each exercise box
const ExerciseBox = ({ item, onPress, onLongPress }) => {
  return (
    <TouchableOpacity
      style={[styles.exerciseBox, item.selected && styles.selected]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text style={styles.exerciseText}>{item.name}</Text>
    </TouchableOpacity>
  );
};

// Define the DiaryScene component
const DiaryScene = () => {
  // Use state variables to store the current date, the exercises list and the selected exercises
  const [date, setDate] = useState(new Date());
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

  // Use an effect hook to fetch the exercises from the backend when the date changes
  useEffect(() => {
    fetchExercises(date).then((data) => {
      setExercises(data);
    });
  }, [date]);

  // Define a function to add a new exercise to the list and save it to the backend
  const addExercise = () => {
    // Generate a random exercise name (replace this with your own logic)
    const name = `Exercise ${Math.floor(Math.random() * 100) + 1}`;
    // Create a new exercise object with the name and the date
    const newExercise = { name, date };
    // Save the new exercise to the backend
    saveExercise(newExercise).then(() => {
      // Update the exercises state with the new exercise
      setExercises([...exercises, newExercise]);
    });
  };

  // Define a function to delete the selected exercises from the list and the backend
  const deleteExercises = () => {
    // Filter out the selected exercises from the list
    const remainingExercises = exercises.filter(
      (exercise) => !selectedExercises.includes(exercise)
    );
    // Delete the selected exercises from the backend
    deleteExercises(selectedExercises).then(() => {
      // Update the exercises and selectedExercises state with the remaining exercises
      setExercises(remainingExercises);
      setSelectedExercises([]);
    });
  };
  // Define a function to handle the press event on an exercise box
  const handlePress = (exercise) => {
    // If there is already a selected exercise, toggle the selection of the pressed exercise
    if (selectedExercises.length > 0) {
      toggleSelection(exercise);
    }
  };
  // Define a function to handle the long press event on an exercise box
  const handleLongPress = (exercise) => {
    // Toggle the selection of the long pressed exercise
    toggleSelection(exercise);
  };

  // Define a helper function to toggle the selection of an exercise
  const toggleSelection = (exercise) => {
    // Check if the exercise is already selected or not
    const isSelected = selectedExercises.includes(exercise);
    // If it is selected, remove it from the selectedExercises state
    if (isSelected) {
      setSelectedExercises(
        selectedExercises.filter((selected) => selected !== exercise)
      );
    }
    // If it is not selected, add it to the selectedExercises state
    else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  // Define a function to format the date as a string
  const formatDate = (date) => {
    // Check if the date is today or not
    const isToday =
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear();
    // If it is today, return "Today"
    if (isToday) {
      return "Today";
    }
    // If it is not today, return a formatted string using locale options
    else {
      return date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Define a function to increment or decrement the date by one day
  const changeDate = (delta) => {
    // Create a new date object with the same value as the current date
    const newDate = new Date(date);
    // Add or subtract one day to the new date object
    newDate.setDate(newDate.getDate() + delta);
    // Update the date state with the new date object
    setDate(newDate);
  };

  // Return the JSX elements for the DiaryScene component
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Diary</Text>
        <TouchableOpacity style={styles.hamburgerIcon}>
          {/* Replace this with your own hamburger icon */}
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dateBar}>
        <TouchableOpacity onPress={() => changeDate(-1)}>
          {/* Replace this with your own left arrow icon */}
          <Text style={styles.arrowText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
        <TouchableOpacity onPress={() => changeDate(1)}>
          {/* Replace this with your own right arrow icon */}
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.exerciseBar}>
        <Text style={styles.exerciseText}>Exercise</Text>
      </View>
      {selectedExercises.length > 0 && (
        <TouchableOpacity style={styles.deleteButton} onPress={deleteExercises}>
          <Text style={styles.deleteText}>DELETE EXERCISE</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <ExerciseBox
            item={item}
            onPress={() => handlePress(item)}
            onLongPress={() => handleLongPress(item)}
          />
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={addExercise}>
        <Text style={styles.addText}>ADD EXERCISE</Text>
      </TouchableOpacity>
    </View>
  );
};

// Define the styles for the DiaryScene component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "violetblue",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "azure",
  },
  hamburgerIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  hamburgerText: {
    fontSize: 24,
    color: "azure",
  },
  dateBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "azure",
  },
  arrowText: {
    fontSize: 24,
    color: "azure",
  },
  exerciseBar: {
    paddingVertical: 10,
    paddingLeft: 10,
  },
  exerciseText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "azure",
  },
  exerciseBox: {
    marginHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "white",
  },
  selected: {
    backgroundColor: "red",
  },
  addButton: {
    marginHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  addText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  deleteButton: {
    marginHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

// Export the DiaryScene component
export default DiaryScene;

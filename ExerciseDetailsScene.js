// Inside ExerciseDetail.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { TouchableOpacity } from 'react-native';

export default function ExerciseDetailsScene({ route, navigation }) {
  // Get the item object from the route.params prop
  const { item } = route.params;

  // Initialize state variables for user input and sets
  const [weight, setWeight] = useState("");
  const [restTime, setRestTime] = useState("");
  const [sets, setSets] = useState([]);
  const [currentSet, setCurrentSet] = useState({ reps: "", weight: "" });
  const [currentDropSet, setCurrentDropSet] = useState({
    reps: "",
    weight: "",
  });

  // Initialize state variables for timer and sound
  const [timer, setTimer] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [sound, setSound] = useState(null);

  // Load the sound file for the alarm
  useEffect(() => {
    async function loadSound() {
      const { sound } = await Audio.Sound
        .createAsync
        //require("./assets/alarm.mp3")
        ();
      setSound(sound);
    }
    loadSound();
  }, []);

  // Update the timer every second
  useEffect(() => {
    if (timer) {
      const interval = setInterval(() => {
        setSecondsLeft((seconds) => seconds - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Play the sound when the timer reaches zero
  useEffect(() => {
    if (secondsLeft === 0 && sound) {
      async function playSound() {
        await sound.playAsync();
      }
      playSound();
    }
  }, [secondsLeft, sound]);

  // Save the data in local storage and backend
  async function saveExercise() {
    try {
      // Create an object with the exercise data
      const exerciseData = {
        name: item.name,
        force: item.force,
        primaryMuscle: item.primaryMuscles,
        secondaryMuscle: item.secondaryMuscle,
        weight: weight,
        restTime: restTime,
        sets: sets,
        date: new Date().toISOString(),
      };

      // Save the data in local storage with a unique key
      const key = `exercise_${Date.now()}`;
      await AsyncStorage.setItem(key, JSON.stringify(exerciseData));

      // Navigate back to the previous screen
      navigation.goBack();
    } catch (error) {
      // Handle any errors
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  }

  // Add a new set with the current set input
  function addSet() {
    // Validate the input
    if (!currentSet.reps || !currentSet.weight) {
      Alert.alert("Invalid input", "Please enter reps and weight for the set.");
      return;
    }

    // Add the current set to the sets array
    setSets((sets) => [...sets, currentSet]);

    // Reset the current set input
    setCurrentSet({ reps: "", weight: "" });
  }

  // Add a new drop set with the current drop set input
  function addDropSet() {
    // Validate the input
    if (!currentDropSet.reps || !currentDropSet.weight) {
      Alert.alert(
        "Invalid input",
        "Please enter reps and weight for the drop set."
      );
      return;
    }

    // Add the current drop set to the last set in the sets array
    setSets((sets) => {
      const lastSet = sets[sets.length - 1];
      if (!lastSet.dropSets) {
        lastSet.dropSets = [];
      }
      lastSet.dropSets.push(currentDropSet);
      return [...sets];
    });

    // Reset the current drop set input
    setCurrentDropSet({ reps: "", weight: "" });
  }

  // Start a rest timer with the rest time input
  function startRest() {
    // Validate the input
    if (!restTime) {
      Alert.alert("Invalid input", "Please enter rest time in seconds.");
      return;
    }

    // Set the timer and seconds left state
    setTimer(true);
    setSecondsLeft(parseInt(restTime));
  }

  // Stop the rest timer and sound
  function stopRest() {
    // Clear the timer and seconds left state
    setTimer(false);
    setSecondsLeft(0);

    // Stop the sound if it is playing
    if (sound) {
      sound.stopAsync();
    }
  }

  // Render a set item with its drop sets if any
  function renderSetItem(set, index) {
    return (
      <View key={index} style={styles.setItem}>
        <Text style={styles.setText}>
          Set {index + 1}: {set.reps} reps x {set.weight} lbs
        </Text>
        {set.dropSets &&
          set.dropSets.map((dropSet, i) => (
            <Text key={i} style={styles.dropSetText}>
              Drop set {i + 1}: {dropSet.reps} reps x {dropSet.weight} lbs
            </Text>
          ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Display the item properties */}
      <Text style={styles.title}>{item.name}</Text>
      <TouchableOpacity
        // Add a style prop to customize the appearance of the button
        style={{
          // Make the button a circle with a diameter of 50 pixels
          width: 50,
          height: 50,
          borderRadius: 25,
          // Position the button on the top right of the scene
          position: "absolute",
          top: 10,
          right: 10,
          // Add some padding and background color
          padding: 10,
          backgroundColor: "#fff",
        }}
        // Keep the onPress prop as it is
        onPress={() => {
          saveExercise();
          navigation.navigate("AddExercise");
        }}
      >
        <Text style={{ fontSize: 24, color: "#000" }}>✓</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Force: {item.force}</Text>
      <Text style={styles.subtitle}>Primary Muscle: {item.primaryMuscles}</Text>
      <Text style={styles.subtitle}>
        Secondary Muscle: {item.secondaryMuscles}
      </Text>

      {/* User input for weight and rest time */}
      <View style={styles.inputRow}>
        {/* <Text style={styles.inputLabel}>Weight:</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          placeholder="Enter weight in lbs"
          keyboardType="numeric"
        /> */}
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Rest Time:</Text>
        <TextInput
          style={styles.input}
          value={restTime}
          onChangeText={setRestTime}
          placeholder="Enter rest time in seconds"
          keyboardType="numeric"
        />
      </View>

      {/* Adding sets and drop sets with buttons */}
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Add Set:</Text>
        <TextInput
          style={styles.input}
          value={currentSet.reps}
          onChangeText={(text) =>
            setCurrentSet((set) => ({ ...set, reps: text }))
          }
          placeholder="Enter reps"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={currentSet.weight}
          onChangeText={(text) =>
            setCurrentSet((set) => ({ ...set, weight: text }))
          }
          placeholder="Enter weight"
          keyboardType="numeric"
        />
        <Button title="ADD SET" onPress={addSet} />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Add Drop Set:</Text>
        <TextInput
          style={styles.input}
          value={currentDropSet.reps}
          onChangeText={(text) =>
            setCurrentDropSet((set) => ({ ...set, reps: text }))
          }
          placeholder="Enter reps"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={currentDropSet.weight}
          onChangeText={(text) =>
            setCurrentDropSet((set) => ({ ...set, weight: text }))
          }
          placeholder="Enter weight"
          keyboardType="numeric"
        />
        <Button title="ADD DROP SET" onPress={addDropSet} />
      </View>

      {/* Starting a rest timer with an alarm */}
      <View style={styles.timerRow}>
        {!timer ? (
          <Button title="START REST" onPress={startRest} />
        ) : (
          <>
            <Text style={styles.timerText}>{secondsLeft} seconds left</Text>
            <Button title="STOP REST" onPress={stopRest} color="red" />
          </>
        )}
      </View>

      {/* Saving the exercise with a check mark button */}
      {/* <Button title="✔️" onPress={saveExercise}/> */}
      {/*Converted this into a touchable opacity, and moved the button to the top right of scene,
        next to the item.name text render */}
      {/* <Button
        title="✔️"
        onPress={() => {
          saveExercise();
          navigation.navigate("AddExercise");
        }}
      /> */}

      {/* Display the sets */}
      {sets.length > 0 && (
        <>
          <Text style={styles.title}>Sets:</Text>

          <ScrollView
            vertical
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {sets.map(renderSetItem)}
          </ScrollView>
        </>
      )}
    </View>
  );
}

// Define some styles for the UI elements
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  inputLabel: {
    fontSize: 16,
    width: 100,
  },
  input: {
    flex:1,
    fontSize: 16,
    width: 100,
    borderWidth: 1,
    borderColor: "gray",
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  timerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  setItem: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginVertical: 5,
  },
  setText: {
    fontSize: 18,
  },
  dropSetText: {
    fontSize: 16,
    marginLeft: 20,
  },
});

// Inside ExerciseDetail.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { TouchableOpacity } from "react-native";
import { ExerciseDetailsStyles } from "../styles/exerciseDetailsStyles/ExerciseDetailsStyles";

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
      const { sound } = Audio.Sound.createAsync;
      require("../assets/alarm.mp3")();
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
        name: item.name, // the name of the exercise
        force: item.force, // the force applied by the exercise
        primaryMuscle: item.primaryMuscles, // the primary muscle group targeted by the exercise
        secondaryMuscle: item.secondaryMuscles, // the secondary muscle group targeted by the exercise
        weight: weight, // the weight used for the exercise
        restTime: restTime, // the rest time between sets for the exercise
        sets: sets, // the number of sets performed for the exercise
        date: new Date().toISOString(), // the date and time when the exercise was done
      };

      // Save the data in local storage with a unique key
      const key = `exercise_${Date.now()}`; // create a unique key using the current timestamp
      await AsyncStorage.setItem(key, JSON.stringify(exerciseData)); // store the data as a stringified JSON object using the key

      // Navigate back to the previous screen
      navigation.goBack();
      console.log("exerciseData:", JSON.stringify(exerciseData));
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
      <View key={index} style={ExerciseDetailsStyles.setItem}>
        <Text style={ExerciseDetailsStyles.setText}>
          Set {index + 1}: {set.reps} reps x {set.weight} lbs
        </Text>
        {set.dropSets &&
          set.dropSets.map((dropSet, i) => (
            <Text key={i} style={ExerciseDetailsStyles.dropSetText}>
              Drop set {i + 1}: {dropSet.reps} reps x {dropSet.weight} lbs
            </Text>
          ))}
      </View>
    );
  }

  return (
    <View style={ExerciseDetailsStyles.container}>
      {/* Display the item properties */}
      <Text style={ExerciseDetailsStyles.title}>{item.name}</Text>
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
          /* If you want to navigate directly to diary instead of just going back to 
          add exercise scene, you need to delete the navigate back function in saveExercise()
          and uncomment the line below*/
          //navigation.navigate("Diary");
        }}
      >
        <Text style={{ fontSize: 24, color: "#000" }}>✓</Text>
      </TouchableOpacity>
      <Text style={ExerciseDetailsStyles.subtitle}>Force: {item.force}</Text>
      <Text style={ExerciseDetailsStyles.subtitle}>
        Primary Muscle: {item.primaryMuscles}
      </Text>
      <Text style={ExerciseDetailsStyles.subtitle}>
        Secondary Muscle: {item.secondaryMuscles}
      </Text>

      {/* User input for weight and rest time */}
      <View style={ExerciseDetailsStyles.inputRow}>
      </View>
      <View style={ExerciseDetailsStyles.inputRow}>
        <Text style={ExerciseDetailsStyles.inputLabel}>Rest Time:</Text>
        <TextInput
          style={ExerciseDetailsStyles.input}
          value={restTime}
          onChangeText={setRestTime}
          placeholder="Enter rest time in seconds"
          keyboardType="numeric"
        />
      </View>
      {/* Adding sets and drop sets with buttons */}
      <View style={ExerciseDetailsStyles.inputRow}>
        <Text style={ExerciseDetailsStyles.inputLabel}>Add Set:</Text>
        <TextInput
          style={ExerciseDetailsStyles.input}
          value={currentSet.reps}
          onChangeText={(text) =>
            setCurrentSet((set) => ({ ...set, reps: text }))
          }
          placeholder="Enter reps"
          keyboardType="numeric"
        />
        <TextInput
          style={ExerciseDetailsStyles.input}
          value={currentSet.weight}
          onChangeText={(text) =>
            setCurrentSet((set) => ({ ...set, weight: text }))
          }
          placeholder="Enter weight"
          keyboardType="numeric"
        />
        <Button title="ADD SET" onPress={addSet} />
      </View>
      <View style={ExerciseDetailsStyles.inputRow}>
        <Text style={ExerciseDetailsStyles.inputLabel}>Add Drop Set:</Text>
        <TextInput
          style={ExerciseDetailsStyles.input}
          value={currentDropSet.reps}
          onChangeText={(text) =>
            setCurrentDropSet((set) => ({ ...set, reps: text }))
          }
          placeholder="Enter reps"
          keyboardType="numeric"
        />
        <TextInput
          style={ExerciseDetailsStyles.input}
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
      <View style={ExerciseDetailsStyles.timerRow}>
        {!timer ? (
          <Button title="START REST" onPress={startRest} />
        ) : (
          <>
            <Text style={ExerciseDetailsStyles.timerText}>
              {secondsLeft} seconds left
            </Text>
            <Button title="STOP REST" onPress={stopRest} color="red" />
          </>
        )}
      </View>
      {/* Display the sets */}
      {sets.length > 0 && (
        <>
          <Text style={ExerciseDetailsStyles.title}>Sets:</Text>

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

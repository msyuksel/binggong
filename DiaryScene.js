import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  TextInput,
  Alert,
  StyleSheet,
  FlatList,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { ThemeContext } from "../contexts/ThemeContext.js";
import { useNavigation, useRoute } from "@react-navigation/native"; // import the useNavigation and useRoute hooks
import { DarkStyles } from "../styles/diarySceneStyles/DarkStyles";
import { LightStyles } from "../styles/diarySceneStyles/LightStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExerciseItem } from "../components/addExerciseComponents/ExerciseItem.js";

const filterDuplicates = (data) => {
  const seen = new Set(); // create a set to store seen names
  return data.filter((item) => {
    // filter out any item that has a name already in the set
    if (seen.has(item.name)) {
      return false;
    } else {
      seen.add(item.name); // add the name to the set
      return true;
    }
  });
};

export default function DiaryScene() {
  const navigation = useNavigation();

  // Use the useRoute hook to get the route object
  const route = useRoute();

  // Get the date from the route.params object
  const { date } = route.params;

  // Use nav instead of navigation when referring to the prop
  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => navigation.navigate("AddExercise")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    ),
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Define a state variable to store the exercises array
  const [exercises, setExercises] = useState([]);

  // const fetchExercises = async () => {
  //   try {
  //     // Get all the keys that start with "exercise_"
  //     const keys = await AsyncStorage.getAllKeys();
  //     const exerciseKeys = keys.filter((key) => key.startsWith("exercise_"));

  //     // Get all the values for those keys
  //     const values = await AsyncStorage.multiGet(exerciseKeys);

  //     // Parse the values as JSON objects and store them in the state variable
  //     const exercises = values.map(([key, value]) => JSON.parse(value));
  //     setExercises(exercises);
  //   } catch (error) {
  //     // Handle any errors
  //     console.error(error);
  //     Alert.alert("Error", "Something went wrong. Please try again.");
  //   }
  // };

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

  // useEffect(() => {
  //   fetchExercises();
  // }, []);

  // Get the current date from the route.params prop
  const { date } = route.params;

  // Initialize state variable for exercise data
  const [data, setData] = useState([]);

  // Retrieve data from AsyncStorage whenever the date changes
  useEffect(() => {
    async function getData() {
      try {
        // Get all keys from AsyncStorage
        const keys = await AsyncStorage.getAllKeys();

        // Filter out any key that does not match the current date
        const filteredKeys = keys.filter((key) =>
          key.includes(date.toISOString())
        );

        // Get all values for the filtered keys
        const values = await AsyncStorage.multiGet(filteredKeys);

        // Parse each value as a JSON object and store it in an array
        const parsedValues = values.map((value) => JSON.parse(value[1]));

        // Filter out any duplicate exercises by name
        const filteredValues = filterDuplicates(parsedValues);

        // Set the state variable with the filtered values
        setData(filteredValues);
      } catch (error) {
        // Handle any errors
        console.error(error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
    getData();
  }, [date]);

  return (
    <View style={styles.container}>
    <Text style={styles.date}>{date.toDateString()}</Text>
    {data.length === 0 ? ( // check if there is no data
      <Text style={styles.message}>No exercises added for this day.</Text> // show a placeholder message
    ) : (
      <FlatList // show a FlatList component
        data={data} // pass the data array as a prop
        keyExtractor={(item) => item.name} // use the name as a key
        renderItem={({ item }) => ( // render each item using ExerciseItem component
          <ExerciseItem
            item={item} // pass the item object as a prop
            weight={item.weight} // pass the weight as a prop
            restTime={item.restTime} // pass the rest time as a prop
            sets={item.sets} // pass the sets array as a prop
            dropSets={item.dropSets} // pass the drop sets array as a prop
          />
        )}
      />
    )}
  </View>

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
}

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

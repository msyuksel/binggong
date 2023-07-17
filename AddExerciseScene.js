import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { addExerciseStyles } from "../styles/addExerciseStyles/addExerciseStyles";
import { ExerciseItem } from "../components/addExerciseComponents/ExerciseItem";

// Import the JSON data
import exercises from "../utils/exerciseDatabase/exercises.json";

// The main component for the "Add Exercise" screen
const AddExerciseScene = () => {
  // State variables for the search input and the selected tab
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");

  // A function to render the search bar with the custom exercises button
  const renderSearchBar = () => {
    return (
      <View style={addExerciseStyles.searchContainer}>
        <TextInput
          style={addExerciseStyles.searchInput}
          placeholder="Search for an exercise"
          value={search}
          onChangeText={setSearch}
        />
      </View>
    );
  };

  // A function to render the tabs for filtering the exercises
  const renderTabs = () => {
    return (
      <View style={addExerciseStyles.tabContainer}>
        <TouchableOpacity
          style={[
            addExerciseStyles.tabButton,
            tab === "All" && addExerciseStyles.tabSelected,
          ]}
          onPress={() => setTab("All")}
        >
          <Text
            style={[
              addExerciseStyles.tabText,
              tab === "All" && addExerciseStyles.tabTextSelected,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            addExerciseStyles.tabButton,
            tab === "Previous Exercises" && addExerciseStyles.tabSelected,
          ]}
          onPress={() => setTab("Previous Exercises")}
        >
          <Text
            style={[
              addExerciseStyles.tabText,
              tab === "Previous Exercises" && addExerciseStyles.tabTextSelected,
            ]}
          >
            Previous Exercises
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            addExerciseStyles.tabButton,
            tab === "Custom Exercises" && addExerciseStyles.tabSelected,
          ]}
          onPress={() => setTab("Custom Exercises")}
        >
          <Text
            style={[
              addExerciseStyles.tabText,
              tab === "Custom Exercises" && addExerciseStyles.tabTextSelected,
            ]}
          >
            Custom Exercises
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // A function to render the list of exercises based on the filter function
  const renderList = () => {
    // Render a different header based on the selected tab
    let listHeader = null;
    if (tab === "All") {
      listHeader = (
        <Text style={addExerciseStyles.listHeader}>All Exercises</Text>
      );
    } else if (tab === "Previous Exercises") {
      listHeader = <Text style={addExerciseStyles.listHeader}>History</Text>;
    } else if (tab === "Custom Exercises") {
      listHeader = (
        <Text style={addExerciseStyles.listHeader}>Your Custom Exercises</Text>
      );
    }

    // A function to filter the exercises by the search input and the selected tab
    const filterExercises = () => {
      // Filter the exercises by the search input
      let filteredExercises = exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(search.toLowerCase())
      );

      // Filter the exercises by the selected tab
      if (tab === "All") {
        return filteredExercises;
      } else if (tab === "Previous Exercises") {
        // TODO: Implement logic to get previous exercises from local storage or database
        return [];
      } else if (tab === "Custom Exercises") {
        // TODO: Implement logic to get custom exercises from local storage or database
        return [];
      }
    };

    // Render the flat list of exercises with the header and the item component
    return (
      <FlatList
        data={filterExercises}
        renderItem={({ item }) => (
          console.log(item); // Print the item object for debugging
          <ExerciseItem
            name={item?.name} // Use the optional chaining operator to access the name property safely
            force={item?.force} // Use the optional chaining operator to access the force property safely
            primaryMuscle={[item?.primaryMuscles]} // Use the optional chaining operator to access the primaryMuscles property safely
            secondaryMuscle={[item?.secondaryMuscle]} // Use the optional chaining operator to access the secondaryMuscle property safely
          />
        )}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={listHeader}
      />
    );
  };

  // Return the main view with all the components
  return (
    <View style={addExerciseStyles.container}>
      {renderSearchBar()}
      {renderTabs()}
      {renderList()}
    </View>
  );
};

export default AddExerciseScene;

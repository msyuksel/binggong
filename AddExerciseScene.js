import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addExercistStyles } from "../styles/addExerciseStyles/addExerciseStyles";

// Import the JSON data
import exercises from "../utils/exerciseDatabase/exercises.json";

// A component for rendering each exercise item
const ExerciseItem = ({ item }) => {
  return (
    <TouchableOpacity>
      <View style={addExercistStyles.itemContainer}>
        <Text style={addExercistStyles.itemName}>{item.name}</Text>
        <View
          style={{ flexDirection: "column", margin: 0, alignSelf: "flex-end" }}
        >
          <Text style={addExercistStyles.itemDetails}>Force: {item.force}</Text>
          <Text style={addExercistStyles.itemDetails}>
            Primary Muscle: {item.primaryMuscles}
          </Text>
        </View>
        <TouchableOpacity style={addExercistStyles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// The main component for the "Add Exercise" screen
const AddExerciseScene = () => {
  // State variables for the search input and the selected tab
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");

  // A function to render the search bar with the custom exercises button
  const renderSearchBar = () => {
    return (
      <View style={addExercistStyles.searchContainer}>
        <TextInput
          style={addExercistStyles.searchInput}
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
      <View style={addExercistStyles.tabContainer}>
        <TouchableOpacity
          style={[
            addExercistStyles.tabButton,
            tab === "All" && addExercistStyles.tabSelected,
          ]}
          onPress={() => setTab("All")}
        >
          <Text
            style={[
              addExercistStyles.tabText,
              tab === "All" && addExercistStyles.tabTextSelected,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            addExercistStyles.tabButton,
            tab === "Previous Exercises" && addExercistStyles.tabSelected,
          ]}
          onPress={() => setTab("Previous Exercises")}
        >
          <Text
            style={[
              addExercistStyles.tabText,
              tab === "Previous Exercises" && addExercistStyles.tabTextSelected,
            ]}
          >
            Previous Exercises
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            addExercistStyles.tabButton,
            tab === "Custom Exercises" && addExercistStyles.tabSelected,
          ]}
          onPress={() => setTab("Custom Exercises")}
        >
          <Text
            style={[
              addExercistStyles.tabText,
              tab === "Custom Exercises" && addExercistStyles.tabTextSelected,
            ]}
          >
            Custom Exercises
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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

  // A function to render the list of exercises based on the filter function
  const renderList = () => {
    // Render a different header based on the selected tab
    let listHeader = null;
    if (tab === "All") {
      listHeader = (
        <Text style={addExercistStyles.listHeader}>All Exercises</Text>
      );
    } else if (tab === "Previous Exercises") {
      listHeader = <Text style={addExercistStyles.listHeader}>History</Text>;
    } else if (tab === "Custom Exercises") {
      listHeader = (
        <Text style={addExercistStyles.listHeader}>Your Custom Exercises</Text>
      );
    }

    // Render the flat list of exercises with the header and the item component
    return (
      <FlatList
        data={filterExercises()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ExerciseItem item={item} />}
        ListHeaderComponent={listHeader}
      />
    );
  };

  // Return the main view with all the components
  return (
    <View style={addExercistStyles.container}>
      {renderSearchBar()}
      {renderTabs()}
      {renderList()}
    </View>
  );
};

export default AddExerciseScene;

import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import moment from "moment";
import { useEffect, useState } from "react";
import FeadIn from "./componet/FeadIn";

import {
  Alert,
  Button,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import Footer from "./componet/Footer";
import Spiner from "./componet/Spiner";
import Filter from "./componet/Filter";

export default function App() {
  const [inputVal, setInputVal] = useState("");
  const [todos, setTodos] = useState([]);
  const [id, setId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("todos");
      if (value !== null) {
        let fullData = JSON.parse(value);
        setTodos(fullData);
      }
    } catch (error) {
      // Error retrieving data
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, [inputVal, id, isEdit, isChecked]);

  // Add a new todo in the list
  const handlePress = async () => {
    if (inputVal) {
      if (AsyncStorage.getItem("todos") == null) {
        await AsyncStorage.setItem("todos", "[]");
      }
      const oldData = await AsyncStorage.getItem("todos").then((value) =>
        JSON.parse(value)
      );
      oldData.push({
        id: Math.random(),
        name: inputVal,
        cheked: false,
        timestamp: Date.now(),
      });
      await AsyncStorage.setItem("todos", JSON.stringify(oldData));
      setInputVal("");
    }
  };

  // update todos
  const handleUpdate = async () => {
    const updateTodos = todos.map((t) =>
      t.id === id ? { ...t, name: inputVal } : t
    );
    await AsyncStorage.setItem("todos", JSON.stringify(updateTodos));
    setIsEdit(false);
    setInputVal("");
  };
  // delete todo
  const removeTodo = (id) => {
    let remenignTodo = todos.filter((todo) => todo.id !== id);
    AsyncStorage.setItem("todos", JSON.stringify(remenignTodo));
  };

  // Edit todos
  const handleEdit = (id) => {
    const findTodo = todos.find((t) => t.id === id);
    if (findTodo.cheked)
      return ToastAndroid.showWithGravityAndOffset(
        "Sorry! Can,t Edit this todo",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    setIsEdit(true);
    setInputVal(findTodo.name);
    setId(findTodo.id);
  };

  // cheked toggle
  const handleChecked = async (id) => {
    setIsChecked(!isChecked);
    const updateTodos = todos.map((t) =>
      t.id === id ? { ...t, cheked: isChecked } : t
    );
    await AsyncStorage.setItem("todos", JSON.stringify(updateTodos));
  };

  // filter by completed status
  const filterByCompleted = async () => {
    const value = await AsyncStorage.getItem("todos");
    const todos = JSON.parse(value);
    const filter = todos?.filter((t) => t.cheked === true);
    setTodos(filter);
    setIsDisabled(!isDisabled);
  };

  // filter by Incompleted status
  const filterByInCompleted = async () => {
    const value = await AsyncStorage.getItem("todos");
    const todos = JSON.parse(value);
    const filter = todos?.filter((t) => t.cheked === false);
    setTodos(filter);
    setIsDisabled(!isDisabled);
  };
  // filter by All status
  const filterAll = async () => {
    const value = await AsyncStorage.getItem("todos");
    const todos = JSON.parse(value);
    setTodos(todos);
    setIsDisabled(!isDisabled);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          marginTop: 50,
          flex: 0,
          flexDirection: "row",
          padding: 10,
          textAlign: "center",
          marginLeft: 70,
        }}
      >
        <TextInput
          style={{ width: "50%", borderWidth: 1, padding: 4 }}
          value={inputVal}
          onChangeText={(text) => setInputVal(text)}
          placeholder="Type..."
        />
        <Button
          style={{ width: "50%" }}
          onPress={isEdit ? handleUpdate : handlePress}
          title={isEdit ? "Update" : "Add"}
        />
      </View>
      <Text
        style={{
          textAlign: "center",
          fontSize: 30,
          fontWeight: "bold",
          borderBottomWidth: 2,
        }}
      >
        Todo list
      </Text>
      <Text style={{ fontSize: 25, textAlign: "center" }}>
        Filter by status
      </Text>
      <Filter
        filterByCompleted={filterByCompleted}
        filterByInCompleted={filterByInCompleted}
        filterAll={filterAll}
        disabled={isDisabled}
      />
      <View style={{ height: "65%" }}>
        <ScrollView
          contentContainerStyle={{}}
          style={{
            marginTop: 20,
          }}
        >
          {todos?.length === 0 && (
            <Text
              style={{
                fontSize: 25,
                textAlign: "center",
                color: "tomato",
              }}
            >
              List Are Emety
            </Text>
          )}
          {loading && <Spiner />}
          {todos?.map((t) => (
            <FeadIn>
              <View
                key={t.id}
                style={{
                  backgroundColor: "orange",
                  margin: 4,
                  padding: 5,
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 30,

                      textTransform: "capitalize",
                      textDecorationLine: t.cheked ? "line-through" : "none",
                    }}
                  >
                    {t.name}
                  </Text>
                  <Text style={{ color: "green" }}>
                    {moment(t.timestamp).fromNow()}
                  </Text>
                </View>
                <View style={{ flex: 0, flexDirection: "row" }}>
                  <Pressable
                    onPress={() => {
                      removeTodo(t.id);
                      setId(t.id);
                    }}
                  >
                    <Image
                      style={styles.tinyLogo}
                      source={require("./assets/download.png")}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => handleEdit(t.id)}
                    // pointerEvents={t.cheked ? "none" : "auto"}
                  >
                    <Image
                      style={styles.eidtBtn}
                      source={require("./assets/edit.png")}
                    />
                  </Pressable>
                  <Pressable>
                    {t.cheked ? (
                      <Pressable onPress={() => handleChecked(t.id)}>
                        <Image
                          style={styles.checkboxStyle}
                          source={require("./assets/checkbox-true.png")}
                        />
                      </Pressable>
                    ) : (
                      <Pressable onPress={() => handleChecked(t.id)}>
                        <Image
                          style={styles.checkboxStyle}
                          source={require("./assets/checkbox-false.png")}
                        />
                      </Pressable>
                    )}
                  </Pressable>
                </View>
              </View>
            </FeadIn>
          ))}
        </ScrollView>
      </View>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
  },
  tinyLogo: {
    width: 50,
    height: 50,
    tintColor: "red",
  },
  eidtBtn: {
    width: 32,
    height: 32,
    marginTop: 8,
    tintColor: "green",
  },
  checkboxStyle: {
    // tintColor: "red",
    width: 32,
    marginTop: 9,
    marginLeft: 5,
    height: 32,
    tintColor: "green",
  },
});

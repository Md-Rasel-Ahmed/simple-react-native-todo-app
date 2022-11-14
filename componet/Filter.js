import { Button, StyleSheet, Text, View } from "react-native";

function Filter({ filterByCompleted, filterByInCompleted, filterAll }) {
  return (
    <View style={styles.filerContainer}>
      <Button color="green" onPress={filterByCompleted} title="Completed" />
      <Button color="red" onPress={filterByInCompleted} title="InCompleted" />
      <Button onPress={filterAll} title="All" />
    </View>
  );
}
const styles = StyleSheet.create({
  filerContainer: {
    // flex: 1,

    justifyContent: "center",
    flexDirection: "row",
    marginTop: 5,
  },
});
export default Filter;

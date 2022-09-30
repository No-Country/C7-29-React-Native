import { Text } from "react-native-paper";
import { View } from "react-native";

export default function DetallesCards({ x }) {
  console.log(x);
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Text>{x.title}</Text>
      <Text>{x.description}</Text>
      <Text>{x.photographer.name}</Text>
    </View>
  );
}

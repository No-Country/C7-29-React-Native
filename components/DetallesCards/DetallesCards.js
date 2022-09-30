import { Text } from "react-native-paper";
import { View, Image } from "react-native";

export default function DetallesCards({ x }) {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: x.url }}
        style={{ width: "100%", height: "50%" }}
      ></Image>
      <Text>{x.title}</Text>
      <Text>{x.description}</Text>
      <Text>{x.photographer.name}</Text>
    </View>
  );
}

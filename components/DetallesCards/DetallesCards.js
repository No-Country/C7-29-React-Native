import { Text, Button } from "react-native-paper";
import { View, Image, TouchableHighlight, Share } from "react-native";
import ImageView from "react-native-image-viewing";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function DetallesCards({ x, closeModal }) {
  const [visible, setIsVisible] = useState(false);
  const navigation = useNavigation();

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `https://frontendc7-swtj.vercel.app/details/${x._id}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "black",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableHighlight
        onPress={() => setIsVisible(true)}
        style={{ height: "50%", width: "100%" }}
      >
        <Image
          source={{ uri: x.url }}
          style={{ width: "100%", height: "100%" }}
        />
      </TouchableHighlight>

      <ImageView
        images={[{ uri: x.url }]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
        style={{ width: "50%", height: "50%" }}
      />
      <Text>{x.title}</Text>
      <Text>{x.description}</Text>
      <TouchableHighlight
        onPress={() => {
          navigation.navigate("ProfilebyId", { id: x.photographer._id });
          closeModal(false);
        }}
      >
        <Text>{x.photographer.name}</Text>
      </TouchableHighlight>
      <View style={{ marginTop: 50 }}>
        <Button onPress={onShare}>Share</Button>
      </View>
    </View>
  );
}

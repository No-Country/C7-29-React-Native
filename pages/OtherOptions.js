import { View, Image } from "react-native";
import { Switch, Button, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { switchLang } from "../redux/slices/langSLice";
import { useLanguage } from "../hooks/useLanguage";

export default function OtherOptions({ navigation }) {
  const dispatch = useDispatch();
  const langstring = useSelector((state) => state.lang.lang);
  const { oherOptions } = useLanguage(langstring);
  const { tabScreen } = useLanguage(langstring);

  return (
    <View>
      <Image
        source={require("./../assets/Group.png")}
        style={{ width: 250, height: 100, alignSelf: "center" }}
      ></Image>
      <Button
        title="Home"
        onPress={() => navigation.navigate(tabScreen.home)}
        icon="home-outline"
      >
        {oherOptions.home}
      </Button>
      <Button
        onPress={() => navigation.navigate(tabScreen.upload)}
        icon="cloud-upload-outline"
      >
        {oherOptions.upload}
      </Button>
      <Button
        onPress={() => navigation.navigate(tabScreen.profile)}
        icon="account"
      >
        {oherOptions.profile}
      </Button>
      <Button onPress={() => navigation.navigate(tabScreen.cart)} icon="cart">
        {oherOptions.cart}
      </Button>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={{ alignSelf: "center" }}>{oherOptions.language}</Text>
        <Switch
          value={langstring === "EN"}
          onValueChange={() => dispatch(switchLang())}
        />
      </View>
    </View>
  );
}

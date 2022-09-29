import { View } from "react-native";
import { Switch, Button } from "react-native-paper";
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

      <Switch
        value={langstring === "EN"}
        onValueChange={() => dispatch(switchLang())}
      />
    </View>
  );
}

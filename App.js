import "react-native-gesture-handler";
import TrueApp from "./TrueApp";
//Redux toolkit
import store from "./redux/store/store";
import { Provider } from "react-redux";
//React-Native-Paper
import { Provider as PaperProvider } from "react-native-paper";
//Gestire Handler
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ width: "100%", height: "100%" }}>
        <NavigationContainer>
          <PaperProvider>
            <TrueApp />
          </PaperProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
}

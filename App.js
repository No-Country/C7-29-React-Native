import "react-native-gesture-handler";
import TrueApp from "./TrueApp";
//Redux toolkit
import store from "./redux/store/store";
import { Provider } from "react-redux";

import { Provider as PaperProvider } from "react-native-paper";

import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ width: "100%", height: "100%" }}>
        <PaperProvider>
          <TrueApp />
        </PaperProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

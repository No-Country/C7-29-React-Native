import "react-native-gesture-handler";
import TrueApp from "./TrueApp";
//Redux toolkit
import store from "./redux/store/store";
import { Provider } from "react-redux";

//React Native Paper
import { Provider as PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <TrueApp />
      </PaperProvider>
    </Provider>
  );
}

import "react-native-gesture-handler";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UploadPhoto from "./pages/UploadPhoto";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import OtherOptions from "./pages/OtherOptions";
import MaterialComunityIcons from "react-native-vector-icons/Ionicons";

//Redux toolkit
import store from "./redux/store/store";
import { Provider } from "react-redux";

//React Native Paper

import { Provider as PaperProvider } from "react-native-paper";

export default function App() {
  const Tab = createBottomTabNavigator();
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Tab.Navigator initialRouteName="Home">
            <Tab.Screen
              name="Home"
              component={Home}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialComunityIcons
                    name="home-outline"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Profile"
              component={Profile}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialComunityIcons
                    name="person-outline"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Upload"
              component={UploadPhoto}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialComunityIcons
                    name="cloud-upload-outline"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Other Options"
              component={OtherOptions}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialComunityIcons
                    name="options-outline"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
});

import { Text, Button } from "react-native-paper";
import { View } from "react-native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogIn, LogOut } from "../redux/slices/userSlice";

//Auth0 React expo Auth
import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";
import { openAuthSessionAsync } from "expo-web-browser";
import jwtDecode from "jwt-decode";

//Web Browser para chequear que google se haya authetificado correctamente
import * as WebBrowser from "expo-web-browser";

//Storage local
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../hooks/useLanguage";

export default function Profile() {
  const langstring = useSelector((state) => state.lang.lang);
  const { profile } = useLanguage(langstring);

  const dispatch = useDispatch();
  const auth0ClientId = "0Nbtel2sotjLMt3Wme0Yo2VVMnMMQva8";
  const authorizationEndpoint = "https://dev-i9a-0rdn.us.auth0.com/authorize";
  const useProxy = Platform.select({ web: false, default: true });
  const redirectUri = AuthSession.makeRedirectUri({ useProxy });
  WebBrowser.maybeCompleteAuthSession();

  const user = useSelector((state) => state.user.userData);

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: auth0ClientId,
      // id_token will return a JWT token
      responseType: "id_token",
      // retrieve the user's profile
      scopes: ["openid", "profile", "email"],
      extraParams: {
        // ideally, this will be a random value
        nonce: "nonce",
      },
    },
    { authorizationEndpoint }
  );

  useEffect(() => {
    if (result)
      if (result.error) {
        Alert.alert(
          "Authentication error",
          result.params.error_description || "something went wrong"
        );
      } else if (result.type === "success") {
        const decoded = jwtDecode(result.params.id_token);
        dispatch(LogIn(decoded));
        const jsonValue = JSON.stringify(decoded);
        AsyncStorage.setItem("user", jsonValue);
      }
  }, [result]);

  const logout = async () => {
    dispatch(LogOut());
    let jsonValues = JSON.stringify({});
    AsyncStorage.setItem("user", jsonValues);
    /*Implementar mas tarde el redirecionado url para de verdad desloguear:
    
    
    import React, { useState } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';


export default function App() {
  const [result, setResult] = useState(null);

  const _handlePressButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync('https://expo.dev');
    setResult(result);
  };
  return (
    <View style={styles.container}>
      <Button title="Open WebBrowser" onPress={_handlePressButtonAsync} />
      <Text>{result && JSON.stringify(result)}</Text>
    </View>
  );
}
*/
    //pero con /logout en la url <-- must be set in allowed logout urls
  };
  return (
    <View style={{ height: "100%", width: "100%" }}>
      {user.loged ? (
        <>
          <Text>
            {profile.hi} {user.nickname}
          </Text>
          <Button onPress={logout} mode="contained">
            {profile.logout}
          </Button>
        </>
      ) : (
        <Button onPress={() => promptAsync({ useProxy })} mode="contained">
          {profile.login}
        </Button>
      )}
    </View>
  );
}

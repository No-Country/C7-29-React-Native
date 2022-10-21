import { Button } from "react-native-paper";
import { View, Alert } from "react-native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logInWhitJWT } from "../redux/actions/photosActions";

//Auth0 React expo Auth
import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";
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
  const authorizationEndpoint = "https://darkroom-client.vercel.app/loginMobile";
  const useProxy = Platform.select({ web: false, default: true });
  const redirectUri = AuthSession.makeRedirectUri({ useProxy });
  WebBrowser.maybeCompleteAuthSession();

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      // id_token will return a JWT token
      responseType: "jwt",
      // retrieve the user's profile
      scopes: ["jwt"],
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
        Alert.alert("Authentication error", result.params.error_description || "something went wrong");
      } else if (result.type === "success") {
        const decoded = jwtDecode(result.params.jwt);
        dispatch(logInWhitJWT({ ...decoded, jwt: result.params.jwt }));
        const jsonValue = JSON.stringify({
          ...decoded,
          jwt: result.params.jwt,
        });
        AsyncStorage.setItem("user", jsonValue);
      }
  }, [result]);

  return (
    <View style={{ height: "100%", width: "100%" }}>
      <Button onPress={() => promptAsync({ useProxy })} mode="contained">
        {profile.login}
      </Button>
    </View>
  );
}

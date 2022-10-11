import { useCallback, useEffect } from "react";
import { View, Image, Text, ScrollView } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfileDetails,
  addFollowed,
  addFollowers,
  logInWhitJWT,
} from "../redux/actions/photosActions";
import { cleanProfileDetails } from "../redux/slices/profileSlice";
import HomeCards from "../components/HomeCards/HomeCards";
import { useLanguage } from "../hooks/useLanguage";
import { LogOut } from "../redux/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

export default function ProfilebyId({ route }) {
  const { id } = route.params;
  const dispatch = useDispatch();
  const { profile } = useLanguage();
  const details = useSelector((state) => state.profile.userData);
  const loading = useSelector((state) => state.profile.loading);
  const user = useSelector((state) => state.user.userData);
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      dispatch(getProfileDetails(id));
      return () => {
        dispatch(cleanProfileDetails());
      };
    }, [dispatch, id, isFocused])
  );

  useEffect(() => {
    if (!isFocused) {
      dispatch(cleanProfileDetails());
    }
  }, [isFocused]);

  var a = details.publications ? [...details.publications] : [];

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

  async function handleFollow() {
    if (user.followed.includes(details._id)) {
      let unFollowed = user.followed.filter((x) => x !== details._id);
      let unFollowers = details.followers.filter((x) => x !== user._id);
      await dispatch(addFollowed(unFollowed, user._id));
      await dispatch(addFollowers(unFollowers, details._id));
      dispatch(getProfileDetails(id));

      const vj = await AsyncStorage.getItem("user");
      const v = vj !== null ? JSON.parse(vj) : false;
      if (v) {
        dispatch(logInWhitJWT(v));
      }
    } else {
      await dispatch(addFollowed([...user.followed, details._id], user._id));
      await dispatch(
        addFollowers([...details.followers, user._id], details._id)
      );
      dispatch(getProfileDetails(id));

      const vj = await AsyncStorage.getItem("user");
      const v = vj !== null ? JSON.parse(vj) : false;
      if (v) {
        dispatch(logInWhitJWT(v));
      }
    }
  }

  return (
    <View style={{ width: "100%", height: "100%" }}>
      {!loading ? (
        <View style={{ width: "100%", height: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: details.avatar }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text>
              {details.name} {details.lastName}
            </Text>
          </View>
          <Text>Joined: {details.createdAt}</Text>
          {details.userType === "userPhotographer" ? (
            <View>
              <Text>
                {profile.followers}: {details.followers.length}
              </Text>
              <Text>
                {profile.publications}: {details.publications.length}
              </Text>
              <Text>
                {profile.following}: {details.followed.length}
              </Text>
            </View>
          ) : null}

          {user._id === id ? (
            <Button onPress={logout} mode="contained">
              {profile.logout}
            </Button>
          ) : (
            <Button mode="contained" onPress={() => handleFollow()}>
              {details.followers.includes(user._id)
                ? profile.unfollow
                : profile.follow}
            </Button>
          )}

          <ScrollView
            style={{
              height: "95%",
              width: "100%",
              alignContent: "center",
            }}
          >
            {a.length > 0
              ? a.map((x, indice) => {
                  return (
                    <HomeCards
                      x={{
                        ...x,
                        photographer: {
                          _id: details._id,
                          avatar: details.avatar,
                          name: details.name,
                          lastName: details.lastName,
                        },
                      }}
                      key={x._id}
                      indice={indice}
                    />
                  );
                })
              : null}
          </ScrollView>
        </View>
      ) : (
        <View>
          <ActivityIndicator animating={true} size="large"></ActivityIndicator>
        </View>
      )}
    </View>
  );
}

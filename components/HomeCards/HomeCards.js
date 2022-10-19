import { IconButton } from "react-native-paper";
import { View, ImageBackground, TouchableHighlight } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, cleanItem } from "../../redux/slices/cartSlice";
import { addSnack } from "../../redux/slices/snackBarSlice";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as ImagePicker from "expo-image-picker";
import RotateModal from "../../components/RotateModal/RotateModal";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";

export default function Home({ x, indice, galery }) {
  const langstring = useSelector((state) => state.lang.lang);
  const { home } = useLanguage(langstring);

  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartItems);

  //Notificaciones
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: home.homeCards.notificacion.title,
        body: home.homeCards.notificacion.body[0] + " " + x.title + x._id[0] + x._id[x._id.length - 1] + home.homeCards.notificacion.body[1],
        data: {
          data: "Image its an id.jpg in the downloads file of your device",
        },
      },
      trigger: null,
    });
  }

  //Download photo code

  const [statusFiles, requestPermissionFiles] = ImagePicker.useMediaLibraryPermissions();

  async function downloadPhoto(url) {
    const checkPermisions = await ImagePicker.getCameraPermissionsAsync();
    if (checkPermisions.granted) {
      FileSystem.downloadAsync(url, FileSystem.documentDirectory + x._id + ".jpg")
        .then(async ({ uri }) => {
          const asset = await MediaLibrary.createAssetAsync(uri);
          await MediaLibrary.createAlbumAsync("Download", asset, false);
        })
        .then(async () => await schedulePushNotification())
        .catch((error) => {
          console.error(error);
        });
    } else {
      await requestPermissionFiles();
      FileSystem.downloadAsync(url, FileSystem.documentDirectory + x._id + ".jpg")
        .then(async ({ uri }) => {
          const asset = await MediaLibrary.createAssetAsync(uri);
          await MediaLibrary.createAlbumAsync("Download", asset, false);
        })
        .then(async () => await schedulePushNotification())
        .catch((error) => {
          console.error(error);
        });
    }
  }

  function handleAddCart() {
    dispatch(addItemToCart(x));
    dispatch(
      addSnack({
        visibility: true,
        action: x._id,
        message: x.title + " " + home.homeCards.handleAddCart,
        inCart: true,
      })
    );
  }

  function handleRemoveCart() {
    dispatch(cleanItem(x._id));
    dispatch(
      addSnack({
        visibility: true,
        action: x,
        message: x.title + " " + home.homeCards.handleRemoveCart,
        inCart: false,
      })
    );
  }

  return (
    <TouchableHighlight onPress={() => setModalVisible(true)}>
      <ImageBackground
        source={{ uri: x.url }}
        style={{
          width: "100%",
          height: 400,
        }}
      >
        <View style={{ position: "absolute", right: 0, bottom: 0 }}>
          {x.pay ? (
            cart.filter((p) => p._id === x._id).length > 0 ? (
              <IconButton mode="contained" selected icon="cart-arrow-up" onPress={() => handleRemoveCart()} />
            ) : (
              <IconButton mode="contained" icon="cart-arrow-down" onPress={() => handleAddCart()} />
            )
          ) : (
            <IconButton mode="contained" onPress={async () => await downloadPhoto(x.url)} icon="download" />
          )}
        </View>
        <RotateModal modalVisible={modalVisible} setModalVisible={setModalVisible} indice={indice} galery={galery} />
      </ImageBackground>
    </TouchableHighlight>
  );

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }
    return token;
  }
}

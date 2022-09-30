import { Card, Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { deletePhoto } from "../../redux/actions/photosActions";
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

export default function Home({ x }) {
  const langstring = useSelector((state) => state.lang.lang);
  const { home } = useLanguage(langstring);

  const [modalVisible, setModalVisible] = useState(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    width: "90%",
    height: "80%",
    alignSelf: "center",
  };

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
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: home.homeCards.notificacion.title,
        body:
          home.homeCards.notificacion.body[0] +
          " " +
          x.title +
          x._id[0] +
          x._id[x._id.length - 1] +
          home.homeCards.notificacion.body[1],
        data: {
          data: "Image its an id.jpg in the downloads file of your device",
        },
      },
      trigger: null,
    });
  }

  //Download photo code

  const [statusFiles, requestPermissionFiles] =
    ImagePicker.useMediaLibraryPermissions();

  async function downloadPhoto(url) {
    const checkPermisions = await ImagePicker.getCameraPermissionsAsync();
    if (checkPermisions.granted) {
      FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + x._id + ".jpg"
      )
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
      FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + x._id + ".jpg"
      )
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
    <Card
      elevation={5}
      style={{
        width: "80%",
        alignSelf: "center",
        margin: "5%",
        alignContent: "center",
        alignItems: "center",
      }}
      onPress={() => setModalVisible(true)}
    >
      <Card.Title
        title={x.title}
        subtitle={x.pay ? x.price + "$" : home.homeCards.free}
      />

      <Card.Cover source={{ uri: x.url }} style={{ width: 200, height: 200 }} />

      {x.pay ? (
        cart.filter((p) => p._id === x._id).length > 0 ? (
          <Button
            mode="contained"
            icon="cart-arrow-up"
            onPress={() => handleRemoveCart()}
          >
            {home.homeCards.btnRemoveCart}
          </Button>
        ) : (
          <Button
            mode="contained"
            icon="cart-arrow-down"
            onPress={() => handleAddCart()}
          >
            {home.homeCards.btnAddCart}
          </Button>
        )
      ) : (
        <Button
          mode="contained"
          onPress={async () => await downloadPhoto(x.url)}
          icon="download"
        >
          {home.homeCards.download}
        </Button>
      )}
      <Button
        mode="contained"
        icon="trash-can-outline"
        onPress={() => dispatch(deletePhoto(x._id))}
      >
        {home.homeCards.delete}
      </Button>

      <RotateModal
        modalVisible={modalVisible}
        det={x}
        setModalVisible={setModalVisible}
        containerStyle={containerStyle}
      />
    </Card>
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
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
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

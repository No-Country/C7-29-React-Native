import { Card, Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { deletePhoto } from "../../redux/actions/photosActions";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as ImagePicker from "expo-image-picker";

import { useEffect, useRef, useState } from "react";

export default function Home({ x }) {
  const dispatch = useDispatch();

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
        title: "Image Correctly Downloaded",
        body: `You cant find ${x.id}.jpg in Pictures/Downloads file`,
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
    >
      <Card.Title title={x.title} subtitle={x.pay ? x.price + "$" : "Free"} />

      <Card.Cover source={{ uri: x.url }} style={{ width: 200, height: 200 }} />
      <Button mode="contained" onPress={() => dispatch(deletePhoto(x._id))}>
        Delete
      </Button>
      <Button mode="contained" onPress={async () => await downloadPhoto(x.url)}>
        Download
      </Button>
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

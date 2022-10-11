import {
  Text,
  Button,
  IconButton,
  Portal,
  Paragraph,
  Dialog,
} from "react-native-paper";
import { View, Image, TouchableHighlight, Share } from "react-native";
import ImageView from "react-native-image-viewing";
import { useState, useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, cleanItem } from "../../redux/slices/cartSlice";
import { addSnack } from "../../redux/slices/snackBarSlice";
import { useLanguage } from "../../hooks/useLanguage";
import {
  deletePhoto,
  getAllPhotosData,
} from "../../redux/actions/photosActions";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export default function DetallesCards({ x, closeModal }) {
  const [visible, setIsVisible] = useState(false);
  const navigation = useNavigation();
  const cart = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const { home, details } = useLanguage();
  const user = useSelector((state) => state.user.userData);
  const [visible2, setVisible2] = useState(false);
  const hideDialog = () => setVisible(false);
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `https://frontendc7-swtj.vercel.app/details/${x._id}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

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

  return (
    <View
      style={{
        backgroundColor: "black",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 25 }}>{x.title}</Text>
      <TouchableHighlight
        onPress={() => setIsVisible(true)}
        style={{ height: "50%", width: "100%" }}
      >
        <Image
          source={{ uri: x.url }}
          style={{ width: "100%", height: "100%" }}
        />
      </TouchableHighlight>

      <ImageView
        images={[{ uri: x.url }]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
        style={{ width: "50%", height: "50%" }}
      />
      <TouchableHighlight
        onPress={() => {
          navigation.navigate("ProfilebyId", { id: x.photographer._id });
          closeModal(false);
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: x.photographer.avatar }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              overflow: "hidden",
            }}
          />
          <Text>{x.photographer.name + " " + x.photographer.lastName}</Text>
        </View>
      </TouchableHighlight>
      <Text>{x.description}</Text>
      <Button icon="crosshairs-gps" mode="text">
        {x.ubication}
      </Button>
      <ScrollView horizontal={true}>
        {x.tags.split(/\s*[,/]\s*/).map((x, i) => (
          <Text key={i}>{" " + x}</Text>
        ))}
      </ScrollView>

      <View style={{ flexDirection: "row" }}>
        <Button onPress={onShare}>Share</Button>
        {x.pay ? (
          cart.filter((p) => p._id === x._id).length > 0 ? (
            <IconButton
              mode="contained"
              icon="cart-arrow-up"
              onPress={() => handleRemoveCart()}
            />
          ) : (
            <IconButton
              mode="contained"
              icon="cart-arrow-down"
              onPress={() => handleAddCart()}
            />
          )
        ) : (
          <IconButton
            mode="contained"
            onPress={async () => await downloadPhoto(x.url)}
            icon="download"
          />
        )}
        {user._id === x.photographer._id ? (
          <IconButton
            mode="contained"
            icon="trash-can"
            onPress={() => setVisible2(true)}
          />
        ) : null}
      </View>

      <Portal>
        <Dialog visible={visible2} onDismiss={hideDialog}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title>{details.alerttitle}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{details.alertDescritpion}</Paragraph>
            <Button
              icon="trash-can"
              mode="contained"
              onPress={() => {
                setVisible2(false);
                dispatch(deletePhoto(x._id));
                dispatch(getAllPhotosData());
              }}
            >
              {details.alertOk}
            </Button>
            <Button
              mode="contained"
              icon="cancel"
              onPress={() => {
                setVisible2(false);
              }}
            >
              {details.alertNotOk}
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
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

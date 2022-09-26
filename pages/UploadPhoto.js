import { useState } from "react";
import {
  uploadPhotoForm,
  uploadPhotoToCloudinary,
} from "../redux/actions/photosActions";
import { Button, TextInput } from "react-native-paper";
import { Image, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Publish() {
  const [formData, setFormData] = useState({
    title: { value: null },
    description: { value: null },
    image: { value: null, loading: false },
    price: { paga: false, price: null },
    error: null,
  });

  const [statusCamera, requestPermissionCamera] =
    ImagePicker.useCameraPermissions();
  const [statusFiles, requestPermissionFiles] =
    ImagePicker.useMediaLibraryPermissions();

  function publishButton() {
    if (
      formData.title.value !== null &&
      formData.description.value &&
      formData.image.value &&
      (formData.price.price || !formData.price.paga)
    ) {
      return (
        <Button mode="contained" onPress={() => handleSubmit()}>
          Subir Publicacion
        </Button>
      );
    } else
      return (
        <Button mode="contained" disabled={true}>
          Subir Publicacion
        </Button>
      );
  }

  async function handleSubmit() {
    const a = uploadPhotoForm(formData);
    const d = await a();
    console.log(d);
    if (d.message === "Publicacion creada correctamente") {
      setFormData({
        title: { value: null },
        description: { value: null },
        image: { value: null, loading: false },
        price: { paga: false, price: null },
      });
    } else {
      setFormData({
        ...formData,
        error: d,
      });
    }
  }

  function handleTitle(e) {
    setFormData({ ...formData, title: { value: e } });
  }
  function handleDescription(e) {
    setFormData({ ...formData, description: { value: e } });
  }
  function handlePrice(e) {
    setFormData({
      ...formData,
      price: { ...formData.price, price: e },
    });
  }

  async function handleTakePhoto() {
    const checkPermisions = await ImagePicker.getCameraPermissionsAsync();
    if (checkPermisions.granted) {
      const photo = await ImagePicker.launchCameraAsync();
      setFormData({ ...formData, image: { loading: true, value: null } });
      const response = uploadPhotoToCloudinary(photo.uri);
      const d = await response();
      setFormData({ ...formData, image: { loading: false, value: d } });
    } else {
      await requestPermissionCamera();
      ImagePicker.launchCameraAsync();
    }
  }

  async function handleTakeFile() {
    const checkPermisions =
      await ImagePicker.requestMediaLibraryPermissionsAsync(false);
    if (checkPermisions.granted) {
      const photo = await ImagePicker.launchImageLibraryAsync();
      setFormData({ ...formData, image: { loading: true, value: null } });
      const response = uploadPhotoToCloudinary(photo.uri);
      const d = await response();
      setFormData({ ...formData, image: { loading: false, value: d } });
    } else {
      await requestPermissionFiles();
      ImagePicker.launchImageLibraryAsync();
    }
  }

  return (
    <View>
      <TextInput
        id="formulario_title"
        placeholder="Title..."
        onChangeText={(e) => handleTitle(e)}
        value={formData.title.value || ""}
      ></TextInput>
      <TextInput
        id="formulario_title"
        placeholder="Descripcion..."
        onChangeText={(e) => handleDescription(e)}
        value={formData.description.value || ""}
      ></TextInput>

      <View style={{ flexDirection: "row" }}>
        <Button mode="contained" onPress={() => handleTakePhoto()}>
          Take Photo
        </Button>
        <Button mode="contained" onPress={() => handleTakeFile()}>
          Upload Photo
        </Button>
      </View>
      <Image
        alt="estado"
        source={{
          uri: formData.image.loading
            ? "https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921"
            : formData.image.value
            ? formData.image.value
            : "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6",
        }}
        style={{ width: 200, height: 200 }}
      ></Image>
      <Button
        mode="contained"
        onPress={() =>
          setFormData({
            ...formData,
            price: { ...formData.price, paga: !formData.price.paga },
          })
        }
      >
        {formData.price.paga ? "Paga" : "Gratis"}
      </Button>
      {formData.price.paga ? (
        <TextInput
          placeholder="Price"
          type="number"
          onChangeText={(e) => handlePrice(e)}
          value={formData.price.price || ""}
        ></TextInput>
      ) : null}

      {publishButton()}
    </View>
  );
}

/*
<input
        id="formulario_uploadPhoto"
        type="file"
        onChange={(e) => handleImage(e)}
      ></input>
      */

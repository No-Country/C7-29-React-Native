import { useEffect, useState } from "react";
import { uploadPhotoForm, uploadPhotoToCloudinary, getAllChallenges } from "../redux/actions/photosActions";
import { Button, TextInput, HelperText } from "react-native-paper";
import { Image, ScrollView, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLanguage } from "../hooks/useLanguage";
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";

export default function Publish() {
  const dispatch = useDispatch();
  const langstring = useSelector((state) => state.lang.lang);
  const { publication } = useLanguage(langstring);
  const user = useSelector((state) => state.user.userData);
  const [selectedReto, setSelectedReto] = useState(false);
  const challenges = useSelector((state) => state.challenge.allChalenges.currents);

  const [formData, setFormData] = useState({
    title: { value: null },
    description: { value: null },
    image: { value: null, loading: false },
    price: { paga: false, price: null },
    ubication: { value: null },
    tags: { value: null },
    error: null,
    uploading: false,
  });

  useEffect(() => {
    dispatch(getAllChallenges());
  }, [dispatch]);

  const [statusCamera, requestPermissionCamera] = ImagePicker.useCameraPermissions();
  const [statusFiles, requestPermissionFiles] = ImagePicker.useMediaLibraryPermissions();

  function publishButton() {
    if (formData.title.value && formData.description.value && formData.tags.value && formData.ubication.value && formData.image.value && (formData.price.price || !formData.price.paga) && !formData.uploading) {
      return (
        <Button mode="contained" onPress={() => handleSubmit()}>
          {publication.btn}
        </Button>
      );
    } else
      return (
        <Button mode="contained" disabled={true}>
          {publication.btn}
        </Button>
      );
  }

  async function handleSubmit() {
    setFormData({ ...formData, uploading: true });
    const a = uploadPhotoForm({ ...formData, _id: user._id, challenge: selectedReto });
    const d = await a();
    if (d.message === "Publicacion creada correctamente") {
      setFormData({
        title: { value: null },
        description: { value: null },
        image: { value: null, loading: false },
        price: { paga: false, price: null },
        ubication: { value: null },
        tags: { value: null },
        uploading: false,
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
    await requestPermissionCamera();
    if (checkPermisions.granted) {
      setFormData({ ...formData, image: { loading: true, value: null } });
      const photo = await ImagePicker.launchCameraAsync();
      const response = uploadPhotoToCloudinary(photo.uri);
      const d = await response();
      setFormData({ ...formData, image: { loading: false, value: d } });
    }
  }

  async function handleTakeFile() {
    const checkPermisions = await ImagePicker.requestMediaLibraryPermissionsAsync(false);
    await requestPermissionFiles();
    if (checkPermisions.granted) {
      const photo = await ImagePicker.launchImageLibraryAsync();
      setFormData({ ...formData, image: { loading: true, value: null } });
      const response = uploadPhotoToCloudinary(photo.uri);
      const d = await response();
      setFormData({ ...formData, image: { loading: false, value: d } });
    }
  }

  function handleUbication(e) {
    setFormData({ ...formData, ubication: { value: e } });
  }
  function handleTags(e) {
    setFormData({ ...formData, tags: { value: e } });
  }

  return (
    <ScrollView
      style={{
        alignContent: "center",
        alignContent: "center",
        height: "100%",
      }}
    >
      <TextInput id="formulario_title" placeholder={publication.title_placeholder} onChangeText={(e) => handleTitle(e)} value={formData.title.value || ""}></TextInput>
      <TextInput id="formulario_description" placeholder={publication.descrip_placehodler} onChangeText={(e) => handleDescription(e)} value={formData.description.value || ""}></TextInput>
      <TextInput id="formulario_ubicacion" placeholder={publication.ubication} onChangeText={(e) => handleUbication(e)} value={formData.ubication.value || ""}></TextInput>
      <TextInput id="formulario_tags" placeholder={publication.tags} onChangeText={(e) => handleTags(e)} value={formData.tags.value || ""}></TextInput>
      <Picker selectedValue={selectedReto} onValueChange={(itemValue) => setSelectedReto(itemValue)}>
        <Picker.Item label={publication.reto} value={false} />
        {challenges.map((x) => (
          <Picker.Item label={x.title} value={x._id} key={x._id} />
        ))}
      </Picker>

      <View style={{ flexDirection: "row" }}>
        <Button mode="contained" icon="camera" onPress={() => handleTakePhoto()}>
          {publication.take_photo}
        </Button>
        <Button mode="contained" icon="file" onPress={() => handleTakeFile()}>
          {publication.upload_file}
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
        style={{ width: "100%", height: 250, alignSelf: "center" }}
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
        {formData.price.paga ? publication.pay[0] : publication.pay[1]}
      </Button>
      {formData.price.paga ? (
        <>
          <TextInput placeholder={publication.price} type="number" onChangeText={(e) => handlePrice(e)} value={formData.price.price || ""}></TextInput>
          <HelperText type="error" visible={isNaN(formData.price.price) || parseInt(formData.price.price) < 0}>
            {publication.price_error}
          </HelperText>
        </>
      ) : null}
      {publishButton()}
    </ScrollView>
  );
}

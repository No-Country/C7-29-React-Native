import { ScrollView, View, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { getAllPhotosData } from "../redux/actions/photosActions";
import { useDispatch, useSelector } from "react-redux";
import HomeCards from "../components/HomeCards/HomeCards";
import FilterCards from "../components/FilterCards/FilterCards";
import { Button, Menu, Text, ActivityIndicator } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { Snackbar } from "react-native-paper";
import { cleanSnack } from "../redux/slices/snackBarSlice";
import { cleanItem, addItemToCart } from "../redux/slices/cartSlice";
import { useLanguage } from "../hooks/useLanguage";
import FABCart from "../components/FABCart/FABCart";

export default function Home({ navigation }) {
  const { home } = useLanguage();
  const dispatch = useDispatch();
  const focus = useIsFocused();

  const photos = useSelector((state) => state.photos.filterPhotosData);
  const snack = useSelector((state) => state.snackBar.snackHome);

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function f() {
      setRefresh(true);
      await dispatch(getAllPhotosData());
      setRefresh(false);
    }
    f();
  }, [focus]);

  async function handleRefresh() {
    setLoading(true);
    setRefresh(true);
    await dispatch(getAllPhotosData());
    setLoading(false);
    setRefresh(false);
  }

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  return (
    <View style={{ height: "100%", width: "100%" }}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Text>
              {photos.length} {home.results}
            </Text>
            <Button mode="contained" onPress={() => setVisible(true)}>
              {home.filteroder}
            </Button>
          </View>
        }
      >
        <Menu.Item onPress={() => {}} title={home.filterorder_btn} />
        <FilterCards />
      </Menu>

      <ScrollView
        style={{
          height: "95%",
          width: "100%",
          alignContent: "center",
        }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => handleRefresh()} />}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            handleRefresh();
          }
        }}
      >
        {photos.length > 0 ? photos.map((x, indice) => <HomeCards x={x} key={x._id} indice={indice} />) : null}
        <ActivityIndicator animating={loading || refresh} />
      </ScrollView>
      <FABCart navigation={navigation} />

      <Snackbar
        visible={snack.visibility}
        onDismiss={() => {
          dispatch(cleanSnack());
        }}
        action={{
          label: home.undo,
          onPress: () => {
            snack.inCart ? dispatch(cleanItem(snack.action)) : dispatch(addItemToCart(snack.action));
          },
        }}
        duration={3000}
      >
        {snack.message}
      </Snackbar>
    </View>
  );
}

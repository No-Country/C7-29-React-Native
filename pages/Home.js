import { ScrollView, View, RefreshControl, StyleSheet } from "react-native";
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
import { FAB, Badge } from "react-native-paper";

//gesture test
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export default function Home({ navigation }) {
  const langstring = useSelector((state) => state.lang.lang);
  const cart = useSelector((state) => state.cart.cartItems);
  const { home } = useLanguage(langstring);
  const { tabScreen } = useLanguage(langstring);
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

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  //gestures

  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
    };
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      "worklet";
      isPressed.value = true;
    })
    .onChange((e) => {
      "worklet";
      offset.value = {
        x: e.changeX + offset.value.x,
        y: e.changeY + offset.value.y,
      };
    })
    .onFinalize(() => {
      "worklet";
      isPressed.value = false;
    });

  return (
    <View style={{ height: "100%", width: "100%", backgroundColor: "white" }}>
      <GestureHandlerRootView>
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
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => handleRefresh()}
            />
          }
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              handleRefresh();
            }
          }}
        >
          {photos.length > 0
            ? photos.map((x) => <HomeCards x={x} key={x._id} />)
            : null}
          <ActivityIndicator animating={loading || refresh} />
        </ScrollView>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.fab, animatedStyles]}>
            <FAB
              icon="cart"
              onPress={() => navigation.navigate(tabScreen.cart)}
            />
            <Badge style={{ position: "absolute" }}>{cart.length}</Badge>
          </Animated.View>
        </GestureDetector>

        <Snackbar
          visible={snack.visibility}
          onDismiss={() => {
            dispatch(cleanSnack());
          }}
          action={{
            label: home.undo,
            onPress: () => {
              snack.inCart
                ? dispatch(cleanItem(snack.action))
                : dispatch(addItemToCart(snack.action));
            },
          }}
          duration={3000}
        >
          {snack.message}
        </Snackbar>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 50,
  },
});

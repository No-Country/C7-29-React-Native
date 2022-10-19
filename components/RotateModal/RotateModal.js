import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
  runOnJS,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import DetallesCards from "../DetallesCards/DetallesCards";
import { Modal, Portal } from "react-native-paper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";

export default function RotateModal({
  modalVisible,
  setModalVisible,
  indice,
  galery = null,
}) {
  const route = useRoute();
  const x = useSharedValue(0);
  const photos =
    galery === "galery"
      ? useSelector((state) => state.profile.userData.publications)
      : galery === "liked"
      ? useSelector((state) => state.profile.userData.liked)
      : galery === "saved"
      ? useSelector((state) => state.profile.userData.favorites)
      : useSelector((state) => state.photos.filterPhotosData);
  const photographer = useSelector((state) => state.profile.userData);
  const [detailsOf, setDetailsOf] = useState(indice);
  var test = photos.length - 1;

  useEffect(() => {
    setDetailsOf(indice);
  }, [indice, modalVisible]);

  const gesture = useAnimatedGestureHandler({
    onStart: (_, ctx) => {},
    onActive: (event, ctx) => {
      x.value = event.translationX;
    },
    onEnd: (_) => {
      x.value = withSpring(0);
      if (x.value < -100) {
        if (detailsOf > 0) {
          runOnJS(setDetailsOf)(detailsOf - 1);
        } else {
          runOnJS(setDetailsOf)(test);
        }
      } else if (x.value > 100) {
        runOnJS(setDetailsOf)(detailsOf < test ? detailsOf + 1 : 0);
      }
    },
  });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: x.value },
        {
          rotate:
            x.value < 40 && x.value >= 0
              ? x.value + "deg"
              : x.value <= 0
              ? x.value > -40
                ? x.value + "deg"
                : -40 + "deg"
              : 40 + "deg",
        },
      ],
    };
  });

  const containerStyle = {
    backgroundColor: "transparent",
    padding: 20,
    width: "90%",
    height: "80%",
    alignSelf: "center",
  };

  return (
    <Portal>
      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={containerStyle}
        style={{ height: "100%", width: "100%" }}
      >
        <PanGestureHandler onGestureEvent={gesture}>
          <Animated.View style={[styles.ball, animatedStyles]}>
            <DetallesCards
              x={
                route.name === "ProfilebyId" ||
                route.name === "Profile" ||
                route.name === "Perfil"
                  ? { ...photos[detailsOf], photographer }
                  : photos[detailsOf]
              }
              closeModal={setModalVisible}
            />
          </Animated.View>
        </PanGestureHandler>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  ball: {
    //backgroundColor: "red",
    width: "100%",
    height: "100%",
  },
});

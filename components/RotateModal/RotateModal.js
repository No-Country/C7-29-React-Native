import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import DetallesCards from "../DetallesCards/DetallesCards";
import { Modal, Portal } from "react-native-paper";

export default function RotateModal({
  modalVisible,
  det,
  setModalVisible,
  containerStyle,
}) {
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0 });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        {
          rotate:
            offset.value.x < 40 && offset.value.x >= 0
              ? offset.value.x + "deg"
              : offset.value.x <= 0
              ? offset.value.x > -40
                ? offset.value.x + "deg"
                : -40 + "deg"
              : 40 + "deg",
        },
      ],
      //backgroundColor: isPressed.value ? "yellow" : "blue",
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
      };
    })
    .onFinalize(() => {
      "worklet";
      isPressed.value = false;
      if (offset.value.x < -100) {
      } else if (offset.value.x > 100) {
      } else {
        offset.value = {
          x: 0,
        };
      }
    });

  return (
    <Portal>
      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={containerStyle}
        style={{ height: "100%", width: "100%" }}
      >
        <GestureHandlerRootView style={{ height: "100%", width: "100%" }}>
          <GestureDetector
            style={{ height: "100%", width: "100%" }}
            gesture={gesture}
          >
            <Animated.View style={[styles.ball, animatedStyles]}>
              <DetallesCards x={det} />
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>
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

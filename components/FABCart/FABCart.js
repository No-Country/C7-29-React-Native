import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { FAB, Badge } from "react-native-paper";
import { useLanguage } from "../../hooks/useLanguage";
import { useSelector } from "react-redux";
import { StyleSheet } from "react-native";

export default function FABCart({ navigation }) {
  const cart = useSelector((state) => state.cart.cartItems);
  const { tabScreen } = useLanguage();
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
        x:
          e.changeX + offset.value.x > 9
            ? 9
            : e.changeX + offset.value.x < -315
            ? -315
            : e.changeX + offset.value.x,
        y:
          e.changeY + offset.value.y > 60
            ? 60
            : e.changeY + offset.value.y < -541
            ? -541
            : e.changeY + offset.value.y,
      };
    })
    .onFinalize((e) => {
      "worklet";
      isPressed.value = false;
    });
  return cart.length > 0 ? (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.fab, animatedStyles]}>
        <FAB icon="cart" onPress={() => navigation.navigate(tabScreen.cart)} />
        <Badge style={{ position: "absolute" }}>{cart.length}</Badge>
      </Animated.View>
    </GestureDetector>
  ) : null;
}
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 50,
  },
});

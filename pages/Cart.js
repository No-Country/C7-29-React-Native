import { ScrollView, View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../hooks/useLanguage";
import CartCards from "../components/CartCards/CartCards";
import {
  Snackbar,
  Text,
  FAB,
  Dialog,
  Portal,
  Paragraph,
  Button,
} from "react-native-paper";
import { cleanSnack } from "../redux/slices/snackBarSlice";
import { useState } from "react";
import { cleanCart, cleanItem, addItemToCart } from "../redux/slices/cartSlice";

export default function FilterCards() {
  const cart = useSelector((state) => state.cart.cartItems);
  const langstring = useSelector((state) => state.lang.lang);
  const { cartlang } = useLanguage(langstring);
  const { home } = useLanguage(langstring);
  const dispatch = useDispatch();
  const snack = useSelector((state) => state.snackBar.snackHome);
  const [visible, setVisible] = useState(false);
  const hideDialog = () => setVisible(false);

  return (
    <View>
      <FAB icon="trash-can" onPress={() => setVisible(true)} />
      <ScrollView
        style={{
          height: "95%",
          width: "100%",
          alignContent: "center",
        }}
      >
        {cart.length > 0 ? (
          cart.map((x) => <CartCards x={x} key={x._id} />)
        ) : (
          <Text>{cartlang.empty}</Text>
        )}
      </ScrollView>
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
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={styles.title}>
            {cartlang.alert.title}
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph>{cartlang.alert.text}</Paragraph>
            <Button
              icon="trash-can"
              mode="contained"
              onPress={() => {
                dispatch(cleanCart());
                setVisible(false);
              }}
            >
              {cartlang.alert.btnOK}
            </Button>
            <Button
              mode="contained"
              icon="cancel"
              onPress={() => {
                setVisible(false);
              }}
            >
              {cartlang.alert.btnNo}
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    top: 10,
  },
});

import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../../hooks/useLanguage";
import { Card, Button, Modal } from "react-native-paper";
import { cleanItem } from "../../redux/slices/cartSlice";
import { addSnack } from "../../redux/slices/snackBarSlice";
import { StyleSheet } from "react-native";

export default function CartCards({ x }) {
  const langstring = useSelector((state) => state.lang.lang);
  const { home } = useLanguage(langstring);
  const dispatch = useDispatch();
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
      <Card.Title title={x.title} subtitle={x.price + "$"} />

      <Card.Cover source={{ uri: x.url }} style={{ width: 200, height: 200 }} />

      <Button mode="contained" onPress={() => handleRemoveCart()}>
        {home.homeCards.btnRemoveCart}
      </Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
  },
});

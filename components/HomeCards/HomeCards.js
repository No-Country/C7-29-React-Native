import { Card } from "react-native-paper";

export default function Home({ x }) {
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
      <Card.Title title={x.title} subtitle={x.pay ? x.price + "$" : "Free"} />

      <Card.Cover source={{ uri: x.url }} style={{ width: 200, height: 200 }} />
    </Card>
  );
}

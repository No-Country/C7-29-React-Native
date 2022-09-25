import { ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import { getAllPhotosData } from "../redux/actions/photosActions";
import { useDispatch, useSelector } from "react-redux";
import HomeCards from "../components/HomeCards/HomeCards";
import FilterCards from "../components/FilterCards/FilterCards";
import { Button, Menu, Text } from "react-native-paper";

export default function Home() {
  const dispatch = useDispatch();
  const photos = useSelector((state) => state.photos.filterPhotosData);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    dispatch(getAllPhotosData());
  }, [dispatch]);

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
            <Text>{photos.length} Results</Text>
            <Button onPress={() => setVisible(true)}>Filter/Order</Button>
          </View>
        }
      >
        <Menu.Item onPress={() => {}} title="Filter and Sort Options" />
        <FilterCards />
      </Menu>

      <ScrollView
        style={{
          height: "95%",
          width: "100%",
          alignContent: "center",
        }}
      >
        {photos.map((x) => (
          <HomeCards x={x} key={x.id} />
        ))}
      </ScrollView>
    </View>
  );
}

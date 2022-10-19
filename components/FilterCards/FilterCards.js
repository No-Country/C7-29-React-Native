import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDataForFiltering, getAllChallenges } from "../../redux/actions/photosActions";
import { View } from "react-native";
import { Button, TextInput, Searchbar, Divider, IconButton, Badge } from "react-native-paper";
import { useLanguage } from "../../hooks/useLanguage";
import { Picker } from "@react-native-picker/picker";

export default function FilterCards() {
  const dispatch = useDispatch();
  const savedOptions = useSelector((state) => state.photos.filterOptions);
  const [filter, setFilter] = useState(savedOptions);
  const langstring = useSelector((state) => state.lang.lang);
  const { filterlang } = useLanguage(langstring);
  const challenges = useSelector((state) => state.challenge.allChalenges);

  useEffect(() => {
    dispatch(getDataForFiltering(filter));
  }, [filter, dispatch]);

  useEffect(() => {
    dispatch(getAllChallenges());
  }, [dispatch]);

  function handlePricePay() {
    setFilter({
      ...filter,
      priceRange: {
        ...filter.priceRange,
        pay: filter.priceRange.pay === null ? true : filter.priceRange.pay === true ? false : null,
      },
    });
  }
  function handlePriceMin(e) {
    setFilter({
      ...filter,
      priceRange: {
        ...filter.priceRange,
        min: e.length > 0 ? e : null,
      },
    });
  }

  function handlePriceMax(e) {
    setFilter({
      ...filter,
      priceRange: {
        ...filter.priceRange,
        max: e.length > 0 ? e : null,
      },
    });
  }

  function handleTitle(e) {
    setFilter({
      ...filter,
      title: e.length > 0 ? e : null,
    });
  }

  return (
    <View style={{ width: "100%" }}>
      <Searchbar placeholder={filterlang.search} onChangeText={(e) => handleTitle(e)} value={filter.title ? filter.title : ""} />
      <Button mode="contained" onPress={() => handlePricePay()}>
        {filter.priceRange.pay ? filterlang.tipo[1] : filter.priceRange.pay === null ? filterlang.tipo[0] : filterlang.tipo[2]}
      </Button>
      <View style={{ flexDirection: "row" }}>
        <TextInput placeholder={filterlang.min} onChangeText={(e) => handlePriceMin(e)} value={filter.priceRange.min ? filter.priceRange.min : ""}></TextInput>
        <TextInput placeholder={filterlang.max} onChangeText={(e) => handlePriceMax(e)} value={filter.priceRange.max ? filter.priceRange.max : ""}></TextInput>
      </View>

      <Picker selectedValue={filter.reto} onValueChange={(itemValue) => setFilter({ ...filter, reto: itemValue })}>
        <Picker.Item label={filterlang.reto} value={false} />
        {challenges.currents.map((x) => (
          <Picker.Item label={x.title} value={x._id} key={x._id} />
        ))}
        {challenges.expired.map((x) => (
          <Picker.Item label={x.title + " (" + filterlang.expired + ")"} value={x._id} key={x._id} />
        ))}
      </Picker>

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View>
          <Badge style={{ position: "absolute", zIndex: 99, fontSize: 20 }} visible={filter.order === "+price-" || filter.order === "-price+"}>
            {filter.order === "-price+" ? "↓" : "↑"}
          </Badge>
          <IconButton mode="contained" selected={filter.order === "+price-" || filter.order === "-price+"} icon="cash" onPress={() => setFilter({ ...filter, order: filter.order === "+price-" ? "-price+" : "+price-" })} />
        </View>
        <View>
          <Badge style={{ position: "absolute", zIndex: 99, fontSize: 20 }} visible={filter.order === "+likes-" || filter.order === "-likes+"}>
            {filter.order === "-likes+" ? "↓" : "↑"}
          </Badge>
          <IconButton mode="contained" selected={filter.order === "+likes-" || filter.order === "-likes+"} icon="cards-heart" onPress={() => setFilter({ ...filter, order: filter.order === "+likes-" ? "-likes+" : "+likes-" })} />
        </View>
      </View>

      <Divider />

      <Button
        mode="contained"
        onPress={() =>
          setFilter({
            priceRange: { max: null, min: null, pay: null },
            title: null,
            reto: null,
            order: null,
          })
        }
      >
        {filterlang.reset}
      </Button>
    </View>
  );
}

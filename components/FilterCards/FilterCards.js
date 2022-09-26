import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDataForFiltering } from "../../redux/actions/photosActions";
import { View } from "react-native";
import { Button, TextInput, Searchbar, Divider } from "react-native-paper";

export default function FilterCards() {
  const dispatch = useDispatch();
  const savedOptions = useSelector((state) => state.photos.filterOptions);
  const [filter, setFilter] = useState(savedOptions);

  useEffect(() => {
    dispatch(getDataForFiltering(filter));
  }, [filter, dispatch]);

  function handlePricePay() {
    setFilter({
      ...filter,
      priceRange: {
        ...filter.priceRange,
        pay:
          filter.priceRange.pay === null
            ? true
            : filter.priceRange.pay === true
            ? false
            : null,
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
      <Button mode="contained" onPress={() => handlePricePay()}>
        {filter.priceRange.pay
          ? "Pago"
          : filter.priceRange.pay === null
          ? "Todo"
          : "Gratis"}
      </Button>

      <TextInput
        placeholder="Min Price"
        onChangeText={(e) => handlePriceMin(e)}
        value={filter.priceRange.min ? filter.priceRange.min : ""}
      ></TextInput>
      <TextInput
        placeholder="Max Price"
        onChangeText={(e) => handlePriceMax(e)}
        value={filter.priceRange.max ? filter.priceRange.max : ""}
      ></TextInput>
      <Searchbar
        placeholder="Search..."
        onChangeText={(e) => handleTitle(e)}
        value={filter.title ? filter.title : ""}
      />

      <Divider />

      <Button
        mode="contained"
        onPress={() =>
          setFilter({
            priceRange: { max: null, min: null, pay: "" },
            title: null,
          })
        }
      >
        Reset Filter
      </Button>
    </View>
  );
}

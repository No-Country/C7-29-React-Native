import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allPhotosData: [],
  filterPhotosData: [],
  filterOptions: {
    priceRange: { max: null, min: null, pay: null },
    title: null,
    reto: null,
    order: null,
  },
};

//Este es el slice que uso para tener los datos de todas las fotos que se cargan en el home.

//Funcion

export const functionFilter = (newArray, payload) => {
  if (payload.priceRange.pay !== null) newArray = newArray.filter((x) => x.pay === payload.priceRange.pay);

  if (payload.priceRange.min !== null) newArray = newArray.filter((x) => x.price > payload.priceRange.min && x.pay);

  if (payload.priceRange.max !== null) newArray = newArray.filter((x) => x.price < payload.priceRange.max || !x.pay);

  if (payload.title) newArray = newArray.filter((x) => x.title.toLowerCase().includes(payload.title.toLowerCase()));

  if (payload.reto) newArray = newArray.filter((x) => x.challenge === payload.reto);

  if (payload.order) {
    if (payload.order === "+likes-") newArray = newArray.sort((a, b) => a.likes.length - b.likes.length);
    else if (payload.order === "-likes+") newArray = newArray.sort((a, b) => b.likes.length - a.likes.length);
    else if (payload.order === "+price-") newArray = newArray.sort((a, b) => a.price - b.price);
    else newArray = newArray.sort((a, b) => a.price - b.price);
  }

  return newArray;
};

const photosSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    insertDataAllPhotos: (state, { payload }) => {
      payload = payload.reverse();

      state.allPhotosData = payload;

      state.filterPhotosData = functionFilter(payload, state.filterOptions);
    },
    setFilter: (state, { payload }) => {
      state.filterOptions = payload;
      var newArray = state.allPhotosData;
      state.filterPhotosData = functionFilter(newArray, payload);
    },
    cleanPhotos: (state, { payload }) => {
      state = initialState;
    },
  },
});

export const { insertDataAllPhotos, cleanPhotos, setFilter } = photosSlice.actions;
export default photosSlice.reducer;

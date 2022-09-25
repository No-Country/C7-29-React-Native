import { configureStore } from "@reduxjs/toolkit";
import photos from "../slices/photosSlice";


export default configureStore({
  reducer: {
    photos,
  },
});

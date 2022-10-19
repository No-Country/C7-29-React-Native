import { configureStore } from "@reduxjs/toolkit";
import photos from "../slices/photosSlice";
import cart from "../slices/cartSlice";
import user from "../slices/userSlice";
import snackBar from "../slices/snackBarSlice";
import lang from "../slices/langSLice";
import profile from "../slices/profileSlice";
import challenge from "../slices/challengeSlice";

export default configureStore({
  reducer: {
    photos,
    user,
    cart,
    snackBar,
    lang,
    profile,
    challenge,
  },
});

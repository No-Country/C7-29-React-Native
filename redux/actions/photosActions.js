import { insertDataAllPhotos, setFilter } from "../slices/photosSlice";
import { fillProfileData } from "../slices/profileSlice";
import { LogIn } from "../slices/userSlice";
export const getAllPhotosData = () => async (dispatch) => {
  return await fetch(`http://192.168.1.67:9000/api/publication`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((d) => dispatch(insertDataAllPhotos(d)))
    .catch((e) => console.log(e));
};

export const getDataForFiltering = (filterData) => async (dispatch) => {
  return dispatch(setFilter(filterData));
};

export const uploadPhotoForm = (data) => async () => {
  return fetch(`http://192.168.1.67:9000/api/publication`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: data.title.value,
      description: data.description.value,
      url: data.image.value,
      price: data.price.price,
      pay: data.price.paga,
      photographer: data._id,
      tags: data.tags.value,
      ubication: data.ubication.value,
    }),
  })
    .then((response) => response.json())
    .then((d) => d)
    .catch((e) => console.log(e));
};

export const uploadPhotoToCloudinary = (e) => async () => {
  const imageData = new FormData();
  imageData.append("file", { uri: e, name: "image.jpg", type: "image/jpeg" });
  imageData.append("upload_preset", "skaneetk");

  return await fetch("https://api.cloudinary.com/v1_1/dhyz4afz7/image/upload", {
    method: "POST",
    body: imageData,
  })
    .then((response) => response.json())
    .then((data) => data.secure_url)
    .catch((e) => console.log(e));
};

export const deletePhoto = (id) => async (dispatch) => {
  return await fetch(`http://192.168.1.67:9000/api/publication/${id}`, {
    method: "DELETE",
  })
    .then(async (d) => {
      return await fetch(`http://192.168.1.67:9000/api/publication`, {
        method: "GET",
      })
        .then((responsea) => responsea.json())
        .then((f) => dispatch(insertDataAllPhotos(f)))
        .catch((e) => console.log(e));
    })
    .catch((e) => console.log(e));
};

export const getProfileDetails = (id) => async (dispatch) => {
  return fetch(`http://192.168.1.67:9000/api/searchId/userForId/${id}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((d) => dispatch(fillProfileData(d)))
    .catch((e) => e);
};

export const buyItems = async (data) => {
  return fetch(`http://192.168.1.67:9000/api/mercadopago/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((d) => d)
    .catch((e) => e);
};

export const logInWhitJWT = (data) => async (dispatch) => {
  return await fetch("http://192.168.1.67:9000/api/auth/loged", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authentication: data.jwt,
    },
  })
    .then((response) => response.json())
    .then((d) => dispatch(LogIn(d)))
    .catch((e) => console.log(e));
};

export const addFollowed = (idPh, _idCurrent) => async () => {
  console.log("addFollowing", idPh, _idCurrent);
  return fetch(`http://192.168.1.67:9000/api/users/${_idCurrent}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      followed: idPh,
    }),
  })
    .then((response) => response.json())
    .then((d) => d)
    .catch((e) => e);
};

export const addFollowers = (followers, idPh) => async () => {
  console.log("addfollowers", followers, idPh);
  return fetch(`http://192.168.1.67:9000/api/users/${idPh}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      followers: followers,
    }),
  })
    .then((response) => response.json())
    .then((d) => d)
    .catch((e) => e);
};

export const addLiked = (id, _idCurrent) => async () => {
  return fetch(`http://192.168.1.67:9000/api/users/${_idCurrent}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      liked: id,
    }),
  })
    .then((response) => response.json())
    .then((d) => d)
    .catch((e) => e);
};

export const addFavotites = (id, _idCurrent) => async () => {
  return fetch(`http://192.168.1.67:9000/api/users/${_idCurrent}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      favorites: id,
    }),
  })
    .then((response) => response.json())
    .then((d) => d)
    .catch((e) => e);
};

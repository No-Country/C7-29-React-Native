import { insertDataAllPhotos, setFilter } from "../slices/photosSlice";

export const getAllPhotosData = () => async (dispatch) => {
  return await fetch(`http://localhost:9000/api/publication`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((d) => dispatch(insertDataAllPhotos(d)))
    .catch((e) => e);
};

export const getDataForFiltering = (filterData) => async (dispatch) => {
  return dispatch(setFilter(filterData));
};

export const uploadPhotoForm = (data) => async () => {
  return fetch(`http://localhost:9000/api/publication`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: data.title.value,
      description: data.description.value,
      url: data.image.value,
      photographer: "633019f6563aac8b3fa1f6a0",
    }),
  })
    .then((response) => response.json())
    .then((d) => d)
    .catch((e) => e);
};

export const uploadPhotoToCloudinary = (e) => async () => {
  const imageData = new FormData();

  imageData.append("file", e.target.files[0]);
  imageData.append("upload_preset", "skaneetk");

  return await fetch("https://api.cloudinary.com/v1_1/dhyz4afz7/image/upload", {
    method: "POST",
    body: imageData,
  })
    .then((response) => response.json())
    .then((data) => data.secure_url);
};

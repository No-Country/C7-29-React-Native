import { useEffect } from "react";
import { View, Image, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getProfileDetails } from "../redux/actions/photosActions";
import { cleanProfileDetails } from "../redux/slices/profileSlice";

export default function ProfilebyId({ route }) {
  const { id } = route.params;
  const dispatch = useDispatch();
  const details = useSelector((state) => state.profile.userData);
  useEffect(() => {
    dispatch(getProfileDetails(id));
    return () => dispatch(cleanProfileDetails());
  }, [dispatch, id]);
  console.log(details);
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Image
        source={{ uri: details.avatar }}
        style={{ width: "100%", height: "40%" }}
      />
      <Text>
        {details.name} {details.lastName}
      </Text>
      
      <Text>Joined: {details.createdAt}</Text>
      {details.userType === "userPhotographer" ? (
        <Text>Photos: {details.publications.length}</Text>
      ) : null}
    </View>
  );
}

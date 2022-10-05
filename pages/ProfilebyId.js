import { useEffect } from "react";
import { View, Image, Text, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getProfileDetails } from "../redux/actions/photosActions";
import { cleanProfileDetails } from "../redux/slices/profileSlice";
import HomeCards from "../components/HomeCards/HomeCards";

export default function ProfilebyId({ route }) {
  const { id } = route.params;
  const dispatch = useDispatch();
  const details = useSelector((state) => state.profile.userData);
  useEffect(() => {
    dispatch(getProfileDetails(id));
    return () => dispatch(cleanProfileDetails());
  }, [dispatch, id]);

  var a = [...details.publications] || [];
  a.reverse();
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

      <ScrollView
        style={{
          height: "95%",
          width: "100%",
          alignContent: "center",
        }}
      >
        {details.publications.length > 0
          ? a.map((x, indice) => (
              <HomeCards x={x} key={x._id} indice={indice} />
            ))
          : null}
      </ScrollView>
    </View>
  );
}

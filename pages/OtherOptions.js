import {View, Button} from 'react-native';

export default function OtherOptions({navigation}){

  return (
    <View>
        <Button title="Home" onPress={()=> navigation.navigate('Home')}/>
        <Button title="Upload Photo" onPress={()=> navigation.navigate('Upload')}/>
        <Button title="Profile" onPress={()=> navigation.navigate('Profile')}/>
    </View>
  );
}
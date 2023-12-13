import React, { useState, useEffect} from 'react';

import { View, StyleSheet, Alert, Pressable, Text, FlatList} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const AddService = ({navigation}) => {
   const [service, setService] = useState("");
   const [price, setPrice] = useState("");

   const addService = async () => {
    try {
      if (!service || !price) {
      
        return;
      }
      const priceValue = parseFloat(price);
      if (isNaN(priceValue)) {
        Alert.alert("","Invalid number");
        return;
      }
      await firestore().collection('services').add({
        serviceName: service,
        price: priceValue,
        
      });
      navigation.navigate("Home")
      // setService('');
      // setPrice('');

    } catch (error) {
      
    }
  };

    return (
        <View style={{justifyContent:'center', margin:10, borderRadius:20}}>
            <Text style={{marginLeft: 10, fontWeight: 'bold'}}>Service name * </Text>
            <TextInput
                style={{margin: 10, borderRadius:10}}
                label="Input service name"
                value={service}
                underlineColor='transparent'
                onChangeText={service => setService(service)}
            />
             <Text style={{marginLeft: 10, fontWeight: 'bold'}}>Price * </Text>
            <TextInput
             style={{margin: 10, borderRadius:10}}
                label="input price service"
                value={price}
                underlineColor='transparent'
                onChangeText={price => setPrice(price)}

            />
           
            <View style={{justifyContent: 'center', padding: 10 }}>
                <Pressable 
                onPress={addService}
                style={{backgroundColor: "red", 
                alignItems:'center',
                padding: 15, 
                borderRadius:10, 
               }}
                >
                  <Text  style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>Add</Text>
                </Pressable>
            </View>
           
                 
        </View>
    );
}

const styles = StyleSheet.create({})

export default AddService;

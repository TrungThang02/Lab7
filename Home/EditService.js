import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const EditService = ({ route, navigation }) => {
  const { id } = route.params;
  const [service, setService] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const serviceDoc = await firestore().collection('services').doc(id).get();
        if (serviceDoc.exists) {
          const serviceData = serviceDoc.data();
          setService(serviceData.serviceName);
          setPrice(serviceData.price.toString());
        }
      } catch (error) {
       
      }
    };

    fetchServiceDetails();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const priceValue = parseFloat(price);
      if (isNaN(priceValue)) {
        Alert.alert('', 'Invalid number');
        return;
      }

      await firestore().collection('services').doc(id).update({
        serviceName: service,
        price: priceValue,
      });
      navigation.goBack();
    } catch (error) {
     
    }
  };

  return (
    <View style={{ justifyContent: 'center', margin: 10, borderRadius: 20 }}>
      <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>Service name * </Text>
      <TextInput
        style={{ margin: 10, borderRadius: 10 }}
        label="Input service name"
        value={service}
        underlineColor='transparent'
        onChangeText={service => setService(service)}
      />
      <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>Price * </Text>
      <TextInput
        style={{ margin: 10, borderRadius: 10 }}
        label="input price service"
        value={price}
        underlineColor='transparent'
        onChangeText={price => setPrice(price)}
      />

      <View style={{ justifyContent: 'center', padding: 10 }}>
        <Pressable
          onPress={handleUpdate}
          style={{
            backgroundColor: "red",
            alignItems: 'center',
            padding: 15,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>Update</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default EditService;
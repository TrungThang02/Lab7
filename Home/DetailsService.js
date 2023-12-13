import React, { useState, useEffect, useContext} from 'react';
import { View, Text, Alert, Pressable, Modal, TextInput, TouchableHighlight } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firestore from '@react-native-firebase/firestore';
import { UserProvider, UserContext } from '../context/UseContext';
const DetailService = ({ route, navigation}) => {
  const { serviceName, price } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const { userInfo } = useContext(UserContext);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateChange = date => {
    hideDatePicker();
    if (date && date >= new Date()) {
      setSelectedDate(date);
    } else {
      Alert.alert("Invalid Date", "Please select a future date.");
    }
  };

  const OrderService = () => {
    setShowOrderModal(true);
  };

  const handleOrderConfirm = async () => {
    try {
      await firestore().collection('orders').add({
        serviceName,
        price,
        selectedDate: selectedDate.toISOString(),
        phoneNumber,
        customerName,
        status: 'pending',
        email: userInfo.email
      });
      console.log('Order Successfully for', serviceName, 'on', selectedDate.toDateString());

      Alert.alert("Success", `Order Successfully ${serviceName}}`);
      setPhoneNumber('');
      setCustomerName('');
      setSelectedDate(new Date());
      setShowOrderModal(false);
    } catch (error) {
      console.error('Error adding order to Firestore:', error);
      Alert.alert("Error", "Failed to place the order. Please try again.");
    }
  };

  return (
    <View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'black' }}>Service Name: {serviceName}</Text>
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'black' }}>Price: {price}</Text>
      </View>


      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        minimumDate={new Date()}
        onConfirm={handleDateChange}
        onCancel={hideDatePicker}
      />

      <TouchableHighlight
        onPress={OrderService}
        style={{
          backgroundColor: "red",
          alignItems: 'center',
          padding: 15,
          borderRadius: 10,
          margin: 10,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Order Now</Text>
      </TouchableHighlight>

      {showOrderModal && (
        <Modal
         
          animationType="slide"
          transparent={true}
          visible={showOrderModal}
          onRequestClose={() => {
            setShowOrderModal(false);
          }}
        >
          <View style={{flex:1, height:200,justifyContent: 'center', alignItems: 'center', backgroundColor:'#fff' }}>

          <TouchableHighlight
        onPress={showDatePicker}
        style={{
          backgroundColor: "red",
          alignItems: 'center',
          padding: 15,
          borderRadius: 10,
          margin: 10,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Select Date</Text>
      </TouchableHighlight>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>Selected Date: {selectedDate.toDateString()}</Text>
            <TextInput
              style={{
                height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                marginBottom: 10,
                padding: 10,
                width: 200,
              }}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              onChangeText={text => setPhoneNumber(text)}
              value={phoneNumber}
            />
            <TextInput
              style={{
                height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                marginBottom: 10,
                padding: 10,
                width: 200,
              }}
              placeholder="Customer Name"
              onChangeText={text => setCustomerName(text)}
              value={customerName}
            />
             {/* <TouchableHighlight
             onPress={() => navigation.goBack()}
              style={{ backgroundColor: "red", padding: 10, borderRadius: 10 }}
            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Confirm Order</Text>
            </TouchableHighlight> */}
            <TouchableHighlight
              onPress={handleOrderConfirm}
              style={{ backgroundColor: "red", padding: 10, borderRadius: 10 }}
            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Confirm Order</Text>
            </TouchableHighlight>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default DetailService;

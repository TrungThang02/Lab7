import React, { useEffect, useState, useContext } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Alert, Pressable } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { UserProvider, UserContext } from '../context/UseContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
const Orders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const { userInfo } = useContext(UserContext);

  const fetchData = async () => {
    try {
      if (userInfo.email) {
        const ordersCollection = firestore().collection('orders');
        const ordersSnapshot = await ordersCollection.where('email', '==', userInfo.email).get();
        const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
      } else {
        console.log('User email not available.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };
  const handleDetails = (orderId, serviceName, price, selectedDate, phoneNumber, customerName) => {
    navigation.navigate('OrdersDetails', {
      orderId,
      serviceName,
      price,
      selectedDate,
      phoneNumber,
      customerName,
    });
  };

  const handleEditOrder = (orderId) => {
    // Implement the logic for editing an order
    console.log(`Editing order with ID: ${orderId}`);
    // Redirect or open a modal for editing the order
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      // Show a confirmation dialog before deleting the order
      Alert.alert(
        'Delete Order',
        'Are you sure you want to delete this order?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              // Delete the order from Firestore
              await firestore().collection('orders').doc(orderId).delete();
              // Fetch updated data after deletion
              fetchData();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error deleting order:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleDetails(item.id, item.serviceName, item.price, item.selectedDate, item.phoneNumber, item.customerName)}
            style={{ ...styles.item, marginTop: 10 }}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View>
                <Text>Tên dịch vụ: {item.serviceName}</Text>
                <Text>Đơn giá: {item.price}</Text>
                <Text>SĐT: {item.phoneNumber}</Text>
                <Text>Trạng trái: {item.status}</Text>
              </View>
              <View style={{ justifyContent:'center'}}>
                <View style={{ flexDirection: 'row', justifyContent:'center', alignContent:'center'}}>
                  <Pressable onPress={() => handleEdit(item)}>
                    <View style={{ backgroundColor: 'green', padding: 10, borderRadius: 50, marginRight: 10 }}>
                      <Text>
                        <Icon name="edit" size={20} style={{ color: 'white' }} />
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable onPress={() => handleDeleteOrder(item.id)}>
                    <View style={{ backgroundColor: 'red', padding: 10, borderRadius: 50 }}>
                      <Text>
                        <Icon name="delete" size={20} style={{ color: 'white' }} />
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>

          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffff',
    flex: 1,

  },
  item: {
    borderWidth: 1,
    padding: 10,
  
    borderColor: 'gray',
    borderRadius: 10,
    justifyContent: 'center',
    margin: 5
  }
});

export default Orders;

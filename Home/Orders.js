import React, { useEffect, useState, useContext } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { UserProvider, UserContext } from '../context/UseContext';

const Orders = () => {
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.serviceName}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Orders;

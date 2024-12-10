import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

const ErrorModal = ({ visible, message, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}>
        <View style={{
          width: 300,
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
            Ошибка
          </Text>
          <Text style={{ marginBottom: 20 }}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={{
            backgroundColor: '#FF8F00',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
          }}>
            <Text style={{ color: 'white' }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ErrorModal;

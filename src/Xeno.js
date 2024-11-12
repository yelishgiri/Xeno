import React, { useState } from 'react';
import { View, Text, TextInput, Modal, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; 


const Xeno = ({ visible, onClose }) => {
  const [formData, setFormData] = useState({
    item_name: '',
    condition: '',
    description: '',
    price_range: '',
    category: ''
  });
  const [selectedFileUri, setSelectedFileUri] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const categories = [
      "Outdoor Recreation",
      "Home Appliances",
      "Electronics",
      "Home & Garden",
      "Tools",
      "Travel",
      "Kitchen Appliances",
      "Garden",
      "Winter Equipment",
      "Party Supplies",
      "Transportation",
      "Pet Supplies",
      "Fitness",
      "Health & Wellness"
    ];

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const uri = res.assets[0].uri;
        setSelectedFileUri(uri);

        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setBase64Image(base64);
      } else if (res.canceled) {
        alert("File selection was canceled.");
      } else {
        alert("Failed to load file. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while selecting or processing the file.");
    }
  };

  const moderateImage = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://backend-llama-vision.onrender.com/moderate', { image: base64Image });
      if (response.data.is_appropriate) {
        await analyzeImage();
      } else {
        Alert.alert("Image Not Approved", "The image violates our platform guidelines.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during image moderation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async () => {
    try {
      const response = await axios.post('https://backend-llama-vision.onrender.com/analyze', { image: base64Image });
      setFormData((prev) => ({
        ...prev,
        ...response.data,
        category: categories.includes(response.data.category) ? response.data.category : ''
      }));
      setIsAnalyzed(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert('Product data submitted successfully!');
    setIsAnalyzed(false);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView contentContainerStyle={{ flex: 1, padding: 16, backgroundColor: '#f5f5f5' }}>
        <View className="p-6 rounded-lg bg-white shadow-lg">
          <Text className="text-2xl font-bold text-center mb-6">Add New Item</Text>

          {!isAnalyzed ? (
            <>
              <TouchableOpacity onPress={pickFile} className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                {selectedFileUri ? (
                  <Image source={{ uri: selectedFileUri }} style={{ width: '100%', height: '100%', borderRadius: 10 }} resizeMode="cover" />
                ) : (
                  <Text className="text-gray-500 text-base">Select an Image</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity className="w-full bg-blue-500 py-3 rounded-md" onPress={moderateImage}>
                <Text className="text-white text-center font-semibold text-lg">Upload Image</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-1">Item Name</Text>
                <TextInput
                  className="h-10 px-3 border border-gray-300 rounded-md bg-white"
                  placeholder="Enter item name"
                  value={formData.item_name}
                  onChangeText={(text) => handleInputChange('item_name', text)}
                />
              </View>
              <TouchableOpacity className="w-full bg-green-500 py-3 rounded-md mt-4" onPress={handleSubmit}>
                <Text className="text-white text-center font-semibold text-lg">Submit Item</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 24 }} />}
      </ScrollView>
    </Modal>
  );
};

export default Xeno;

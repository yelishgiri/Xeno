import React, { useState } from 'react';
import { View, Text, TextInput, Modal, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image, StyleSheet } from 'react-native';
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
    ];;

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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add New Item</Text>

          {!isAnalyzed ? (
            <>
              <TouchableOpacity onPress={pickFile} style={styles.imagePlaceholder}>
                {selectedFileUri ? (
                  <Image source={{ uri: selectedFileUri }} style={styles.image} resizeMode="cover" />
                ) : (
                  <Text style={styles.imageText}>Select an Image</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton} onPress={moderateImage}>
                <Text style={styles.uploadButtonText}>Upload Image</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.formField}>
                <Text style={styles.label}>Item Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter item name"
                  value={formData.item_name}
                  onChangeText={(text) => handleInputChange('item_name', text)}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>Condition</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter condition"
                  value={formData.condition}
                  onChangeText={(text) => handleInputChange('condition', text)}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  placeholder="Describe the item"
                  value={formData.description}
                  onChangeText={(text) => handleInputChange('description', text)}
                  multiline
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>Price</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter price"
                  keyboardType="numeric"
                  value={formData.price_range}
                  onChangeText={(text) => handleInputChange('price_range', text)}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>Category</Text>
                <Picker
                  selectedValue={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                  style={styles.picker}
                >
                  {categories.map((category) => (
                    <Picker.Item key={category} label={category} value={category} />
                  ))}
                </Picker>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit Item</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />}
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  modalContent: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageText: {
    color: '#888',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  descriptionInput: {
    height: 80,
  },
  picker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingIndicator: {
    marginTop: 24,
  },
});

export default Xeno;

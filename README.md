# Xeno - Item Form Package

Xeno introduces state-of-art technology of automation of moderation in e-commerce sites and automatic form filling where the user single click can save thousands of times for an product lister and can be integrated seemlesly in any platform but it supports only react native as of now.
`@yelishgiri1/xeno` is a React Native component that provides a customizable item form interface, including image selection, moderation, and detailed form fields. This package is ideal for applications that require item listings with image moderation.

## Installation

To install `@yelishgiri1/xeno` and its required dependencies, run:

```bash
npm install @yelishgiri1/xeno
npm install @react-native-picker/picker axios expo-document-picker expo-file-system

#Usage

After installation, import and use the Xeno component in your application. Note: For now, you need to import it directly from the src folder.

import React, { useState } from 'react';
import { View, Button } from 'react-native';
import Xeno from '@yelishgiri1/xeno/src/Xeno.js'; // Importing from src

export default function App() {
  const [isXenoVisible, setXenoVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Open Rent Form" onPress={() => setXenoVisible(true)} />
      <Xeno
        visible={isXenoVisible}
        onClose={() => setXenoVisible(false)}
      />
    </View>
  );
}

Props

The Xeno component accepts the following props:

    visible (boolean): Controls the visibility of the modal. Set to true to show and false to hide.
    onClose (function): A callback function triggered when the modal is requested to be closed. This function should change the visible prop to false to close the modal.

Features

    Image Selection and Upload: Allows users to select and upload an image, which is then moderated through backend services.
    Form Fields: Includes fields for item name, condition, description, price, and category selection.
    Image Moderation and Analysis: Integrates with backend services for image moderation and analysis, ensuring that the uploaded content meets platform guidelines.

Styling

The Xeno component includes built-in styles via React Native’s StyleSheet. Here’s a guide on how to apply and modify styles:

    Direct Modification in Xeno.js: You can directly modify the styles in the Xeno.js file to match your app’s design. Look for the StyleSheet.create section and adjust styles accordingly.

    Wrapper Styles: Alternatively, you can wrap Xeno in your own component and apply additional styles to control its appearance within your app.

    Example:

import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import Xeno from '@yelishgiri1/xeno/src/Xeno.js';

export default function App() {
  const [isXenoVisible, setXenoVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="Open Rent Form" onPress={() => setXenoVisible(true)} />
      <View style={styles.modalWrapper}>
        <Xeno visible={isXenoVisible} onClose={() => setXenoVisible(false)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  modalWrapper: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});

Overriding Styles with Tailwind (if using NativeWind): If you’re using NativeWind with Tailwind CSS, you can apply Tailwind classes to customize the component as shown below:

    <View className="bg-white p-4 rounded-lg shadow-md">
      <Xeno visible={isXenoVisible} onClose={() => setXenoVisible(false)} />
    </View>

Important Notes

    Dependencies: Ensure the following packages are installed in your project:
        @react-native-picker/picker
        axios
        expo-document-picker
        expo-file-system
    Backend Services: The component relies on external services for image moderation and analysis. Make sure these services are active and accessible.

Example Workflow

    Open the Form: Trigger the Xeno modal by setting visible to true.
    Image Upload and Moderation: Select an image for moderation.
    Form Submission: Fill in item details and submit the form.

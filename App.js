import { PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import { Button, Image } from 'react-native';

// var RNFS = require('react-native-fs');

export default function App() {

    const [uri, setUri] = useState("");

    const openImagePicker = async () => {
        const response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });
        handleResponse(response);
    };

    const handleCameraLaunch = async () => {
        const response = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });
        handleResponse(response);
    };

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Camera Permission",
                    message: "This app needs access to your camera to take photos",
                    buttonNeutral: "Ask me later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Camera permssion granted")
                handleCameraLaunch();
            } else {
                console.log("Camera permission denied");
            }

        } catch (err) {
            console.warn(err);
        }
    };

    const handleResponse = (response) => {
        if (response.canceled) { // Check for cancellation
            console.log("User cancelled image picker");
        } else if (response.assets && response.assets.length > 0) {
            const imageUri = response.assets[0].uri; // Access URI from assets array
            setUri(imageUri);
        } else {
            console.log("No assets found in the response");
        }
    };


    // const saveFile = async () => {
    //     const path = RNFS.DownloadDirectoryPath + "/test.txt";
    //     RNFS.writeFile(path, "Lorem ipsum dolor sit amet", "utf8").then((res) => {
    //         console.log("Sucessfully created file. Check your downloads folder")
    //     }).catch((err) => {
    //         console.error(err);
    //     });
    // };


    // npx expo install expo-file-system
    // gabisa di downloads jadi liat aja log buat foldernya
    const saveFile = async () => {
        if (!uri) {
            console.log("No image to save");
            return;
        }

        const filename = uri.split('/').pop(); // Extract the file name from the URI
        const downloadDir = FileSystem.documentDirectory + 'Download/'; // Path to Downloads

        try {
            await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });

            const downloadPath = downloadDir + filename;

            await FileSystem.copyAsync({
                from: uri,
                to: downloadPath,
            });

            console.log(`Image saved to ${downloadPath}`);
            alert("Image saved to Downloads folder successfully!");
        } catch (error) {
            console.error("Error saving file:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Open Camera" onPress={requestCameraPermission} />
            <Button title="Open Gallery" onPress={openImagePicker} />
            <Button title="Save File" onPress={saveFile} />
            {uri ? <Image source={{ uri: uri }} style={styles.image} /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 20,
    },
});

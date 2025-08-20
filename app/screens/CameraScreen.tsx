import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  onDone?: () => void;
}

const CameraScreen: React.FC<Props> = ({ onDone }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<'back' | 'front'>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isBeforePhoto, setIsBeforePhoto] = useState(true);
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && cameraRef.current.takePictureAsync) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: false,
        });
        if (photo?.uri) setCapturedImage(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  const proceedToPost = async () => {
    if (capturedImage) {
      try {
        // Save to media library
        await MediaLibrary.requestPermissionsAsync();
        await MediaLibrary.saveToLibraryAsync(capturedImage);
        
        router.push('/create-post?photoUri=' + encodeURIComponent(capturedImage) + '&isBeforePhoto=' + isBeforePhoto);
      } catch (error) {
        console.log('Error saving to library:', error);
        // Still proceed even if saving fails
        router.push('/create-post?photoUri=' + encodeURIComponent(capturedImage) + '&isBeforePhoto=' + isBeforePhoto);
      }
    }
  };

  const flipCamera = () => {
    setType(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlashMode(current => {
      switch (current) {
        case 'off': return 'on';
        case 'on': return 'auto';
        case 'auto': return 'off';
        default: return 'off';
      }
    });
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case 'on': return 'flash';
      case 'off': return 'flash-off';
      case 'auto': return 'flash-outline';
      default: return 'flash-off';
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Please grant permission to access your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedImage }} style={styles.preview} />
        <View style={styles.previewControls}>
          <TouchableOpacity style={styles.controlButton} onPress={retakePicture}>
            <Ionicons name="refresh" size={24} color="#fff" />
            <Text style={styles.controlButtonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={proceedToPost}>
            <Ionicons name="checkmark" size={24} color="#fff" />
            <Text style={styles.controlButtonText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={type}
        enableTorch={flashMode === 'on'}
      >
        <View style={styles.cameraHeader}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.modeToggle}>
            <TouchableOpacity 
              style={[styles.modeButton, isBeforePhoto && styles.modeButtonActive]}
              onPress={() => setIsBeforePhoto(true)}
            >
              <Text style={[styles.modeText, isBeforePhoto && styles.modeTextActive]}>Before</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modeButton, !isBeforePhoto && styles.modeButtonActive]}
              onPress={() => setIsBeforePhoto(false)}
            >
              <Text style={[styles.modeText, !isBeforePhoto && styles.modeTextActive]}>After</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.headerButton} onPress={toggleFlash}>
            <Ionicons name={getFlashIcon()} size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cameraViewfinder}>
          <View style={styles.viewfinderFrame}>
            <Text style={styles.viewfinderText}>
              {isBeforePhoto ? '📸 Before Photo' : '✨ After Photo'}
            </Text>
            <Text style={styles.viewfinderSubtext}>
              {isBeforePhoto ? 'Show the area before cleanup' : 'Show the area after cleanup'}
            </Text>
          </View>
        </View>
        
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.controlButton} onPress={pickImageFromGallery}>
            <Ionicons name="images" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={flipCamera}>
            <Ionicons name="camera-reverse" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#ffd300',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 4,
  },
  modeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  modeButtonActive: {
    backgroundColor: '#ffd300',
  },
  modeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modeTextActive: {
    color: '#000',
  },
  cameraViewfinder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinderFrame: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 12,
  },
  viewfinderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  viewfinderSubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 20,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ffd300',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 20,
  },
});

export default CameraScreen;
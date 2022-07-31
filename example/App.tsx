import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
  Text,
  StyleSheet,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {GalleryModal} from './src/screens';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isGalleryOpened, setIsGalleryOpened] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const toggleGallery = () => {
    setIsGalleryOpened(prev => !prev);
  };

  return (
    <SafeAreaView style={[backgroundStyle, style.container]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <TouchableOpacity onPress={toggleGallery}>
        <Text>Open Gallery</Text>
      </TouchableOpacity>
      <GalleryModal
        visible={isGalleryOpened}
        onCloseRequested={toggleGallery}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    padding: 24,
    backgroundColor: 'yellow',
  },
});

export default App;

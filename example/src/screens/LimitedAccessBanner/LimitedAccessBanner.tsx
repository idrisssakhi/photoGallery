import React from 'react';
import {styles} from './LimitedAccessBanner.style';

import {Text, TouchableOpacity, View} from 'react-native';
import {iosRefreshGallerySelection} from 'react-native-photo-gallery-api';

export const LimitedAccessBanner = () => {
  return (
    <>
      <View style={styles.limitedPhotoManagerContainer}>
        <Text>Only Limited Access Granted</Text>
        <TouchableOpacity onPress={iosRefreshGallerySelection}>
          <Text>Manage Image selection</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

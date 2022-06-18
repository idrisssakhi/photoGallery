import React, {useMemo} from 'react';
import {ActivityIndicator, Dimensions, Modal, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {useGalleryPermission} from '../hooks';
import {ImageList} from './ImageList/ImageList';

const BIG_SCREEN_WIDTH = 430;
const {width: screenWidth} = Dimensions.get('screen');
const columnsCount = screenWidth <= BIG_SCREEN_WIDTH ? 3 : 5;
const imageCardSideLength =
  (screenWidth - 16 - 5 * (columnsCount - 1)) / columnsCount;

interface Props {
  visible: boolean;
  onCloseRequested: () => void;
}
export const GalleryModal = ({visible, onCloseRequested}: Props) => {
  const {readPermissionStatus, isLoading} = useGalleryPermission({
    autoRequestPermission: true,
  });

  const isPermittedToAccessGallery = useMemo(
    () =>
      readPermissionStatus === 'limited' ||
      readPermissionStatus === 'granted',
    [readPermissionStatus],
  );

  return (
    <Modal
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent 
      visible={visible} 
      onRequestClose={onCloseRequested}>
        <SafeAreaView>
        <TouchableOpacity onPress={onCloseRequested}>
          <Text>Close</Text>
        </TouchableOpacity>
      {isLoading && <ActivityIndicator color={'grey'} size="large" />}
      {isPermittedToAccessGallery && (
        <ImageList
          cardSideLength={imageCardSideLength}
          numColumns={columnsCount}
          isLimitedPhotosSelected={
            readPermissionStatus === 'limited'
          }
        />
      )}
      </SafeAreaView>
    </Modal>
  );
};

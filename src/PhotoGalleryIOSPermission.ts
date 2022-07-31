import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

/** Defines ios permission access levels for gallery */
export type AccessLevel = 'addOnly' | 'readWrite';

export type PhotoGalleryAuthorizationStatus = 'granted' | 'limited' | 'denied' | 'unavailable' | 'blocked' | 'not-determined';

const { PhotoGalleryPermissionModule: PhotoLibraryPermissionModule } = NativeModules;

const isIOS = Platform.OS === 'ios';

if (isIOS && PhotoLibraryPermissionModule == null)
  console.error("photoLibraryPermissionModule: Native Module 'photoLibraryPermissionModule' was null! Did you run pod install?");

export const photoLibraryEventEmitter = new NativeEventEmitter(isIOS ? PhotoLibraryPermissionModule : undefined);

export const iosReadGalleryPermission = (accessLevel: AccessLevel): Promise<PhotoGalleryAuthorizationStatus> => {
  if (!isIOS) throw new Error('this module is available only for ios');
  return PhotoLibraryPermissionModule.checkPermission(accessLevel);
};

export const iosRequestReadWriteGalleryPermission = (): Promise<PhotoGalleryAuthorizationStatus> => {
  if (!isIOS) throw new Error('this module is available only for ios');
  return PhotoLibraryPermissionModule.requestReadWritePermission();
};

export const iosRequestAddOnlyGalleryPermission = (): Promise<PhotoGalleryAuthorizationStatus> => {
  if (!isIOS) throw new Error('this module is available only for ios');
  return PhotoLibraryPermissionModule.requestAddOnlyPermission();
};

export const iosRefreshGallerySelection = (): Promise<boolean> => {
  if (!isIOS) throw new Error('this module is available only for ios');
  return PhotoLibraryPermissionModule.refreshPhotoSelection();
};

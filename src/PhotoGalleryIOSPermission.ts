import { NativeEventEmitter, NativeModules } from 'react-native';

/** Defines ios permission access levels for gallery */
export type AccessLevel = 'addOnly' | 'readWrite';

export type PhotoGalleryAuthorizationStatus = 'granted' | 'limited' | 'denied' | 'unavailable' | 'blocked' | 'not-determined';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const photoLibraryPermissionModule = NativeModules.PhotoGalleryPermissionModule;
if (photoLibraryPermissionModule == null)
  console.error("photoLibraryPermissionModule: Native Module 'photoLibraryPermissionModule' was null! Did you run pod install?");

export const photoLibraryEventEmitter = new NativeEventEmitter(photoLibraryPermissionModule);

export const iosReadGalleryPermission = (accessLevel: AccessLevel): Promise<PhotoGalleryAuthorizationStatus> => {
  return photoLibraryPermissionModule.checkPermission(accessLevel);
};

export const iosRequestReadWriteGalleryPermission = (): Promise<PhotoGalleryAuthorizationStatus> => {
  return photoLibraryPermissionModule.requestReadWritePermission();
};

export const iosRequestAddOnlyGalleryPermission = (): Promise<PhotoGalleryAuthorizationStatus> => {
  return photoLibraryPermissionModule.requestAddOnlyPermission();
};

export const iosRefreshGallerySelection = (): Promise<boolean> => {
  return photoLibraryPermissionModule.refreshPhotoSelection();
};

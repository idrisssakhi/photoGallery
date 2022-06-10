import {NativeEventEmitter, NativeModules} from 'react-native';

/** Defines ios permission access levels for gallery */
export enum AccessLevel {
  AddOnly = 'addOnly',
  ReadWrite = 'readWrite',
}
export enum PhotoGalleryAuthorizationStatus {
  Granted = 'granted',
  Limited = 'limited',
  Denied = 'denied',
  Unavailable = 'unavailable',
  Blocked = 'blocked',
  NotDetermined = 'not-determined',
}
interface PhotoGalleryPermissionModuleType {
  checkPermission: (
    accessLevel: AccessLevel,
  ) => Promise<PhotoGalleryAuthorizationStatus>;
  requestReadWritePermission: () => Promise<PhotoGalleryAuthorizationStatus>;
  requestAddOnlyPermission: () => Promise<PhotoGalleryAuthorizationStatus>;
  refreshPhotoSelection: () => Promise<boolean>;
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;
  getAssetInfo: (params: {id: string}) => Promise<void>;
}

export const photoLibraryPermissionModule =
  NativeModules.PhotoGalleryPermissionModule as PhotoGalleryPermissionModuleType;

export const photoLibraryEventEmitter = new NativeEventEmitter(
  photoLibraryPermissionModule,
);

export const iosReadGalleryPermission = (
  accessLevel: AccessLevel,
): Promise<PhotoGalleryAuthorizationStatus> => {
  return photoLibraryPermissionModule.checkPermission(accessLevel);
};

export const iosRequestReadWriteGalleryPermission =
  (): Promise<PhotoGalleryAuthorizationStatus> => {
    return photoLibraryPermissionModule.requestReadWritePermission();
  };

export const iosRequestAddOnlyGalleryPermission =
  (): Promise<PhotoGalleryAuthorizationStatus> => {
    return photoLibraryPermissionModule.requestAddOnlyPermission();
  };

export const refreshGallerySelection = (): Promise<boolean> => {
  return photoLibraryPermissionModule.refreshPhotoSelection();
};

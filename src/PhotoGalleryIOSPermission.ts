import { NativeEventEmitter, NativeModules } from 'react-native';

/** Defines ios permission access levels for gallery */
export type AccessLevel = 'addOnly' | 'readWrire';

export type PhotoGalleryAuthorizationStatus = 'granted' | 'limited' | 'denied' | 'unavailable' | 'blocked' | 'not-determined';

interface PhotoGalleryPermissionModuleType {
  checkPermission: (accessLevel: AccessLevel) => Promise<PhotoGalleryAuthorizationStatus>;
  requestReadWritePermission: () => Promise<PhotoGalleryAuthorizationStatus>;
  requestAddOnlyPermission: () => Promise<PhotoGalleryAuthorizationStatus>;
  refreshPhotoSelection: () => Promise<boolean>;
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;
  getAssetInfo: (params: { id: string }) => Promise<void>;
}

const photoLibraryPermissionModule = NativeModules.PhotoGalleryPermissionModule as PhotoGalleryPermissionModuleType;

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

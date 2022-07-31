import {useCallback, useEffect, useState} from 'react';
import {AppState, PermissionsAndroid} from 'react-native';

import {
  iosReadGalleryPermission,
  iosRequestAddOnlyGalleryPermission,
  iosRequestReadWriteGalleryPermission,
  PhotoGalleryAuthorizationStatus,
} from 'react-native-photo-gallery-api';
import {isAndroid, isIOS} from '../utils';

interface Props {
  autoRequestPermission: boolean;
}

export const useGalleryPermission = ({autoRequestPermission}: Props) => {
  const [readPermissionStatus, setReadPermissionStatus] =
    useState<PhotoGalleryAuthorizationStatus>();
  const [writePermissionStatus, setWritePermissionStatus] =
    useState<PhotoGalleryAuthorizationStatus>();
  const [isLoading, setIsLoading] = useState(false);

  const checkIosGalleryPermission = useCallback(async () => {
    try {
      const actualPermission = await iosReadGalleryPermission('readWrite');
      setReadPermissionStatus(actualPermission);
      const actualWritePermission = await iosReadGalleryPermission('addOnly');
      setWritePermissionStatus(actualWritePermission);
    } catch (error) {
      console.error("[Gallery][Permission] can't read actual permission");
    }
  }, []);

  const checkAndroidGalleryReadAndWritePermissions = useCallback(async () => {
    const isReadPermissionGranted = await PermissionsAndroid.check(
      'android.permission.READ_EXTERNAL_STORAGE'
    );
    const isWritePermissionGranted = await PermissionsAndroid.check(
      'android.permission.WRITE_EXTERNAL_STORAGE'
    );
    setReadPermissionStatus(isReadPermissionGranted ? 'granted' : 'denied');
    setWritePermissionStatus(isWritePermissionGranted ? 'granted' : 'denied');
  }, []);

  const requestAndroidGalleryReadPermission = useCallback(async () => {
    const permission = 'android.permission.READ_EXTERNAL_STORAGE';
    const status = await PermissionsAndroid.request(permission);
    setReadPermissionStatus(status === 'granted' ? 'granted' : 'denied');
  }, []);

  const requestAndroidGalleryWritePermission = useCallback(async () => {
    setIsLoading(true);
    const status = await PermissionsAndroid.request(
      'android.permission.WRITE_EXTERNAL_STORAGE'
    );
    setWritePermissionStatus(status === 'granted' ? 'granted' : 'denied');
    setIsLoading(false);
    return status === 'granted' ? 'granted' : 'denied';
  }, []);

  const refreshPermissions = useCallback(async () => {
    setIsLoading(true);
    isIOS
      ? await checkIosGalleryPermission()
      : await checkAndroidGalleryReadAndWritePermissions();
    setIsLoading(false);
  }, [checkAndroidGalleryReadAndWritePermissions, checkIosGalleryPermission]);

  const initPermissions = useCallback(async () => {
    setIsLoading(true);
    isIOS
      ? await checkIosGalleryPermission()
      : await requestAndroidGalleryReadPermission();
    setIsLoading(false);
  }, [requestAndroidGalleryReadPermission, checkIosGalleryPermission]);

  const requestIOSFullPermission = useCallback(async () => {
    try {
      setIsLoading(true);
      const newPermission = await iosRequestReadWriteGalleryPermission();
      setReadPermissionStatus(newPermission);
      setWritePermissionStatus(newPermission);
    } catch (error) {
      console.error(
        "[Gallery][Permission] can't request camera roll permission",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestIOSWritePermission = useCallback(async () => {
    try {
      setIsLoading(true);
      const newPermission = await iosRequestAddOnlyGalleryPermission();
      setReadPermissionStatus(newPermission);
      setWritePermissionStatus(newPermission);
      return newPermission;
    } catch (error) {
      console.error(
        "[Gallery][Permission] can't request camera roll write permission",
      );
      return 'denied';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestGalleryWritePermission = useCallback(async () => {
    return isAndroid
      ? await requestAndroidGalleryWritePermission()
      : await requestIOSWritePermission();
  }, [requestAndroidGalleryWritePermission, requestIOSWritePermission]);

  useEffect(() => {
    if (autoRequestPermission) {
      if (!readPermissionStatus && !isLoading && autoRequestPermission) {
        initPermissions();
      }
    }
  }, [autoRequestPermission, initPermissions, isLoading, readPermissionStatus]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (nextAppState === 'active') {
          await refreshPermissions();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [refreshPermissions]);

  useEffect(() => {
    if (
      isIOS &&
      autoRequestPermission &&
      !!readPermissionStatus &&
      readPermissionStatus === 'not-determined' &&
      !isLoading
    ) {
      requestIOSFullPermission();
    }
  }, [
    autoRequestPermission,
    isLoading,
    readPermissionStatus,
    requestIOSFullPermission,
  ]);

  useEffect(() => {
    if (isIOS && !isLoading && !autoRequestPermission) {
      checkIosGalleryPermission();
    }
  }, [autoRequestPermission, checkIosGalleryPermission, isLoading]);

  return {
    readPermissionStatus,
    writePermissionStatus,
    requestGalleryWritePermission,
    isLoading,
  };
};

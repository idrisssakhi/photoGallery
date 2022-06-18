
# react-native-photo-gallery-api

This library was based on react-native-cameraroll which is no more maintained.

### New things on library
1. handles IOS permission with fresh written module (No Auto permission requested on IOS as before).
2. Opens limited media selection on IOS when permission is limited.
3. Propose listener to library selection changes on IOS. 
4. Support scoped storage for android.
5. propose a method to extract images based on internal ID (ph://983983-38938983/LOO).
6. Propose to convert HEIC images into JPEG images in order to send to back-end

## Getting started

`$ npm install react-native-photo-gallery-api --save`

### Mostly automatic installation

`$ react-native link react-native-photo-gallery-api`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-photo-gallery` and add `RNPhotoGallery.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNPhotoGallery.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNPhotoGalleryPackage;` to the imports at the top of the file
  - Add `new RNPhotoGalleryPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-photo-gallery'
  	project(':react-native-photo-gallery').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-photo-gallery/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-photo-gallery')
  	```

## Configuration

**iOS**

The user's permission is required in order to access the Camera Roll on devices running iOS 10 or later. Add the `NSPhotoLibraryUsageDescription` key in your `Info.plist` with a string that describes how your app will use this data. This key will appear as `Privacy - Photo Library Usage Description` in Xcode.

If you are targeting devices running iOS 11 or later, you will also need to add the `NSPhotoLibraryAddUsageDescription` key in your `Info.plist`. Use this key to define a string that describes how your app will use this data. By adding this key to your `Info.plist`, you will be able to request write-only access permission from the user. If you try to save to the camera roll without this permission, your app will exit.

**Android**

Permission is required to read and write to the external storage.

On Expo, follow the guide [here](https://docs.expo.io/versions/latest/sdk/permissions/) for requesting the permission.

On react-native-cli or ejected apps, adding the following lines will add the capability for the app to request the permission. Find more info on Android Permissions [here](https://reactnative.dev/docs/permissionsandroid).

```xml
<manifest>
...
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
...
<application>
```

### Methods

* [`saveToCameraRoll`](#saveToCameraRoll)
* [`getAlbums`](#getalbums)
* [`getPhotos`](#getphotos)
* [`deletePhotos`](#deletephotos)
* [`iosGetImageDataById`](#iosGetImageDataById)

---

# Reference

## Methods

### `saveToCameraRoll()`

```javascript
PhotoGallery.saveToCameraRoll(tag, { type, album })
```

Saves the photo or video to the photo library.

On Android, the tag must be a local image or video URI, such as `"file:///sdcard/img.png"`.

On iOS, the tag can be any image URI (including local, remote asset-library and base64 data URIs) or a local video file URI (remote or data URIs are not supported for saving video at this time).

If the tag has a file extension of .mov or .mp4, it will be inferred as a video. Otherwise it will be treated as a photo. To override the automatic choice, you can pass an optional `type` parameter that must be one of 'photo' or 'video'.

It allows to specify a particular album you want to store the asset to when the param `album` is provided.
On Android, if no album is provided, DCIM directory is used, otherwise PICTURE or MOVIES directory is used depending on the `type` provided.

Returns a Promise which will resolve with the new URI.

**Parameters:**

| Name | Type                   | Required | Description                                                |
| ---- | ---------------------- | -------- | ---------------------------------------------------------- |
| tag  | string                 | Yes      | See above.                                                 |
| type | enum('photo', 'video') | Yes       | See |
| album | string                | No       | The album to save to |

---
### `getAlbums()`

```javascript
PhotoGallery.getAlbums(params);
```
Returns a Promise with a list of albums

**Parameters:**

* `assetType` : {string} : Specifies filter on asset type. Valid values are:
  * `All` // default
  * `Videos`
  * `Photos`

**Returns:**

Array of `Album` object
  * title: {string}
  * count: {number}

---

### `getPhotos()`

```javascript
PhotoGallery.getPhotos(params);
```

Returns a Promise with photo identifier objects from the local camera roll of the device matching shape defined by `getPhotosReturnChecker`.

**Parameters:**

| Name   | Type   | Required | Description                                      |
| ------ | ------ | -------- | ------------------------------------------------ |
| params | object | Yes      | Expects a params with the shape described below. |

* `first` : {number} : The number of photos wanted in reverse order of the photo application (i.e. most recent first for SavedPhotos). Required.
* `after` : {string} : A cursor that matches `page_info { end_cursor }` returned from a previous call to `getPhotos`. Note that using this will reduce performance slightly on iOS. An alternative is just using the `fromTime` and `toTime` filters, which have no such impact.
* `groupTypes` : {string} : Specifies which group types to filter the results to. Valid values are:
  * `Album`
  * `All` // default
  * `Event`
  * `Faces`
  * `Library`
  * `PhotoStream`
  * `SavedPhotos`
* `groupName` : {string} : Specifies filter on group names, like 'Recent Photos' or custom album titles.
* `assetType` : {string} : Specifies filter on asset type. Valid values are:
  * `All`
  * `Videos`
  * `Photos` // default
* `mimeTypes` : {Array} : Filter by mimetype (e.g. image/jpeg). Note that using this will reduce performance slightly on iOS.
* `fromTime` : {number} : Filter by creation time with a timestamp in milliseconds. This time is exclusive, so we'll select all photos with `timestamp > fromTime`.
* `toTime` : {number} : Filter by creation time with a timestamp in milliseconds. This time is inclusive, so we'll select all photos with `timestamp <= toTime`.
* `include` : {Array} : Whether to include some fields that are slower to fetch
  * `filename` : Ensures `image.filename` is available in each node. This has a large performance impact on iOS.
  * `fileSize` : Ensures `image.fileSize` is available in each node. This has a large performance impact on iOS.
  * `location`: Ensures `location` is available in each node. This has a large performance impact on Android.
  * `imageSize` : Ensures `image.width` and `image.height` are available in each node. This has a small performance impact on Android.
  * `playableDuration` : Ensures `image.playableDuration` is available in each node. This has a medium peformance impact on Android.

Returns a Promise which when resolved will be of the following shape:

* `edges` : {Array<node>} An array of node objects
  * `node`: {object} An object with the following shape:
    * `type`: {string}
    * `group_name`: {string}
    * `image`: {object} : An object with the following shape:
      * `uri`: {string}
      * `filename`: {string | null} : Only set if the `include` parameter contains `filename`
      * `height`: {number | null} : Only set if the `include` parameter contains `imageSize`
      * `width`: {number | null} : Only set if the `include` parameter contains `imageSize`
      * `fileSize`: {number | null} : Only set if the `include` parameter contains `fileSize`
      * `playableDuration`: {number | null} : Only set for videos if the `include` parameter contains `playableDuration`. Will be null for images.
    * `timestamp`: {number}
    * `location`: {object | null} : Only set if the `include` parameter contains `location`. An object with the following shape:
      * `latitude`: {number}
      * `longitude`: {number}
      * `altitude`: {number}
      * `heading`: {number}
      * `speed`: {number}
* `page_info` : {object} : An object with the following shape:
  * `has_next_page`: {boolean}
  * `start_cursor`: {string}
  * `end_cursor`: {string}
* `limited` : {boolean | undefined} : true if the app can only access a subset of the gallery pictures (authorization is `PHAuthorizationStatusLimited`), false otherwise (iOS only)

### `iosGetImageDataById()`
```javascript
PhotoGallery.iosGetImageDataById(internalID, true);
```

Returns a Promise which when resolved will be of the following shape:

* `node`: {object} An object with the following shape:
  * `type`: {string}
  * `group_name`: {string}
  * `image`: {object} : An object with the following shape:
    * `uri`: {string}
    * `filePath`: {string}
    * `filename`: {string | null} : Only set if the `include` parameter contains `filename`
    * `height`: {number | null} : Only set if the `include` parameter contains `imageSize`
    * `width`: {number | null} : Only set if the `include` parameter contains `imageSize`
    * `fileSize`: {number | null} : Only set if the `include` parameter contains `fileSize`
    * `playableDuration`: {number | null} : Only set for videos if the `include` parameter contains `playableDuration`. Will be null for images.
  * `timestamp`: {number}
  * `location`: {object | null} : Only set if the `include` parameter contains `location`. An object with the following shape:
    * `latitude`: {number}
    * `longitude`: {number}
    * `altitude`: {number}
    * `heading`: {number}
    * `speed`: {number}

second Parameters is Boolean to tell whether to convert HEIC images to JPEG in order to send to back-end.

Returns a Promise with photo identifier objects from the local camera roll of the device matching shape defined by `getPhotosReturnChecker`.

## Usage

### Examples

1. this library offers handling permission request and reading for IOS
```javascript
import { useCallback, useEffect, useState } from 'react';
import { AppState, PermissionsAndroid } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {
  AccessLevel,
  iosReadGalleryPermission,
  iosRequestAddOnlyGalleryPermission,
  iosRequestReadWriteGalleryPermission,
} from 'react-native-photo-gallery-api';

import { GalleryScreenProps } from 'src/Router/types.router';
import { PhotoLibraryAuthorizationStatus, isAndroid, isIOS } from 'src/Shared/Constants';

interface Props {
  autoRequestPermission: boolean;
}

export const useGalleryPermission = ({ autoRequestPermission }: Props) => {
  const [readPermissionStatus, setReadPermissionStatus] = useState<PhotoLibraryAuthorizationStatus>();
  const [writePermissionStatus, setWritePermissionStatus] = useState<PhotoLibraryAuthorizationStatus>();
  const [isLoading, setIsLoading] = useState(false);
  const { addListener } = useNavigation<GalleryScreenProps['navigation']>();

  const checkIosGalleryPermission = useCallback(async () => {
    try {
      const actualPermission = await iosReadGalleryPermission(AccessLevel.ReadWrite);
      setReadPermissionStatus(actualPermission);
      const actualWritePermission = await iosReadGalleryPermission(AccessLevel.AddOnly);
      setWritePermissionStatus(actualWritePermission);
    } catch (error) {
      console.error("[Gallery][Permission] can't read actual permission");
    }
  }, []);

  const checkAndroidGalleryReadAndWritePermissions = useCallback(async () => {
    const isReadPermissionGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    const isWritePermissionGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    setReadPermissionStatus(
      isReadPermissionGranted ? PhotoLibraryAuthorizationStatus.Granted : PhotoLibraryAuthorizationStatus.Denied
    );
    setWritePermissionStatus(
      isWritePermissionGranted ? PhotoLibraryAuthorizationStatus.Granted : PhotoLibraryAuthorizationStatus.Denied
    );
  }, []);

  const requestAndroidGalleryReadPermission = useCallback(async () => {
    const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    const status = await PermissionsAndroid.request(permission);
    if (status === 'granted') {
      setReadPermissionStatus(PhotoLibraryAuthorizationStatus.Granted);
    } else {
      setReadPermissionStatus(PhotoLibraryAuthorizationStatus.Denied);
    }
  }, []);

  const requestAndroidGalleryWritePermission = useCallback(async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    setIsLoading(true);
    const status = await PermissionsAndroid.request(permission);
    setIsLoading(false);
    if (status === 'granted') {
      setWritePermissionStatus(PhotoLibraryAuthorizationStatus.Granted);
      return PhotoLibraryAuthorizationStatus.Granted;
    } else {
      setWritePermissionStatus(PhotoLibraryAuthorizationStatus.Denied);
      return PhotoLibraryAuthorizationStatus.Denied;
    }
  }, []);

  const refreshPermissions = useCallback(async () => {
    setIsLoading(true);
    isIOS ? await checkIosGalleryPermission() : await checkAndroidGalleryReadAndWritePermissions();
    setIsLoading(false);
  }, [checkAndroidGalleryReadAndWritePermissions, checkIosGalleryPermission]);

  const initPermissions = useCallback(async () => {
    setIsLoading(true);
    isIOS ? await checkIosGalleryPermission() : await requestAndroidGalleryReadPermission();
    setIsLoading(false);
  }, [requestAndroidGalleryReadPermission, checkIosGalleryPermission]);

  const requestIOSFullPermission = useCallback(async () => {
    try {
      setIsLoading(true);
      const newPermission = await iosRequestReadWriteGalleryPermission();
      setReadPermissionStatus(newPermission);
      setWritePermissionStatus(newPermission);
    } catch (error) {
      console.error("[Gallery][Permission] can't request camera roll permission");
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
      console.error("[Gallery][Permission] can't request camera roll write permission");
      return PhotoLibraryAuthorizationStatus.Denied;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestGalleryWritePermission = useCallback(async () => {
    return isAndroid ? await requestAndroidGalleryWritePermission() : await requestIOSWritePermission();
  }, [requestAndroidGalleryWritePermission, requestIOSWritePermission]);

  useEffect(() => {
    let unsubscribe: () => void | undefined;
    if (autoRequestPermission) {
      unsubscribe = addListener('transitionEnd', async () => {
        if (!readPermissionStatus && !isLoading && autoRequestPermission) {
          await initPermissions();
        }
      });
    }

    return () => {
      unsubscribe?.();
    };
  }, [addListener, autoRequestPermission, initPermissions, isLoading, readPermissionStatus]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        await refreshPermissions();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refreshPermissions]);

  useEffect(() => {
    if (
      isIOS &&
      autoRequestPermission &&
      !!readPermissionStatus &&
      readPermissionStatus === PhotoLibraryAuthorizationStatus.NotDetermined &&
      !isLoading
    ) {
      requestIOSFullPermission();
    }
  }, [autoRequestPermission, isLoading, readPermissionStatus, requestIOSFullPermission]);

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


```


### Photo Access
```javascript
import { PhotoGallery } from 'react-native-photo-gallery-api';

import { useCallback, useEffect, useState } from 'react';

import { AppState, EmitterSubscription } from 'react-native';

import { ImageDTO, isAboveIOS14, isAndroid } from 'src/Shared/Constants';
import { convertCameraRollPicturesToImageDtoType, photoLibraryEventEmitter } from 'src/Shared/Utils';

interface GalleryOptions {
  pageSize: number;
  mimeTypeFilter?: Array<string>;
}

interface GalleryLogic {
  photos?: ImageDTO[];
  loadNextPagePictures: () => void;
  isLoading: boolean;
  isLoadingNextPage: boolean;
  isReloading: boolean;
  hasNextPage: boolean;
}

const supportedMimeTypesByTheBackEnd = [
  'image/jpeg',
  'image/png',
  'image/heif',
  'image/heic',
  'image/heif-sequence',
  'image/heic-sequence',
];

export const useGallery = ({
  pageSize = 30,
  mimeTypeFilter = supportedMimeTypesByTheBackEnd,
}: GalleryOptions): GalleryLogic => {
  const [isLoading, setIsLoading] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<string>();
  const [photos, setPhotos] = useState<ImageDTO[]>();

  const loadNextPagePictures = useCallback(async () => {
    try {
      nextCursor ? setIsLoadingNextPage(true) : setIsLoading(true);
      const { edges, page_info } = await PhotoGallery.getPhotos({
        first: pageSize,
        after: nextCursor,
        assetType: 'Photos',
        mimeTypes: mimeTypeFilter,
        ...(isAndroid && { include: ['fileSize', 'filename'] }),
      });
      const photos = convertCameraRollPicturesToImageDtoType(edges);
      setPhotos((prev) => [...(prev ?? []), ...photos]);

      setNextCursor(page_info.end_cursor);
      setHasNextPage(page_info.has_next_page);
    } catch (error) {
      console.error('useGallery getPhotos error:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingNextPage(false);
    }
  }, [mimeTypeFilter, nextCursor, pageSize]);

  const getUnloadedPictures = useCallback(async () => {
    try {
      setIsReloading(true);
      const { edges, page_info } = await PhotoGallery.getPhotos({
        first: !photos || photos.length < pageSize ? pageSize : photos.length,
        assetType: 'Photos',
        mimeTypes: mimeTypeFilter,
        // Include fileSize only for android since it's causing performance issues on IOS.
        ...(isAndroid && { include: ['fileSize', 'filename'] }),
      });
      const newPhotos = convertCameraRollPicturesToImageDtoType(edges);
      setPhotos(newPhotos);

      setNextCursor(page_info.end_cursor);
      setHasNextPage(page_info.has_next_page);
    } catch (error) {
      console.error('useGallery getNewPhotos error:', error);
    } finally {
      setIsReloading(false);
    }
  }, [mimeTypeFilter, pageSize, photos]);

  useEffect(() => {
    if (!photos) {
      loadNextPagePictures();
    }
  }, [loadNextPagePictures, photos]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        getUnloadedPictures();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [getUnloadedPictures]);

  useEffect(() => {
    let subscription: EmitterSubscription;
    if (isAboveIOS14) {
      subscription = photoLibraryEventEmitter.addListener('onLibrarySelectionChange', (_event) => {
        getUnloadedPictures();
      });
    }

    return () => {
      if (isAboveIOS14 && subscription) {
        subscription.remove();
      }
    };
  }, [getUnloadedPictures]);

  return {
    photos,
    loadNextPagePictures,
    isLoading,
    isLoadingNextPage,
    isReloading,
    hasNextPage,
  };
};
```

### Upload images to back-end side

```javascript
import { useCallback } from 'react';
import { PixelRatio } from 'react-native';

import { ImageData, MessageImage } from 'src/Shared/Api';

import { ApplicationError, SupportedImagesMimeTypes, extensionMimeTypes, isIOS } from 'src/Shared/Constants';
import { PhotoGallery } from 'src/Shared/NativeModules';
import { getFileInfoFromPath, simpleHash } from 'src/Shared/Utils';

import { useScreenDimensionsInfos } from '../UI';
import { useImagesConfig } from './useImagesConfig';

export interface ResizeImageParams {
  originalImage: ImageData;
  maxWidth?: number;
  maxHeight?: number;
  maxFileSize?: number;
}
export interface CachedImage {
  originalImage: ImageData;
  cachedImagePath: string;
  mimeType: SupportedImagesMimeTypes;
  fileName: string;
}

export interface ImageToolsLogic {
  resizeAndCacheLocalImage: (props: ResizeImageParams) => Promise<CachedImage>;
  removeLocalCachedImage: (originalImage: MessageImage) => Promise<void>;
  isResizingRequired: (image: ImageData) => Promise<boolean>;
  prepareImageForAPI: (selectedImage: ImageData) => Promise<CachedImage>;
}

const MB = Math.pow(1024, 2);

export const useImageTools = (): ImageToolsLogic => {
  const { screenWidth, screenHeight } = useScreenDimensionsInfos();
  const { imagesConfig } = useImagesConfig();

  const ratio = PixelRatio.get();

  const constructCachedFileName = useCallback((path: string) => {
    const fileInfo = getFileInfoFromPath(path);
    return `IMG_${simpleHash(path)}.${fileInfo.fileExtension}`;
  }, []);

  const constructCachedFilePath = useCallback(
    (cachedFileName: string) => `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${cachedFileName}`,
    []
  );

  const isExtensionSupportedForResizing = useCallback((extension: string) => {
    return ['PNG', 'JPEG', 'WEBP'].includes(extension.toUpperCase());
  }, []);

  const constructFileInfoForDownload = useCallback((filePath: string) => {
    let fileInfo = getFileInfoFromPath(filePath);
    // Convert file format.
    if (fileInfo.fileExtension?.toUpperCase() === 'JPG') {
      fileInfo = {
        ...fileInfo,
        fileExtension: 'JPEG',
      };
    }
    return fileInfo;
  }, []);

  const isResizingRequired = useCallback(
    async (image: ImageData) => {
      if (image?.originalFileSize) {
        return image.originalFileSize / MB > imagesConfig.maximum_allowed_image_file_size;
      } else if (!image.originalPath.startsWith('ph://')) {
        // read file stats
        const stat = await ReactNativeBlobUtil.fs.stat(image.originalPath);
        return stat.size / MB > imagesConfig.maximum_allowed_image_file_size;
      } else {
        throw new ApplicationError('[ImageTool] can not read information of ph file');
      }
    },
    [imagesConfig.maximum_allowed_image_file_size]
  );

  const resizeAndCacheLocalImage = useCallback(
    async ({
      maxWidth = screenWidth * ratio,
      maxHeight = screenHeight * ratio,
      originalImage,
    }: ResizeImageParams): Promise<CachedImage> => {
      const fileInfo = constructFileInfoForDownload(originalImage.originalPath);

      if (fileInfo.fileExtension && isExtensionSupportedForResizing(fileInfo.fileExtension)) {
        const outputFileName = constructCachedFileName(originalImage.originalPath);
        const outputFilePath = constructCachedFilePath(outputFileName);

        const isFileAlreadyCached = await ReactNativeBlobUtil.fs.exists(outputFilePath);
        if (!isFileAlreadyCached) {
          const resized = await ImageResizer.createResizedImage(
            originalImage.originalPath,
            maxWidth,
            maxHeight,
            fileInfo.fileExtension as ResizeFormat,
            75 /* quality */,
            0,
            outputFilePath.replace(outputFileName, ''), // does not work with file path, only directory path
            false,
            {
              onlyScaleDown: true,
              mode: 'contain',
            }
          );

          // rename to expected file name
          await ReactNativeBlobUtil.fs.mv(resized.path, outputFilePath);
        }

        return {
          originalImage: originalImage,
          cachedImagePath: `file://${outputFilePath}`,
          mimeType: extensionMimeTypes.get(fileInfo?.fileExtension?.toUpperCase() ?? 'JPEG') ?? 'image/jpeg',
          fileName: originalImage.originalFileName ?? '',
        };
      } else {
        // we can't resize all file format
        console.error('[ImageResizer] Image extension is not resizable', fileInfo.fileExtension);
        throw new ApplicationError('Image extension is not resizable');
      }
    },
    [
      screenWidth,
      ratio,
      screenHeight,
      constructFileInfoForDownload,
      isExtensionSupportedForResizing,
      constructCachedFileName,
      constructCachedFilePath,
    ]
  );

  const removeLocalCachedImage = useCallback(
    async (originalImage: MessageImage) => {
      try {
        const outputFileName = constructCachedFileName(originalImage.originalPath);
        const outputFilePath = constructCachedFilePath(outputFileName);
        if (originalImage.uri && (await ReactNativeBlobUtil.fs.exists(outputFilePath))) {
          await ReactNativeBlobUtil.fs.unlink(outputFilePath);
        }
      } catch (e) {
        console.error('[ImageResizer] remove image from local cache failed', e);
      }
    },
    [constructCachedFileName, constructCachedFilePath]
  );

  const constructImageData = useCallback(async (selectedImage: ImageData) => {
    if (isIOS) {
      try {
        const extractedImage = await PhotoGallery.iosGetImageDataById(selectedImage.originalPath, true);
        if (extractedImage.node.image.filepath) {
          const fileInfo = getFileInfoFromPath(extractedImage.node.image.filepath);
          return {
            originalPath: extractedImage.node.image.filepath.startsWith('file://')
              ? extractedImage.node.image.filepath
              : `file://${extractedImage.node.image.filepath}`,
            originalFileName: extractedImage.node.image.filename,
            originalFileSize: extractedImage.node.image.fileSize,
            mimeType: extensionMimeTypes.get(fileInfo?.fileExtension?.toUpperCase() ?? 'JPEG') ?? 'image/jpeg',
          };
        } else {
          throw new ApplicationError('[IOS] [File extraction] Extracted does not contain file path');
        }
      } catch (e) {
        throw new ApplicationError('[IOS] [File extraction] unable to extract image original path');
      }
    }
    const fileInfo = getFileInfoFromPath(selectedImage.originalPath);
    return {
      ...selectedImage,
      mimeType: extensionMimeTypes.get(fileInfo?.fileExtension?.toUpperCase() ?? 'JPEG') ?? 'image/jpeg',
    };
  }, []);

  const prepareImageForAPI = useCallback(
    async (selectedImage: ImageData): Promise<CachedImage> => {
      try {
        const imageData = await constructImageData(selectedImage);
        const isResizingNeeded = await isResizingRequired(imageData);

        // Check if resizing needed
        if (isResizingNeeded) {
          // resize the image.
          return await resizeAndCacheLocalImage({
            originalImage: imageData,
          });
        } else {
          return {
            originalImage: selectedImage,
            cachedImagePath: imageData.originalPath,
            mimeType: imageData?.mimeType ?? 'image/jpeg',
            fileName: imageData?.originalFileName ?? '',
          };
        }
      } catch (e) {
        console.error('[Image] [Inti Object] error while preparing image for sending', e, selectedImage);
        throw e;
      }
    },
    [constructImageData, isResizingRequired, resizeAndCacheLocalImage]
  );

  return {
    resizeAndCacheLocalImage,
    removeLocalCachedImage,
    isResizingRequired,
    prepareImageForAPI,
  };
};

```

### Known issues

#### IOS

If you try to save media into specific album without asking for read and write permission then saving will not work, workaround is to not precice album name for IOS if you don't want to request full permission (Only ios >= 14).
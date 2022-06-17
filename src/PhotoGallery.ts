import { NativeModules, Platform } from 'react-native';

export type AssetType = 'All' | 'Videos' | 'Photos';

export type GroupTypes = 'Album' | 'All' | 'Event' | 'Faces' | 'Library' | 'PhotoStream' | 'SavedPhotos';

export type Include = 'filename' | 'fileSize' | 'location' | 'imageSize' | 'playableDuration';

/** Shape of the param arg for the `getPhotos` function. */
export type GetPhotosParams = {
  /** The number of photos wanted in reverse order of the photo application (i.e. most recent first). */
  first: number;

  /** A cursor that matches `page_info { end_cursor }` returned from a previous call to `getPhotos` */
  after?: string;

  /** Specifies which group types to filter the results to. */
  groupTypes?: GroupTypes;

  /** Specifies filter on group names, like 'Recent Photos' or custom album titles. */
  groupName?: string;

  /** Specifies filter on asset type */
  assetType?: AssetType;

  /** Earliest time to get photos from. A timestamp in milliseconds. Exclusive. */
  fromTime?: number;

  /** Latest time to get photos from. A timestamp in milliseconds. Inclusive. */
  toTime?: number;

  /** Filter by mimetype (e.g. image/jpeg). */
  mimeTypes?: Array<string>;

  /** Specific fields in the output that we want to include, even though they might have some performance impact. */
  include?: Include[];
};

export type PhotoIdentifier = {
  node: {
    type: string;
    group_name: string;
    image: {
      filename?: string;
      uri: string;
      height: number;
      width: number;
      fileSize?: number;
      playableDuration: number;
      filepath?: string;
    };
    timestamp: number;
    location: {
      latitude?: number;
      longitude?: number;
      altitude?: number;
      heading?: number;
      speed?: number;
    } | null;
  };
};

export type PhotoIdentifiersPage = {
  edges: Array<PhotoIdentifier>;
  page_info: {
    has_next_page: boolean;
    start_cursor?: string;
    end_cursor?: string;
  };
};

export type SaveToCameraRollOptions = {
  type: 'photo' | 'video';
  album?: string;
};

export interface GetAlbumsParams {
  assetType?: AssetType;
}

export interface Album {
  title: string;
  count: number;
}

export interface PhotoConvertionOptions {
  convertHeicImages: boolean;
}

interface PhotoGalleryInterface {
  saveToCameraRoll: (tag: string, options?: SaveToCameraRollOptions) => Promise<string>;
  getPhotos: (params: GetPhotosParams) => Promise<PhotoIdentifiersPage>;
  deletePhotos: (photoUris: Array<string>) => void;
  getAlbums(params: GetAlbumsParams): Promise<Album[]>;
  getPhotoByInternalID(internalID: string, options?: PhotoConvertionOptions): Promise<PhotoIdentifier>;
}

const PhotoGalleryModule = NativeModules.RNPhotoGallery as PhotoGalleryInterface;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (PhotoGalleryModule == null) console.error("PhotoGallery: Native Module 'PhotoGalleryModule' was null! Did you run pod install?");
export class PhotoGallery {
  static deletePhotos(photoUris: Array<string>): void {
    return PhotoGalleryModule.deletePhotos(photoUris);
  }

  static saveToCameraRoll(tag: string, options: SaveToCameraRollOptions): Promise<string> {
    const { type = 'photo', album = '' } = options;
    if (tag === '') throw new Error('tag must be a valid string');

    return PhotoGalleryModule.saveToCameraRoll(tag, { type, album });
  }

  static getAlbums(params: GetAlbumsParams = { assetType: 'All' }): Promise<Album[]> {
    return PhotoGalleryModule.getAlbums(params);
  }

  static getPhotos(params: GetPhotosParams): Promise<PhotoIdentifiersPage> {
    params = this.getParamsWithDefaults(params);
    return PhotoGalleryModule.getPhotos(params);
  }

  static iosGetImageDataById(internalID: string, convertHeicImages?: boolean): Promise<PhotoIdentifier> {
    const conversionOption: PhotoConvertionOptions = { convertHeicImages: convertHeicImages ?? false };
    return PhotoGalleryModule.getPhotoByInternalID(internalID, conversionOption);
  }

  static getParamsWithDefaults(params: GetPhotosParams): GetPhotosParams {
    const newParams = { ...params };
    if (newParams.assetType === undefined) newParams.assetType = 'All';

    if (newParams.groupTypes === undefined && Platform.OS !== 'android') newParams.groupTypes = 'All';

    return newParams;
  }
}

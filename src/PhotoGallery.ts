import {Platform, NativeModules} from 'react-native';

export type AssetType = 'All' | 'Videos' | 'Photos';

export type GroupTypes =
  | 'Album'
  | 'All'
  | 'Event'
  | 'Faces'
  | 'Library'
  | 'PhotoStream'
  | 'SavedPhotos';

export type Include =
  | 'filename'
  | 'fileSize'
  | 'location'
  | 'imageSize'
  | 'playableDuration';

/**
 * Shape of the param arg for the `getPhotos` function.
 */
export type GetPhotosParams = {
  /**
   * The number of photos wanted in reverse order of the photo application
   * (i.e. most recent first).
   */
  first: number;

  /**
   * A cursor that matches `page_info { end_cursor }` returned from a previous
   * call to `getPhotos`
   */
  after?: string;

  /**
   * Specifies which group types to filter the results to.
   */
  groupTypes?: GroupTypes;

  /**
   * Specifies filter on group names, like 'Recent Photos' or custom album
   * titles.
   */
  groupName?: string;

  /**
   * Specifies filter on asset type
   */
  assetType?: AssetType;

  /**
   * Earliest time to get photos from. A timestamp in milliseconds. Exclusive.
   */
  fromTime?: number;

  /**
   * Latest time to get photos from. A timestamp in milliseconds. Inclusive.
   */
  toTime?: Number;

  /**
   * Filter by mimetype (e.g. image/jpeg).
   */
  mimeTypes?: Array<string>;

  /**
   * Specific fields in the output that we want to include, even though they
   * might have some performance impact.
   */
  include?: Include[];
};

export type PhotoIdentifier = {
  node: {
    type: string;
    group_name: string;
    image: {
      filename: string | null;
      uri: string;
      height: number;
      width: number;
      fileSize: number | null;
      playableDuration: number;
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
  limited?: boolean;
};

export type SaveToCameraRollOptions = {
  type?: 'photo' | 'video' | 'auto';
  album?: string;
};

export type GetAlbumsParams = {
  assetType?: AssetType;
};

export type Album = {
  title: string;
  count: number;
};

export interface PhotoGalleryInterface {
  saveToCameraRoll: (
    tag: string,
    options?: SaveToCameraRollOptions,
  ) => Promise<string>;
  getPhotos: (params: GetPhotosParams) => Promise<PhotoIdentifiersPage>;
  deletePhotos: (photoUris: Array<string>) => void;
  getAlbums(params: GetAlbumsParams): Promise<Album[]>;
}

export const PhotoGalleryModule =
  NativeModules.PhotoGalleryModule as PhotoGalleryInterface;

class PhotoGallery {
  static deletePhotos(photoUris: Array<string>) {
    return PhotoGalleryModule.deletePhotos(photoUris);
  }

  static saveToCameraRoll(
    tag: string,
    options: SaveToCameraRollOptions,
  ): Promise<string> {
    let {type = 'auto', album = ''} = options;
    if (tag === '') {
      throw new Error('tag must be a valid string');
    }
    if (type === 'auto') {
      if (['mov', 'mp4'].indexOf(tag.split('.').slice(-1)[0]) >= 0) {
        type = 'video';
      } else {
        type = 'photo';
      }
    }
    return PhotoGalleryModule.saveToCameraRoll(tag, {type, album});
  }
  static getAlbums(
    params: GetAlbumsParams = {assetType: 'All'},
  ): Promise<Album[]> {
    return PhotoGalleryModule.getAlbums(params);
  }
  static getParamsWithDefaults(params: GetPhotosParams): GetPhotosParams {
    const newParams = {...params};
    if (!newParams.assetType) {
      newParams.assetType = 'All';
    }
    if (!newParams.groupTypes && Platform.OS !== 'android') {
      newParams.groupTypes = 'All';
    }
    return newParams;
  }

  static getPhotos(params: GetPhotosParams): Promise<PhotoIdentifiersPage> {
    params = PhotoGallery.getParamsWithDefaults(params);
    return PhotoGalleryModule.getPhotos(params);
  }
}

module.exports = PhotoGallery;

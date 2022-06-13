#import <AVFoundation/AVFoundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <Photos/Photos.h>

typedef enum
{
  RNPermissionStatusNotDetermined = 0,
  RNPermissionStatusRestricted = 1,
  RNPermissionStatusDenied = 2,
  RNPermissionStatusAuthorized = 3,
  RNPermissionStatusLimited = 4,
} RNPermissionStatus;

@interface PhotoGalleryPermissionModule : RCTEventEmitter <RCTBridgeModule, PHPhotoLibraryChangeObserver>

@end

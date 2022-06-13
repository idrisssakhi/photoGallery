#import <Photos/Photos.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>

@interface RCTConvert (PHFetchOptions)

+ (PHFetchOptions *)PHFetchOptionsFromMediaType:(NSString *)mediaType
                                       fromTime:(NSUInteger)fromTime
                                         toTime:(NSUInteger)toTime;

@end

@interface RNPhotoGallery : NSObject <RCTBridgeModule>

@end


package com.photoGallery;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class RNPhotoGalleryModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNPhotoGalleryModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNPhotoGallery";
  }
}
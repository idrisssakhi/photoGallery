
# react-native-photo-gallery

## Getting started

`$ npm install react-native-photo-gallery --save`

### Mostly automatic installation

`$ react-native link react-native-photo-gallery`

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

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNPhotoGallery.sln` in `node_modules/react-native-photo-gallery/windows/RNPhotoGallery.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Photo.Gallery.RNPhotoGallery;` to the usings at the top of the file
  - Add `new RNPhotoGalleryPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNPhotoGallery from 'react-native-photo-gallery';

// TODO: What to do with the module?
RNPhotoGallery;
```
  
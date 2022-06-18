import {Platform} from 'react-native';

export const isAndroid = Platform.OS === 'android';
export const isAndroid6 = isAndroid && Platform.Version === 23;
export const isAndroid8 =
  isAndroid && (Platform.Version === 26 || Platform.Version === 27);
export const isAboveAndroid10 = isAndroid && Platform.Version >= 29;

export const isIOS = Platform.OS === 'ios';
export const isIOS11 = isIOS && parseInt(Platform.Version as string, 10) === 11;
export const isIOS12 = isIOS && parseInt(Platform.Version as string, 10) === 12;
export const isAboveIOS14 =
  isIOS && parseInt(Platform.Version as string, 10) >= 14;

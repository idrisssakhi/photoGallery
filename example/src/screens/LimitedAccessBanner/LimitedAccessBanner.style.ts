import { StyleSheet } from 'react-native';
import { style } from '../../utils';


export const styles = StyleSheet.create({
  limitedPhotoManagerContainer: style.view({
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
  }),
  limitedPhotoManagerText: style.view({
    maxWidth: '74%',
  }),
});

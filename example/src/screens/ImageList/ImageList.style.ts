import { StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { style } from '../../utils';

export const styles = StyleSheet.create({
  content: style.view({
    flexGrow: 1,
    paddingHorizontal: 8,
  }),
  row: style.view({
    marginBottom: 5,
  }),
  listFooterPlaceholder: style.view({
    paddingBottom: 76,
  }),
  loader: style.view({
    marginTop: 16,
    alignItems: 'center',
    marginBottom: 24,
  }),
  selectButton: style.view({
    marginTop: 0,
    marginHorizontal: 0,
    width: '100%',
  }),
  selectButtonText: style.text({
    color: Colors.White,
  }),
});

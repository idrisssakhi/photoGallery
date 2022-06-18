import { StyleSheet } from 'react-native';
import { style } from '../../utils';


export const styles = StyleSheet.create({
  container: style.image({
    borderRadius: 4,
    marginRight: 5,
    resizeMode: 'cover',
  }),
  leftTopRounded: style.image({
    borderTopLeftRadius: 16,
  }),
  rightTopRounded: style.image({
    borderTopRightRadius: 16,
  }),
  leftBottomRounded: style.image({
    borderBottomLeftRadius: 16,
  }),
  rightBottomRounded: style.image({
    borderBottomRightRadius: 16,
  }),
  rightSideRounded: style.image({
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  }),
  bottomSideRounded: style.image({
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  }),
  badge: style.view({
    width: 24,
    height: 24,
    position: 'absolute',
    top: 8,
    right: 13,
    borderRadius: 12,
  }),
  nonSelectedBadge: style.view({
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'grey',
  }),
  selectedBadge: style.view({
    backgroundColor: 'blue',
  }),
});

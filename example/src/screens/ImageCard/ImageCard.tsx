import React from 'react';
import {memo} from 'react';

import {Image} from 'react-native';
import type { ImageDTO } from '../../utils';


import {styles} from './ImageCard.style';

interface Props {
  image: ImageDTO;
  sideLength: number;
}

export const ImageCard = memo(
  ({image, sideLength: sizeLength}: Props): JSX.Element => 
     (
      <>
        <Image
          source={{uri: image.url, cache: 'force-cache'}}
          style={[styles.container, {width: sizeLength, height: sizeLength}]}
        />
      </>
    )
);

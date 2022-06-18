import React from 'react';
import {useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  ListRenderItemInfo,
  FlatList
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useGallery } from '../../hooks';
import type { ImageDTO } from '../../utils';

import {ImageCard} from '../ImageCard/ImageCard';
import {LimitedAccessBanner} from '../LimitedAccessBanner/LimitedAccessBanner';
import {styles} from './ImageList.style';

interface Props {
  cardSideLength: number;
  numColumns: number;
  isLimitedPhotosSelected?: boolean;
}

export const ImageList = ({
  cardSideLength,
  numColumns,
  isLimitedPhotosSelected = false,
}: Props) => {
  const pageSize = useMemo(() => numColumns * 10 - 1, [numColumns]);

  const {
    photos,
    loadNextPagePictures,
    hasNextPage,
    isLoadingNextPage,
    isLoading,
  } = useGallery({
    pageSize,
  });

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<ImageDTO>) => {
      return (
        <ImageCard image={item} sideLength={cardSideLength} key={item.url} />
      );
    },
    [cardSideLength],
  );

  const onEndReached = useCallback(
    () => (hasNextPage && !isLoadingNextPage ? loadNextPagePictures() : null),
    [hasNextPage, isLoadingNextPage, loadNextPagePictures],
  );

  const extraPadding = {
    paddingTop: isLimitedPhotosSelected ? 8 : 68,
  };

  return (
    <>
      {isLimitedPhotosSelected && <LimitedAccessBanner />}
      <FlatList
        contentContainerStyle={[
          styles.content,
          !isLoadingNextPage && styles.listFooterPlaceholder,
          extraPadding,
        ]}
        columnWrapperStyle={styles.row}
        data={photos}
        renderItem={renderItem}
        numColumns={numColumns}
        onEndReachedThreshold={0.01}
        onEndReached={onEndReached}
        ListFooterComponent={
          isLoading || isLoadingNextPage ? (
            <ActivityIndicator
              size="large"
              color={Colors.blue}
              style={styles.loader}
            />
          ) : null
        }
      />
    </>
  );
};

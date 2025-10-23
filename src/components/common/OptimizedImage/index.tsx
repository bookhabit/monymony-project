import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

import {
  Image as ExpoImage,
  ImageProps as ExpoImageProps,
  ImageStyle,
} from 'expo-image';

import { useTheme } from '@/context/ThemeProvider';

import { Skeleton } from '../Skeleton';
import TextBox from '../TextBox';

interface OptimizedImageProps extends Omit<ExpoImageProps, 'placeholder'> {
  /** 이미지 소스 */
  source: ExpoImageProps['source'];
  /** 로딩 플레이스홀더 표시 */
  showPlaceholder?: boolean;
  /** 에러 시 표시할 컴포넌트 */
  errorComponent?: React.ReactNode;
  /** 컨테이너 스타일 */
  containerStyle?: ViewStyle;
  /** 이미지 비율 (width / height) */
  aspectRatio?: number;
  /** 이미지 스타일 */
  style?: StyleProp<ImageStyle>;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  style,
  showPlaceholder = true,
  errorComponent,
  containerStyle,
  aspectRatio,
  ...props
}) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const imageStyle: StyleProp<ImageStyle> = aspectRatio
    ? [style, { aspectRatio }]
    : style;

  const containerHeight = aspectRatio ? { aspectRatio } : { minHeight: 200 }; // aspectRatio가 없으면 최소 높이 설정

  return (
    <View style={[styles.container, containerStyle, containerHeight]}>
      {/* 로딩 플레이스홀더 */}
      {isLoading && showPlaceholder && (
        <View style={[StyleSheet.absoluteFill, styles.placeholder]}>
          <Skeleton
            width="100%"
            height="100%"
            style={{ width: '100%', height: '100%' }}
            borderRadius={0}
          />
        </View>
      )}

      {/* 에러 상태 */}
      {hasError && (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.errorContainer,
            { backgroundColor: theme.surface },
          ]}
        >
          {errorComponent || (
            <View style={styles.errorContent}>
              <TextBox variant="body6" color={theme.error}>
                ❌
              </TextBox>
              <TextBox variant="caption3" color={theme.textSecondary}>
                이미지를 불러올 수 없습니다
              </TextBox>
            </View>
          )}
        </View>
      )}

      {/* 이미지 */}
      {!hasError && (
        <ExpoImage
          source={source}
          style={imageStyle}
          onLoadStart={handleLoadStart}
          onLoad={handleLoadEnd}
          onError={handleError}
          cachePolicy={'memory-disk'}
          transition={300}
          {...props}
        />
      )}
    </View>
  );
};

// 미리 정의된 이미지 패턴들
export const AvatarImage: React.FC<
  Omit<OptimizedImageProps, 'aspectRatio'>
> = ({ style, ...props }) => {
  return (
    <OptimizedImage
      {...props}
      style={[styles.avatar, style]}
      contentFit="cover"
    />
  );
};

export const ThumbnailImage: React.FC<OptimizedImageProps> = ({
  style,
  aspectRatio = 16 / 9,
  ...props
}) => {
  return (
    <OptimizedImage
      {...props}
      style={[styles.thumbnail, style]}
      aspectRatio={aspectRatio}
      contentFit="cover"
    />
  );
};

export const CoverImage: React.FC<OptimizedImageProps> = ({
  style,
  aspectRatio = 2 / 1,
  ...props
}) => {
  return (
    <OptimizedImage
      {...props}
      style={[styles.cover, style]}
      aspectRatio={aspectRatio}
      contentFit="cover"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContent: {
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  thumbnail: {
    width: '100%',
    borderRadius: 8,
  },
  cover: {
    width: '100%',
    borderRadius: 0,
  },
});

export default OptimizedImage;

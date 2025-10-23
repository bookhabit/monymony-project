import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

interface SkeletonProps {
  /** 너비 */
  width?: number | string;
  /** 높이 */
  height?: number | string;
  /** 원형 여부 */
  circle?: boolean;
  /** 모서리 둥글기 */
  borderRadius?: number;
  /** 추가 스타일 */
  style?: ViewStyle;
  /** 애니메이션 활성화 여부 */
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  circle = false,
  borderRadius = 4,
  style,
  animated = true,
}) => {
  const { isDarkMode } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!animated) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animated, opacity]);

  const skeletonWidth = circle && typeof height === 'number' ? height : width;
  const skeletonHeight = height;
  const skeletonBorderRadius =
    circle && typeof height === 'number' ? height / 2 : borderRadius;

  const backgroundColor = isDarkMode
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.08)';

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: typeof skeletonWidth === 'number' ? skeletonWidth : 0,
          height: typeof skeletonHeight === 'number' ? skeletonHeight : 0,
          borderRadius: skeletonBorderRadius,
          backgroundColor,
          opacity: animated ? opacity : 1,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});

// 미리 정의된 Skeleton 패턴들
export const SkeletonText: React.FC<Omit<SkeletonProps, 'height'>> = (
  props
) => <Skeleton height={16} {...props} />;

export const SkeletonTitle: React.FC<Omit<SkeletonProps, 'height'>> = (
  props
) => <Skeleton height={24} {...props} />;

export const SkeletonAvatar: React.FC<
  Omit<SkeletonProps, 'circle' | 'width' | 'height'>
> = ({ style, ...props }) => (
  <Skeleton circle width={48} height={48} style={style} {...props} />
);

export const SkeletonButton: React.FC<
  Omit<SkeletonProps, 'height' | 'borderRadius'>
> = (props) => <Skeleton height={44} borderRadius={8} {...props} />;

export const SkeletonCard: React.FC<SkeletonProps> = (props) => (
  <View style={listItemStyles.cardContainer}>
    <Skeleton width="100%" height={200} borderRadius={12} {...props} />
  </View>
);

// 복합 Skeleton 레이아웃

const listItemStyles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  listItemContent: {
    flex: 1,
  },
});

Object.assign(styles, listItemStyles);

export default Skeleton;

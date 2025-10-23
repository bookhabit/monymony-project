import React from 'react';
import { Text, TextProps } from 'react-native';

import { FONTS } from '@/constants/fonts';

type VariantKeys =
  | 'title1'
  | 'title2'
  | 'title3'
  | 'title4'
  | 'title5'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'body4'
  | 'body5'
  | 'body6'
  | 'body7'
  | 'button1'
  | 'button2'
  | 'button3'
  | 'button4'
  | 'caption1'
  | 'caption2'
  | 'caption3';

interface TextBoxProps extends TextProps {
  variant?: VariantKeys;
  color?: string;
}

const variantStyles = {
  title1: { fontSize: 26, fontFamily: FONTS.BMJUA },
  title2: { fontSize: 24, fontFamily: FONTS.BMJUA },
  title3: { fontSize: 22, fontFamily: FONTS.BMJUA },
  title4: { fontSize: 20, fontFamily: FONTS.BMJUA },
  title5: { fontSize: 18, fontFamily: FONTS.BMJUA },

  body1: { fontSize: 17, fontFamily: FONTS.PRETENDARD_BOLD },
  body2: { fontSize: 16, fontFamily: FONTS.PRETENDARD_BOLD },
  body3: { fontSize: 15, fontFamily: FONTS.PRETENDARD_REGULAR },
  body4: { fontSize: 14, fontFamily: FONTS.PRETENDARD_REGULAR },
  body5: { fontSize: 14, fontFamily: FONTS.PRETENDARD_LIGHT },
  body6: { fontSize: 13, fontFamily: FONTS.PRETENDARD_LIGHT },
  body7: { fontSize: 12, fontFamily: FONTS.PRETENDARD_LIGHT },

  button1: { fontSize: 18, fontFamily: FONTS.PRETENDARD_BOLD },
  button2: { fontSize: 16, fontFamily: FONTS.PRETENDARD_BOLD },
  button3: { fontSize: 14, fontFamily: FONTS.PRETENDARD_REGULAR },
  button4: { fontSize: 12, fontFamily: FONTS.PRETENDARD_REGULAR },

  caption1: { fontSize: 13, fontFamily: FONTS.ROBOTO_BOLD },
  caption2: { fontSize: 12, fontFamily: FONTS.ROBOTO_REGULAR },
  caption3: { fontSize: 12, fontFamily: FONTS.ROBOTO_LIGHT },
};

// variant와 폰트에 따른 lineHeight 자동 계산
const getLineHeight = (variant: VariantKeys): number => {
  const { fontSize, fontFamily } = variantStyles[variant];

  // variant별 기본 lineHeight 계수
  let baseLineHeightRatio = 1.3; // 기본값

  // variant별 조정
  if (variant.startsWith('title')) {
    baseLineHeightRatio = 1.3; // 제목: 적당한 간격
  } else if (variant.startsWith('body')) {
    baseLineHeightRatio = 1.5; // 본문: 넓게 (가독성 중요)
  } else if (variant.startsWith('button')) {
    baseLineHeightRatio = 1.2; // 버튼: 조밀하게
  } else if (variant.startsWith('caption')) {
    baseLineHeightRatio = 1.4; // 캡션: 적당하게
  }

  // 폰트별 추가 조정
  if (fontFamily === FONTS.BMJUA) {
    // BMJUA는 한글 폰트로 자간이 넓어서 lineHeight를 조금 더 넓게
    baseLineHeightRatio += 0.1;
  } else if (fontFamily.startsWith('Roboto')) {
    // Roboto는 영문 폰트로 lineHeight를 조금 더 넓게
    baseLineHeightRatio += 0.15;
  }

  return fontSize * baseLineHeightRatio;
};

const TextBox: React.FC<TextBoxProps> = ({
  variant = 'body1',
  color,
  style,
  children,
  ...props
}) => {
  // 동적 스타일 계산을 useMemo로 최적화
  const dynamicStyles = React.useMemo(
    () => ({
      ...variantStyles[variant],
      lineHeight: getLineHeight(variant),
      ...(color && { color }),
    }),
    [variant, color]
  );

  return (
    <Text style={[dynamicStyles, style]} {...props}>
      {children}
    </Text>
  );
};

export default TextBox;

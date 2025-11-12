import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode,
} from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

interface BottomSheetOptions {
  content: ReactNode;
  snapPoints?: string[];
  enablePanDownToClose?: boolean;
  onClose?: () => void;
}

interface BottomSheetContextType {
  openBottomSheet: (options: BottomSheetOptions) => void;
  closeBottomSheet: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined
);

/**
 * BottomSheet Provider
 * 전역에서 하나의 Bottom Sheet만 관리하여 여러 곳에서 재사용
 */
export const BottomSheetProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { theme } = useTheme();
  const sheetRef = useRef<BottomSheet>(null);
  const [options, setOptions] = useState<BottomSheetOptions>({
    content: null,
    snapPoints: ['50%'],
    enablePanDownToClose: true,
  });

  // useRef로 onClose 콜백 저장
  const onCloseRef = useRef<(() => void) | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const openBottomSheet = useCallback((newOptions: BottomSheetOptions) => {
    setOptions(newOptions);
    onCloseRef.current = newOptions.onClose;
    // 다음 틱에서 실행하여 컨텐츠 업데이트 후 열기
    setTimeout(() => {
      sheetRef.current?.snapToIndex(0);
    }, 100);
  }, []);

  const closeBottomSheet = useCallback(() => {
    sheetRef.current?.close();
  }, []); // 의존성 없음 -> 절대 재생성 안됨!

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        sheetRef.current?.close();
        return true;
      }
    );

    return () => subscription.remove();
  }, [isOpen]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  const contextValue = useMemo(
    () => ({
      openBottomSheet,
      closeBottomSheet,
    }),
    [openBottomSheet, closeBottomSheet]
  );

  return (
    <BottomSheetContext.Provider value={contextValue}>
      {children}

      {/* 전역 Bottom Sheet - 하나만 존재 */}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={options.snapPoints || ['50%']}
        enablePanDownToClose={options.enablePanDownToClose ?? true}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: theme.surface }}
        handleIndicatorStyle={{ backgroundColor: theme.textSecondary }}
        onChange={(index) => {
          if (index >= 0) {
            setIsOpen(true);
          } else {
            setIsOpen(false);
          }
        }}
        onClose={() => {
          setIsOpen(false);
          onCloseRef.current?.();
          onCloseRef.current = undefined;
        }}
      >
        <BottomSheetView style={styles.sheetContent}>
          {options.content}
        </BottomSheetView>
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

/**
 * Bottom Sheet Hook
 *
 * @example
 * ```tsx
 * const { openBottomSheet, closeBottomSheet } = useBottomSheet();
 *
 * openBottomSheet({
 *   content: <MyContent />,
 *   snapPoints: ['50%', '90%'],
 *   onClose: () => console.log('닫힘'),
 * });
 * ```
 */
export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    padding: 20,
  },
});

export default useBottomSheet;

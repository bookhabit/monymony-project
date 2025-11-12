import React, {
  useState,
  useCallback,
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useRef,
} from 'react';

import TextBox from '@/components/common/TextBox';
import { ImprovedModal } from '@/components/modal/ImprovedModal';

interface ModalButton {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  color?: string;
  disabled?: boolean;
}

interface ModalOptions {
  title?: string;
  children?: ReactNode;
  buttons?: ModalButton[];
  headerShown?: boolean;
  buttonShown?: boolean;
  closeButton?: boolean;
  closeOnBackdropPress?: boolean;
  position?: 'center' | 'bottom';
  size?: 'small' | 'medium' | 'large' | 'full';
  hasBackground?: boolean;
  onClose?: () => void;
}

interface ModalContextType {
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * 모달 Provider (최적화)
 *
 * Context를 두 개로 분리:
 * 1. ModalContext: openModal, closeModal 함수만 제공 (변경 없음)
 * 2. 모달 상태는 Provider 내부에서만 관리
 *
 * 결과: 모달 열기/닫기 시 Provider 하위 컴포넌트 리렌더링 없음
 */
const ModalProviderComponent: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<ModalOptions>({});

  // useRef로 함수를 저장하여 참조 안정성 유지
  const optionsRef = useRef<ModalOptions>({});

  const openModal = useCallback((options: ModalOptions) => {
    optionsRef.current = options;
    setModalOptions(options);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    optionsRef.current.onClose?.();
    // 애니메이션 완료 후 옵션 초기화
    setTimeout(() => {
      setModalOptions({});
      optionsRef.current = {};
    }, 300);
  }, []);

  // useMemo로 context value를 메모이제이션
  // openModal, closeModal 함수만 제공 (isOpen 제외!)
  // 함수는 useCallback으로 안정적이므로 절대 재생성 안됨
  const contextValue = useMemo(
    () => ({
      openModal,
      closeModal,
    }),
    [openModal, closeModal]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      <>
        {children}
        {/* 모달은 Portal처럼 독립적으로 렌더링 */}
        <ImprovedModal
          visible={isOpen}
          onClose={closeModal}
          title={modalOptions.title}
          buttons={modalOptions.buttons}
          headerShown={modalOptions.headerShown}
          buttonShown={modalOptions.buttonShown}
          closeButton={modalOptions.closeButton}
          closeOnBackdropPress={modalOptions.closeOnBackdropPress}
          position={modalOptions.position}
          size={modalOptions.size}
          hasBackground={modalOptions.hasBackground}
        >
          {modalOptions.children}
        </ImprovedModal>
      </>
    </ModalContext.Provider>
  );
};

export const ModalProvider = ModalProviderComponent;

/**
 * 모달 Hook
 *
 * @example
 * ```tsx
 * const { openModal, closeModal } = useModal();
 *
 * openModal({
 *   title: '알림',
 *   children: <Text>모달 내용</Text>,
 *   buttons: [
 *     { text: '취소', onPress: closeModal, variant: 'outline' },
 *     { text: '확인', onPress: () => console.log('확인') },
 *   ],
 * });
 * ```
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  // isOpen을 제외하고 반환 (불필요한 리렌더링 방지)
  return useMemo(
    () => ({
      openModal: context.openModal,
      closeModal: context.closeModal,
    }),
    [context.openModal, context.closeModal]
  );
};

/**
 * 간편한 Alert 모달
 */
export const useAlert = () => {
  const { openModal } = useModal();

  const alert = useCallback(
    (message: string, title: string = '알림', onConfirm?: () => void) => {
      openModal({
        title,
        children: <TextBox>{message}</TextBox>,
        buttons: [
          {
            text: '확인',
            onPress: () => {
              onConfirm?.();
            },
          },
        ],
      });
    },
    [openModal]
  );

  return useMemo(() => ({ alert }), [alert]);
};

/**
 * 간편한 Confirm 모달
 */
export const useConfirm = () => {
  const { openModal } = useModal();

  const confirm = useCallback(
    (
      message: string,
      title: string = '확인',
      onConfirm?: () => void,
      onCancel?: () => void
    ) => {
      openModal({
        title,
        children: <TextBox>{message}</TextBox>,
        buttons: [
          {
            text: '취소',
            onPress: () => {
              onCancel?.();
            },
            variant: 'outline',
          },
          {
            text: '확인',
            onPress: () => {
              onConfirm?.();
            },
          },
        ],
      });
    },
    [openModal]
  );

  return useMemo(() => ({ confirm }), [confirm]);
};

export default useModal;

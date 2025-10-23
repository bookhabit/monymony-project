import React, { createContext, useContext, useEffect, useState } from 'react';

import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface NetworkContextType {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  showOfflineModal: boolean;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

interface NetworkProviderProps {
  children: React.ReactNode;
}

/**
 * NetworkProvider
 *
 * - 네트워크 상태 실시간 감지
 * - 오프라인 시 모달 표시
 * - 추후 React Query의 onlineManager와 연동 가능 (TODO)
 */
export const NetworkProvider: React.FC<NetworkProviderProps> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState<
    boolean | null
  >(true);
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  useEffect(() => {
    // 네트워크 상태 구독
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const connected = state.isConnected ?? false;
      const reachable = state.isInternetReachable;

      setIsConnected(connected);
      setIsInternetReachable(reachable);

      // 오프라인 베나 표시 로직
      if (!connected || reachable === false) {
        // 오프라인 상태
        setShowOfflineModal(true);
      } else {
        // 온라인 상태
        setShowOfflineModal(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        isConnected,
        isInternetReachable,
        showOfflineModal,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

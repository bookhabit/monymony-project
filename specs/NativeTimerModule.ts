import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  readonly startTimer: (seconds: number) => void;
  readonly pauseTimer: () => void;
  readonly resumeTimer: () => void;
  readonly stopTimer: () => void;
  readonly getRemainingSeconds: () => Promise<number>;
  readonly isRunning: () => Promise<boolean>;
  readonly isPaused: () => Promise<boolean>;
  readonly isAlarming: () => Promise<boolean>;
  readonly addListener: (eventName: string) => void;
  readonly removeListeners: (count: number) => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeTimerModule');

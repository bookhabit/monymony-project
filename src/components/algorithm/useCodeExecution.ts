import { useState } from 'react';

export const useCodeExecution = () => {
  const [executionResults, setExecutionResults] = useState<
    Record<string, string[]>
  >({});

  const executeCode = (id: string, code: string) => {
    try {
      const logs: string[] = [];
      const originalLog = console.log;
      const originalError = console.error;

      // console.log를 가로채서 결과 수집
      console.log = (...args: any[]) => {
        const message = args
          .map((arg) => {
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg, null, 2);
              } catch {
                return String(arg);
              }
            }
            return String(arg);
          })
          .join(' ');
        logs.push(message);
        originalLog(...args);
      };

      console.error = (...args: any[]) => {
        const message = args.map((arg) => String(arg)).join(' ');
        logs.push(`[ERROR] ${message}`);
        originalError(...args);
      };

      // 코드 실행
      // 주의: eval은 보안상 위험할 수 있지만, 여기서는 학습 목적의 코드만 실행
      const wrappedCode = `
        try {
          ${code}
        } catch (error) {
          console.error(error.message);
        }
      `;
      eval(wrappedCode);

      // console.log 복원
      console.log = originalLog;
      console.error = originalError;

      // 결과 저장
      setExecutionResults((prev) => ({
        ...prev,
        [id]: logs.length > 0 ? logs : ['코드가 실행되었습니다. (출력 없음)'],
      }));
    } catch (error) {
      setExecutionResults((prev) => ({
        ...prev,
        [id]: [
          `[실행 오류] ${error instanceof Error ? error.message : String(error)}`,
        ],
      }));
    }
  };

  return {
    executionResults,
    executeCode,
  };
};

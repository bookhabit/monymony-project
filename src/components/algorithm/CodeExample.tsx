import { View, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

interface CodeExampleProps {
  code: string;
  codeId: string;
  executionResults?: Record<string, string[]>;
  onExecute: (id: string, code: string) => void;
}

export const CodeExample: React.FC<CodeExampleProps> = ({
  code,
  codeId,
  executionResults,
  onExecute,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <CustomButton
        title="코드 실행"
        onPress={() => onExecute(codeId, code)}
        variant="outline"
        size="small"
        style={styles.runButton}
      />
      {executionResults && executionResults[codeId] && (
        <View
          style={[
            styles.resultBlock,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
            },
          ]}
        >
          <TextBox
            variant="body4"
            color={theme.primary}
            style={styles.resultTitle}
          >
            실행 결과:
          </TextBox>
          {executionResults[codeId].map((log, idx) => (
            <TextBox
              key={idx}
              variant="caption1"
              color={theme.text}
              style={styles.resultText}
            >
              {log}
            </TextBox>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  runButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  resultBlock: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    gap: 8,
  },
  resultTitle: {
    marginBottom: 4,
    fontWeight: '600',
  },
  resultText: {
    fontFamily: 'monospace',
    lineHeight: 18,
  },
});

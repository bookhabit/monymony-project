import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

import { CodeExample } from './CodeExample';
import { CodeExampleItem } from './types';

interface FunctionAccordionProps {
  item: CodeExampleItem;
  executionResults?: Record<string, string[]>;
  onExecute: (id: string, code: string) => void;
}

export const FunctionAccordion: React.FC<FunctionAccordionProps> = ({
  item,
  executionResults,
  onExecute,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={[styles.functionCard, { backgroundColor: theme.surface }]}>
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={({ pressed }) => [
          styles.functionHeader,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <View style={styles.functionHeaderLeft}>
          <TextBox variant="title5" color={theme.text}>
            {item.name}
          </TextBox>
          {item.category && (
            <TextBox
              variant="caption2"
              color={theme.textSecondary}
              style={styles.category}
            >
              {item.category}
            </TextBox>
          )}
        </View>
        <MaterialIcons
          name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color={theme.text}
        />
      </Pressable>

      {isExpanded && (
        <View style={styles.functionContent}>
          <View style={styles.section}>
            <TextBox variant="body2" color={theme.primary}>
              {item.definition}
            </TextBox>
          </View>

          <View style={styles.section}>
            <TextBox variant="body3" color={theme.textSecondary}>
              {item.description}
            </TextBox>
          </View>

          <View style={styles.section}>
            <View
              style={[
                styles.codeBlock,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <TextBox
                variant="caption1"
                color={theme.text}
                style={styles.codeText}
              >
                {item.code}
              </TextBox>
            </View>
            <CodeExample
              code={item.code}
              codeId={item.id}
              executionResults={executionResults}
              onExecute={onExecute}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  functionCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 12,
    marginBottom: 8,
  },
  functionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  functionHeaderLeft: {
    flex: 1,
    gap: 4,
  },
  category: {
    marginTop: 2,
  },
  functionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  section: {
    gap: 8,
  },
  codeBlock: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  codeText: {
    fontFamily: 'monospace',
    lineHeight: 20,
  },
});

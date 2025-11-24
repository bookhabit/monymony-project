import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

import { CodeExample } from './CodeExample';
import { AccordionItem } from './types';

interface TopicAccordionProps {
  topic: AccordionItem;
  executionResults?: Record<string, string[]>;
  onExecute: (id: string, code: string) => void;
}

export const TopicAccordion: React.FC<TopicAccordionProps> = ({
  topic,
  executionResults,
  onExecute,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={[styles.topicCard, { backgroundColor: theme.surface }]}>
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={({ pressed }) => [
          styles.topicHeader,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <TextBox variant="title4" color={theme.text}>
          {topic.title}
        </TextBox>
        <MaterialIcons
          name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color={theme.text}
        />
      </Pressable>

      {isExpanded && (
        <View style={styles.topicContent}>
          {topic.content.concept && (
            <View style={styles.section}>
              <TextBox variant="body2" color={theme.primary}>
                {topic.content.concept}
              </TextBox>
            </View>
          )}

          {topic.content.description && (
            <View style={styles.section}>
              <TextBox variant="body3" color={theme.textSecondary}>
                {topic.content.description}
              </TextBox>
            </View>
          )}

          {topic.content.list && (
            <View style={styles.section}>
              {topic.content.list.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <TextBox variant="body3" color={theme.text}>
                    • {item}
                  </TextBox>
                </View>
              ))}
            </View>
          )}

          {topic.content.examples && (
            <View style={styles.section}>
              {topic.content.examples.map((example, index) => {
                const exampleId = `${topic.id}-example-${index}`;
                return (
                  <View key={index} style={styles.exampleContainer}>
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
                        {example.code}
                      </TextBox>
                      {example.explanation && (
                        <View
                          style={[
                            styles.explanation,
                            { borderTopColor: theme.border },
                          ]}
                        >
                          <TextBox variant="body4" color={theme.textSecondary}>
                            {example.explanation}
                          </TextBox>
                        </View>
                      )}
                    </View>
                    <CodeExample
                      code={example.code}
                      codeId={exampleId}
                      executionResults={executionResults}
                      onExecute={onExecute}
                    />
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topicCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  topicContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  section: {
    gap: 8,
  },
  listItem: {
    marginBottom: 4,
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
  explanation: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  exampleContainer: {
    gap: 8,
  },
});

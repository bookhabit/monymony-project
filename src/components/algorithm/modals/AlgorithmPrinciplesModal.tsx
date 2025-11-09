import AlgorithmModalBase from './AlgorithmModalBase';

interface AlgorithmPrinciplesModalProps {
  visible: boolean;
  onConfirm: () => void;
}

export default function AlgorithmPrinciplesModal({
  visible,
  onConfirm,
}: AlgorithmPrinciplesModalProps) {
  return (
    <AlgorithmModalBase
      visible={visible}
      title="‘짧은 시간 공부해서는 코딩테스트를 합격할 수 없다’"
      sections={[
        {
          heading: '타인의 풀이를 보면 사고를 넓힐 수 있다',
          body: '다른 사람이 작성한 코드를 보면 자연스럽게 다양한 문제 풀이 접근 방식이나 코딩 스킬을 습득할 수 있다.',
        },
        {
          heading: '나만의 테스트 케이스를 추가하기',
          body: [
            '문제에서 제시되는 테스트 케이스 외에 여러 예외 상황들을 생각하여 나만의 테스트 케이스를 추가한다.',
            '코딩 전 문제 분석 단계에서 예외 테스트 케이스를 추가해본다.',
          ],
        },
        {
          heading: '아는 것과 모르는 것을 명확하게 구분 짓기',
          body: [
            '문제를 풀지 못해도 어디까지 생각했는지 기록하기.',
            '어떤 알고리즘을 적용하려 했는지, 근거는 무엇인지 정리한다.',
            '구현 과정을 기록하고, 답안 코드를 보며 어디서 잘못되었는지 복기한다.',
          ],
        },
        {
          heading: '나만의 언어로 요약하기',
          body: '정말 이해했는지 확인하는 가장 좋은 방법은 이해한 내용을 나만의 언어로 요약해보는 것이다.',
        },
      ]}
      primaryActionLabel="확인"
      onPrimaryAction={onConfirm}
    />
  );
}


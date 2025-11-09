import AlgorithmModalBase from './AlgorithmModalBase';

interface AlgorithmProblemSolvingModalProps {
  visible: boolean;
  onConfirm: () => void;
}

export default function AlgorithmProblemSolvingModal({
  visible,
  onConfirm,
}: AlgorithmProblemSolvingModalProps) {
  return (
    <AlgorithmModalBase
      visible={visible}
      title="‘코딩테스트는 코딩 능력이 아니라 문제 풀이 능력을 확인하는 것’"
      sections={[
        {
          heading: '문제 분석 연습하기',
          body: [
            '문제를 동작 단위로 쪼개서 분석한다.',
            '제약 사항을 정리한 뒤 테스트 케이스를 추가한다.',
            '입력값을 분석하여 시간 복잡도를 고려한다.',
            '핵심 키워드를 파악해 빠르게 알고리즘을 선택한다.',
            '데이터 흐름이나 구조를 파악한다 (예: 삽입/삭제가 잦다면 힙 고려).',
          ],
        },
        {
          heading: '큐(Queue)의 예시',
          body: [
            '키워드: 순서대로, 스케줄링, 최소 시간.',
            '상황: 특정 조건에 따른 시뮬레이션, 시작 지점에서 목표 지점까지 최단 거리.',
          ],
        },
        {
          heading: '의사 코드로 설계 연습하기',
          body: [
            '문제 분석 후 전체 코드를 설계하고 자연어 기반 의사 코드로 정리한다.',
            '세부 구현이 아닌 동작 중심으로 작성한다.',
            '문제 해결 순서를 따라가며 작성하고 충분히 검토한다.',
          ],
        },
      ]}
      primaryActionLabel="완료"
      onPrimaryAction={onConfirm}
    />
  );
}


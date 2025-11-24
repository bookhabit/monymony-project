export interface AccordionItem {
  id: string;
  title: string;
  content: {
    concept?: string;
    description?: string;
    examples?: { code: string; explanation?: string }[];
    list?: string[];
    isSection?: boolean; // 섹션 제목인지 여부
  };
}

export interface FunctionItem {
  id: string;
  name: string;
  category: string;
  definition: string;
  description: string;
  code: string;
}

export interface BasicOperationItem {
  id: string;
  name: string;
  definition: string;
  description: string;
  code: string;
}

export interface LoopItem {
  id: string;
  name: string;
  definition: string;
  description: string;
  code: string;
}

// 범용 코드 예제 아이템 (다양한 주제에서 사용 가능)
export interface CodeExampleItem {
  id: string;
  name: string;
  definition: string;
  description: string;
  code: string;
  category?: string; // 선택적 카테고리
}

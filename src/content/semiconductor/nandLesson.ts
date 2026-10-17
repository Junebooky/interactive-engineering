import type { Lesson } from '../../types';

export const nandLesson: Lesson = {
  id: 'nand-essd-storage-pipeline',
  courseId: 'course-semiconductor',
  category: 'semiconductor',
  slug: 'nand-essd-storage-pipeline',
  title: '04. NAND·eSSD에서 AI 데이터센터까지: 데이터의 여행',
  subtitle: '비휘발 문턱전압, 페이지/블록 비대칭, FTL 신뢰성, NVMe DMA 전송, AI 데이터센터 파이프라인',
  description:
    '전원이 꺼져도 데이터를 유지하는 플래시 메모리의 물리적 문턱전압 원리부터, 페이지 쓰기·블록 지우기의 비대칭성과 FTL 가비지 컬렉션, NVMe PCIe DMA 데이터 전송 경로, 그리고 AI 데이터센터의 콜드 로딩과 상주 추론 파이프라인까지의 전 과정을 5개 인터랙티브 2.5D 시뮬레이션으로 탐구합니다.',
  steps: [
    // Step 0: Concept Intro
    {
      id: 'step-nand04-s0-intro',
      title: '개념 도입: 플래시 메모리와 비휘발성 저장 원리',
      stepType: 'CONCEPT',
      storyLead: '전원을 꺼도 사진과 파일이 그대로 남아 있는 컴퓨터 저장장치의 비밀은 무엇일까요?',
      prompt:
        'DRAM은 전원이 꺼지면 축전기 전하가 누설되어 데이터가 즉시 사라지지만, NAND 플래시 메모리는 절연막으로 둘러싸인 부유 게이트(Floating Gate)나 전하 트랩(Charge Trap Flash, CTF)에 전하를 가두어 전원 공급 없이도 수년 동안 기억을 유지합니다. 아래 버튼을 눌러 비휘발성 저장의 핵심 5단계를 확인해 보세요.',
      detailExplanation:
        '• 비휘발성(Non-Volatile): 전원 공급이 끊겨도 저장된 전하가 절연막에 갇혀 상태를 유지합니다.\n• 읽기 동작의 조건: 전하 자체는 전원 없이 보존되지만, 그 전하가 만든 문턱전압을 측정해 0과 1을 판별하려면 센스 증폭기 회로에 전원이 공급되어야 합니다.\n• 페이지 쓰기 vs 블록 지우기: NAND는 읽기/쓰기 단위(Page, 보통 수 KB)와 지우기 단위(Block, 보통 수 MB)가 달라 제자리 덮어쓰기(In-place overwrite)가 불가능합니다.\n• 시스템 파이프라인: 플래시 소자 위의 FTL(Flash Translation Layer) 컨트롤러, PCIe/NVMe 고속 버스, 그리고 AI 가속기 메모리로 이어지는 데이터 경로를 차례로 실습합니다.',
      whyExplanation:
        '전자를 양자역학적 파울러-노드하임(Fowler-Nordheim) 터널링 등으로 절연막 너머 트랩 층에 주입하면, 이 갇힌 전하가 반도체 표면의 채널 형성을 방해하여 소자의 문턱전압(Threshold Voltage, Vt)을 높은 값으로 이동시킵니다. 이 문턱전압 차이를 읽어냄으로써 영구적인 디지털 비트를 표현합니다.',
      initialParams: {},
      rules: [],
      voice: {
        intro:
          '전원을 꺼도 데이터가 보존되는 플래시 메모리의 원리부터 AI 데이터센터까지의 데이터 여행을 5단계로 탐구해 보겠습니다.',
      },
      hints: [
        {
          level: 1,
          title: '비휘발성과 읽기 전원의 차이',
          description: '데이터가 보존되는 것과 보존된 데이터를 전기 회로로 읽어내는 동작은 구분되어야 합니다.',
          voiceLine: '데이터가 보존되는 것과 보존된 데이터를 전기 회로로 읽어내는 동작은 구분되어야 합니다.',
        },
      ],
      successMessage: 'NAND 플래시 메모리와 스토리지 파이프라인의 핵심 개념을 확인했습니다. 1단계 전하 저장과 문턱전압 실험으로 넘어갑니다.',
    },

    // Step 1: 04-S01 Threshold & Retention
    {
      id: 'step-nand04-s1-threshold',
      title: '1단계: 전하 저장과 문턱전압 — 전원 없이도 유지되는 기억 (N04-S01)',
      stepType: 'MANIPULATE',
      storyLead: '두 메모리의 전원을 껐다 다시 켠다고 상상해 보세요.',
      prompt:
        '전원을 껐다 켠 다음에도 구별할 수 있는 기억 상태가 있는지 먼저 예상해 보고, 저장 전하 상태(low/high)와 판별 읽기 전압(0.3V/1.0V/2.0V), 전원 공급(ON/OFF)을 조작하며 비휘발성과 읽기 조건의 차이를 증명하세요.',
      detailExplanation:
        '• 저장 전하와 문턱전압: 소거 상태(low)는 갇힌 전하가 적어 문턱전압이 낮고(Vt ≈ 0.5 V), 프로그램 상태(high)는 갇힌 전하가 많아 문턱전압이 높습니다(Vt ≈ 1.5 V).\n• 판별 읽기(Sensing): 중간 전압인 1.0 V를 인가하면 low 상태 셀은 켜져 전류가 흐르고, high 상태 셀은 꺼져 전류가 흐르지 않아 상태를 구별합니다.\n• 전원 OFF 시: 저장 전하는 안정적으로 보존되지만, 읽기 회로에 전원이 없으면 전류 판별이 불가능합니다.',
      whyExplanation:
        'NAND는 전하 트랩 또는 부유 게이트 등으로 상태를 오랫동안 보존하고 그 문턱을 전원이 공급된 센스 회로에서 구분합니다. 두 문턱 low/high와 1.0V read는 2-state toy이며 실제 셀 분포, retention·temperature·read-disturb는 생략해요. DRAM은 짧은 보존과 주기적 refresh가 필요한 다른 소자입니다.',
      simulatorType: 'nand-threshold',
      physicsAssumptions: '2 상태 임계전압 low 0.5V/high 1.5V/read 0.3/1/2V toy. 제품별 실제 셀 문턱값, 보존시간, MLC/TLC·QLC 인코딩과 다름',
      sourceRefs: ['A06 Curriculum: 04-nand-essd-data-center.md (Step 1 N04-S01)'],
      initialParams: {
        cell: 'low',
        readV: 1,
        power: 'on',
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 전원을 껐다 켠 다음에도 구별할 수 있는 기억 상태가 있는지 어디서 관찰할 수 있을까요?',
          type: 'radioGroup',
          options: [
            {
              label: 'NAND는 전원을 껐다 켜도 저장된 전하에 따라 상태를 구별할 방법이 남아요.',
              value: 'charge',
            },
            {
              label: '전원을 껐다 켜면 모든 반도체 장치는 항상 전하가 빠져 같은 상태가 돼요.',
              value: 'no',
            },
          ],
        },
        {
          id: 'cell',
          label: '셀 저장 전하 상태 (Charge State):',
          type: 'radioGroup',
          options: [
            { label: 'Low 전하 상태 (소거 상태, Vt ≈ 0.5 V)', value: 'low' },
            { label: 'High 전하 상태 (프로그램 상태, Vt ≈ 1.5 V)', value: 'high' },
          ],
        },
        {
          id: 'readV',
          label: '읽기 판별 전압 (Read Voltage):',
          type: 'radioGroup',
          options: [
            { label: '0.3 V (기준 전압 미달)', value: 0.3 },
            { label: '1.0 V (중간 판별 전압)', value: 1 },
            { label: '2.0 V (과도 전압)', value: 2 },
          ],
        },
        {
          id: 'power',
          label: '전원 상태 (Power Supply):',
          type: 'radioGroup',
          options: [
            { label: '전원 ON (센서 회로 활성)', value: 'on' },
            { label: '전원 OFF (전원 차단·보존 테스트)', value: 'off' },
          ],
        },
        {
          id: 'answer',
          label: '원리 판별: NAND의 저장 전하 보존과 읽기 동작의 관계는 무엇인가요?',
          type: 'radioGroup',
          options: [
            {
              label: '저장 전하가 셀 문턱 상태에 영향을 주고 전원 복구 후에 읽어 구별할 수 있어요. 비휘발성과 전원 없는 읽기는 달라요.',
              value: 'retention-vs-read',
            },
            {
              label: '비휘발성이면 배터리·전원이 없을 때도 언제나 직접 읽을 수 있어요.',
              value: 'm1',
              misconception: '비휘발성이란 전원 없이 정보를 유지한다는 뜻이지, 전원을 끈 채 읽기 회로 없이 읽기 동작을 할 수 있다는 뜻은 아니에요.',
            },
            {
              label: 'NAND는 모든 데이터에 DRAM처럼 수십 ms 주기로 무조건 refresh를 해요.',
              value: 'm2',
              misconception: '일반 NAND는 DRAM 주기 refresh와 다르게 전하 보존/리텐션/읽기교란 제약이 있어요.',
            },
            {
              label: '모든 NAND 셀은 오직 1비트 저장 방식만 존재해요.',
              value: 'm3',
              misconception: 'TLC·QLC 같은 다중 문턱 레벨 모델도 존재하며 모든 NAND가 SLC는 아니에요.',
            },
          ],
        },
      ],
      rules: [
        { targetKey: 'history', operator: 'contains', expected: 'low', label: 'Low 전하 상태 조작 관찰', feedbackIfFail: '셀 저장 전하를 Low 상태로 설정해 보세요.' },
        { targetKey: 'history', operator: 'contains', expected: 'high', label: 'High 전하 상태 조작 관찰', feedbackIfFail: '셀 저장 전하를 High 상태로 설정해 보세요.' },
        { targetKey: 'history', operator: 'contains', expected: 'power-cycle', label: '전원 OFF/ON 주기 조작 관찰', feedbackIfFail: '전원을 OFF로 껐다가 다시 켜보세요.' },
        { targetKey: 'answer', operator: 'eq', expected: 'retention-vs-read', label: '정답 원리 선택', feedbackIfFail: '비휘발성과 읽기 전원의 관계를 나타낸 정답을 선택하세요.' },
      ],
      hints: [
        {
          level: 1,
          title: '비휘발과 무전원 읽기의 차이',
          description: '비휘발 데이터 유지와 무전원 읽기 동작은 같을까요?',
          voiceLine: '비휘발 데이터 유지와 무전원 읽기 동작은 같을까요?',
        },
        {
          level: 2,
          title: '문턱전압과 판별 회로',
          description: '문턱 전압을 비교하려면 전원이 인가된 읽기 회로가 필요한가요?',
          voiceLine: '문턱 전압을 비교하려면 전원이 인가된 읽기 회로가 필요한가요?',
        },
        {
          level: 3,
          title: '다중 비트 셀',
          description: '문턱 전압 구간을 여러 개로 쪼개어 셀당 3~4비트를 저장하는 TLC·QLC도 존재합니다.',
          voiceLine: '문턱 전압 구간을 여러 개로 쪼개어 셀당 3~4비트를 저장하는 TLC·QLC도 존재합니다.',
        },
      ],
      voice: {
        intro: '다른 두 메모리의 전원을 꺼서 보관했다가 다시 켤 때 어떻게 될지 먼저 예상해 보세요.',
      },
      successMessage: 'NAND 플래시의 전하 저장에 따른 문턱전압 변화와 비휘발성 읽기 조건을 완벽히 이해했습니다!',
    },

    // Step 2: 04-S02 Page Program & Block Erase
    {
      id: 'step-nand04-s2-page-block',
      title: '2단계: 페이지 쓰기와 블록 지우기 — 제자리 덮어쓰기 불가와 GC (N04-S02)',
      stepType: 'MANIPULATE',
      storyLead: '파일 한 줄만 수정하는데 책 한 장 전체를 지워야 한다면?',
      prompt:
        '같은 파일 주소를 수정할 때 어떤 물리 페이지 조작이 필요한지 먼저 예상해 보고, 2블록×4페이지 토이 배열에서 초기 기록(A), 데이터 갱신(B 기록 + 구 페이지 무효화), 가비지 컬렉션(GC)을 순서대로 비교하세요.',
      detailExplanation:
        '• 비대칭 단위: 쓰기(Program)는 페이지 단위(예: 4KB~16KB)로 가능하지만, 지우기(Erase)는 고전압으로 블록 단위(예: 128~512페이지)로만 수행됩니다.\n• 제자리 덮어쓰기 불가(Out-of-place Write): 이미 기록된 페이지에 다시 전자를 채울 수 없으므로, 새 빈 페이지에 수정본을 쓰고 이전 페이지는 INVALID로 마킹합니다.\n• 가비지 컬렉션(GC): 남은 유효(VALID) 페이지들을 새 블록으로 복사해 보존한 뒤, 무효 페이지만 남은 구 블록 전체를 일괄 ERASE하여 빈 공간을 회수합니다.',
      whyExplanation:
        'NAND의 페이지 프로그램과 블록 지우기는 다릅니다. 이 모형은 블록 두 개/각 네 페이지로 LBA7 처음 A를 B로 바꾸면 빈 B1:P0에 새 값을 기록하고 이전 B0:P0을 무효화합니다. GC는 살아 있는 페이지를 잃지 않도록 이동·보호한 뒤 블록을 지웁니다. 실제 페이지 순서·크기·오버프로비저닝은 제품마다 달라요.',
      simulatorType: 'nand-page-block',
      physicsAssumptions: '2 blocks×4 pages / LBA7 A→B toy; garbage collection physically must preserve valid pages; 실제 프로그램 순서/erase 횟수 보증 아님',
      sourceRefs: ['A06 Curriculum: 04-nand-essd-data-center.md (Step 2 N04-S02)'],
      initialParams: {
        pageStage: 'initial',
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 같은 논리 주소(LBA 7)의 파일을 수정할 때 물리 페이지는 어떻게 처리될까요?',
          type: 'radioGroup',
          options: [
            {
              label: 'NAND의 쓰기와 지우기 단위가 다르므로 새로운 빈 물리 페이지에 기록해야 해요.',
              value: 'move',
            },
            {
              label: 'NAND 안에서는 어떤 페이지든 파일 수정 시 제자리에서 무제한 덮어쓸 수 있어요.',
              value: 'same',
            },
          ],
        },
        {
          id: 'pageStage',
          label: '물리 페이지 조작 단계 (Page/Block Stage):',
          type: 'radioGroup',
          options: [
            { label: '1. 초기 기록 (Block 0, Page 0에 LBA 7의 데이터 A 기록)', value: 'initial' },
            { label: '2. 데이터 갱신 (새 Block 1, Page 0에 B 기록 + 구 페이지 무효화)', value: 'updated' },
            { label: '3. 가비지 컬렉션 (유효 페이지 보존 후 Block 0 일괄 소거)', value: 'collected' },
          ],
        },
        {
          id: 'answer',
          label: '원리 판별: NAND 플래시의 쓰기/지우기 비대칭성과 공간 회수 원리는 무엇인가요?',
          type: 'radioGroup',
          options: [
            {
              label: '프로그램은 페이지 단위, 지우기는 블록 단위여서 새 페이지에 수정본을 쓰고 옛 기록을 무효화한 뒤 GC로 공간을 회수할 수 있어요.',
              value: 'page-vs-block',
            },
            {
              label: '이미 프로그램한 NAND 페이지는 제자리에서 무한히 쓰고 지울 수 있어요.',
              value: 'm1',
              misconception: '일반 NAND에선 이미 프로그램된 페이지를 논리주소처럼 자유롭게 제자리 덮어쓰지 못해 새 페이지가 필요해요.',
            },
            {
              label: 'GC는 사용자 파일을 아무 이유 없이 무작위 삭제하는 작업이에요.',
              value: 'm2',
              misconception: 'GC는 살아 있는 페이지의 데이터를 지키며 무효 공간을 회수하는 내부 관리 작업이에요.',
            },
            {
              label: '페이지 한 개와 지우는 블록 한 개의 크기는 언제나 같아요.',
              value: 'm3',
              misconception: '지우기는 여러 페이지가 들어 있는 블록 단위인 경우가 일반적이며 모형 한 블록은 페이지 네 개예요.',
            },
          ],
        },
      ],
      rules: [
        { targetKey: 'history', operator: 'contains', expected: 'initial', label: '초기 기록 관찰', feedbackIfFail: '1단계 초기 기록 상태를 확인하세요.' },
        { targetKey: 'history', operator: 'contains', expected: 'updated', label: '새 페이지 기록 및 무효화 관찰', feedbackIfFail: '2단계 데이터 갱신을 선택하여 새 페이지 기록과 구 페이지 무효화를 확인하세요.' },
        { targetKey: 'history', operator: 'contains', expected: 'collected', label: 'GC 후 블록 일괄 소거 관찰', feedbackIfFail: '3단계 가비지 컬렉션을 선택하여 블록 소거를 확인하세요.' },
        { targetKey: 'answer', operator: 'eq', expected: 'page-vs-block', label: '정답 원리 선택', feedbackIfFail: '페이지 쓰기와 블록 지우기 비대칭성을 나타낸 정답을 선택하세요.' },
      ],
      hints: [
        {
          level: 1,
          title: '쓰기와 지우기 단위',
          description: '쓰기와 지우기의 물리적인 단위를 구별해 보세요.',
          voiceLine: '쓰기와 지우기의 물리적인 단위를 구별해 보세요.',
        },
        {
          level: 2,
          title: '새 빈 물리 페이지 기록',
          description: '같은 LBA를 새로운 빈 물리 페이지에 기록하고 이전 페이지를 무효화하면 어떨까요?',
          voiceLine: '같은 LBA를 새로운 빈 물리 페이지에 기록하고 이전 페이지를 무효화하면 어떨까요?',
        },
        {
          level: 3,
          title: '유효 데이터 보존',
          description: '블록을 지우기 전 유효한 페이지는 반드시 새 블록으로 복사하여 보존해야 합니다.',
          voiceLine: '블록을 지우기 전 유효한 페이지는 반드시 새 블록으로 복사하여 보존해야 합니다.',
        },
      ],
      voice: {
        intro: '작은 NAND에서 같은 파일 주소를 수정해 보세요. 어느 칸을 쓸지 먼저 골라 보세요.',
      },
      successMessage: '페이지 프로그램과 블록 지우기의 비대칭성, 그리고 가비지 컬렉션의 동작 원리를 정확히 입증했습니다!',
    },

    // Step 3: 04-S03 FTL & eSSD Reliability
    {
      id: 'step-nand04-s3-ftl-reliability',
      title: '3단계: SSD 컨트롤러 FTL과 엔터프라이즈 신뢰성 기능 (N04-S03)',
      stepType: 'MANIPULATE',
      storyLead: '서버용 엔터프라이즈 SSD(eSSD)도 모델마다 부품과 보호 기능이 달라요.',
      prompt:
        '논리주소와 물리 페이지의 대응을 먼저 예상해 보고, 쓰기 패턴(Cold/Hot)과 선택 사양(ECC 오류정정, PLP 전원보호, 온보드 DRAM 캐시)을 조합하며 컨트롤러 FTL의 수명 관리와 신뢰성 한계를 관찰하세요.',
      detailExplanation:
        '• FTL(Flash Translation Layer): 운영체제의 논리주소(LBA)를 실제 NAND 물리주소(PBA)로 실시간 변환하며, 특정 블록만 먼저 마모되지 않도록 마모 평준화(Wear Leveling)를 수행합니다.\n• Hot vs Cold 쓰기: 자주 수정되는 Hot 데이터는 새 페이지로 빈번히 재매핑되어 쓰기 증폭(WAF)과 마모를 유발합니다.\n• 선택 사양(Options): 전원 상실 보호(PLP, 슈퍼커패시터)와 DRAM 캐시는 엔터프라이즈 사양별 옵션이며, ECC는 정정 가능 비트 한계가 있어 완벽한 무오류를 보장하지 않습니다.',
      whyExplanation:
        'FTL은 호스트 LBA와 NAND 페이지 관계를 관리하며 프로그램/GC/마모 평준화를 수행합니다. ECC는 정정 범위 내 오류를 줄이되 무오류 보장이 아니고, DRAM 캐시/DRAMless·PLP 존재는 SKU마다 다릅니다. hot/cold는 추상적인 마모 차이이며 실제 DWPD/성능을 예측하지 않습니다.',
      simulatorType: 'ssd-ftl-reliability',
      physicsAssumptions: 'ECC/PLP/DRAM 선택은 서로 독립적인 제품 옵션 카드; eSSD 단어만으로 실제 하드웨어 확정 불가. toy 지표 DWPD 아님',
      sourceRefs: ['A06 Curriculum: 04-nand-essd-data-center.md (Step 3 N04-S03)'],
      initialParams: {
        writePattern: 'cold',
        ecc: false,
        plp: false,
        dramCache: false,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 논리 주소(LBA)와 물리 페이지의 대응 및 SSD의 보호 부품은 모든 제품에서 동일할까요?',
          type: 'radioGroup',
          options: [
            {
              label: '설계와 제품 사양에 따라 FTL 주소 매핑과 보호 부품(PLP/DRAM)이 달라질 수 있어요.',
              value: 'design',
            },
            {
              label: 'eSSD라는 명칭이 붙은 제품이라면 내부 구성 부품과 보호 기능은 전부 동일해요.',
              value: 'fixed',
            },
          ],
        },
        {
          id: 'writePattern',
          label: '쓰기 패턴 (Write Pattern):',
          type: 'radioGroup',
          options: [
            { label: 'Cold 쓰기 (수정 빈도 낮음, 안정적 매핑 유지)', value: 'cold' },
            { label: 'Hot 쓰기 (빈번한 재작성, 웨어 레벨링 및 빈번한 재매핑)', value: 'hot' },
          ],
        },
        {
          id: 'ecc',
          label: 'ECC 오류 정정 (Error Correction Code):',
          type: 'radioGroup',
          options: [
            { label: 'ECC 미선택 / 기본', value: false },
            { label: 'ECC 활성화 (정정 가능 한계 내 오류 복구, 완전 무오류 아님)', value: true },
          ],
        },
        {
          id: 'plp',
          label: 'PLP 전원 상실 보호 (Power Loss Protection):',
          type: 'radioGroup',
          options: [
            { label: 'PLP 없음 (전원 급단절 시 DRAM 캐시 손실 위험)', value: false },
            { label: 'PLP 탑재 (슈퍼커패시터로 캐시 데이터 비휘발성 플러시 보장)', value: true },
          ],
        },
        {
          id: 'dramCache',
          label: 'DRAM 캐시 유무 (Controller DRAM):',
          type: 'radioGroup',
          options: [
            { label: 'DRAMless 설계 (호스트 메모리 버퍼 HMB 활용)', value: false },
            { label: '전용 온보드 DRAM 탑재 (고속 FTL 룩업 테이블 유지)', value: true },
          ],
        },
        {
          id: 'answer',
          label: '원리 판별: FTL의 역할과 eSSD 엔터프라이즈 신뢰성 사양의 본질은 무엇인가요?',
          type: 'radioGroup',
          options: [
            {
              label: 'FTL은 LBA→물리 위치를 바꿀 수 있고, 마모·ECC·지연·전원 보호/DRAM 사용 여부는 제품별 설계와 사양을 확인해야 해요.',
              value: 'ftl-feature-options',
            },
            {
              label: '모든 eSSD에는 반드시 PLP가 장착돼 있고 그 기능이 똑같아요.',
              value: 'ssd-plp-universal',
              misconception: 'PLP는 개별 SSD 데이터시트에서 지원 여부와 실제 보호 범위를 확인해야 해요.',
            },
            {
              label: 'SSD라면 내부에 전용 DRAM 캐시가 반드시 있어야 해요.',
              value: 'ssd-dram-universal',
              misconception: 'DRAMless SSD와 호스트 메모리 버퍼를 활용하는 설계도 있으므로 모든 장치에서 필요하지 않아요.',
            },
            {
              label: 'ECC를 켜면 SSD의 모든 가능한 오류가 완전히 사라져요.',
              value: 'ecc-perfect',
              misconception: 'ECC에는 정정 가능한 오류 한계가 있으므로 오류 확률이 0이 되지는 않아요.',
            },
          ],
        },
      ],
      rules: [
        { targetKey: 'history', operator: 'contains', expected: 'hot', label: 'Hot 쓰기 마모 패턴 관찰', feedbackIfFail: 'Hot 쓰기 패턴을 선택해 보세요.' },
        { targetKey: 'history', operator: 'contains', expected: 'cold', label: 'Cold 쓰기 패턴 관찰', feedbackIfFail: 'Cold 쓰기 패턴을 선택해 보세요.' },
        { targetKey: 'history', operator: 'contains', expected: 'ecc-option', label: 'ECC 오류 정정 기능 관찰', feedbackIfFail: 'ECC 옵션을 활성화해 보세요.' },
        { targetKey: 'history', operator: 'contains', expected: 'plp-option', label: 'PLP 전원 보호 기능 관찰', feedbackIfFail: 'PLP 전원 상실 보호 옵션을 활성화해 보세요.' },
        { targetKey: 'answer', operator: 'eq', expected: 'ftl-feature-options', label: '정답 원리 선택', feedbackIfFail: 'FTL의 역할과 제품별 신뢰성 사양을 설명한 정답을 선택하세요.' },
      ],
      hints: [
        {
          level: 1,
          title: '논리주소와 물리주소',
          description: 'LBA와 실제 물리주소가 꼭 일대일로 영구 고정되어 있을까요?',
          voiceLine: 'LBA와 실제 물리주소가 꼭 일대일로 영구 고정되어 있을까요?',
        },
        {
          level: 2,
          title: '하드웨어 부품 옵션',
          description: 'PLP와 온보드 DRAM 유무는 eSSD라는 이름만으로 일괄 결정되지 않습니다.',
          voiceLine: 'PLP와 온보드 DRAM 유무는 eSSD라는 이름만으로 일괄 결정되지 않습니다.',
        },
        {
          level: 3,
          title: 'ECC 정정 한계',
          description: 'ECC는 알고리즘상 정정 가능한 비트 수 한계가 있어 완벽한 무오류를 보장하지는 못합니다.',
          voiceLine: 'ECC는 알고리즘상 정정 가능한 비트 수 한계가 있어 완벽한 무오류를 보장하지는 못합니다.',
        },
      ],
      voice: {
        intro: '같은 호스트 주소로 쓰기를 반복할 때 내부 위치와 제품 기능 후보를 비교해 보세요.',
      },
      successMessage: 'FTL의 동적 주소 매핑과 eSSD 신뢰성 사양(ECC, PLP, DRAM)의 실제 한계를 완벽히 검증했습니다!',
    },

    // Step 4: 04-S04 NVMe & PCIe DMA Data Path
    {
      id: 'step-nand04-s4-nvme-transfer',
      title: '4단계: NVMe 프로토콜과 PCIe DMA 데이터 전송 경로 (N04-S04)',
      stepType: 'MANIPULATE',
      storyLead: 'NVMe, PCIe, NAND, SSD 컨트롤러의 역할을 분리해 봐요.',
      prompt:
        '읽기 요청 명령과 실제 데이터 페이로드의 출발점을 먼저 예상해 보고, 호스트 READ 요청 전송, NAND 읽기 데이터의 PCIe DMA 전송, GPU 메모리로의 별도 이동 단계를 순서대로 조작하며 방향과 경로를 구분하세요.',
      detailExplanation:
        '• NVMe(Non-Volatile Memory Express): CPU와 고속 스토리지 간의 명령 제출/완료 큐(Submission/Completion Queue) 프로토콜 규격입니다.\n• PCIe 버스 & DMA: 호스트가 PCIe를 통해 읽기 명령을 보내면, SSD 컨트롤러는 CPU의 개입 없이 직접 메모리 접근(DMA, Direct Memory Access)을 통해 NAND 데이터를 호스트 DDR로 전송합니다.\n• GPU 이동의 독립성: 일반적인 시스템에서는 호스트 DDR에 적재된 데이터를 다시 PCIe 버스를 거쳐 GPU HBM/GDDR로 복사하는 별도의 단계가 필요합니다.',
      whyExplanation:
        '일반 host-staging 예시: NVMe READ 요청은 호스트 소프트웨어·큐에서 PCIe를 통해 컨트롤러로, NAND 데이터는 컨트롤러/PCIe DMA를 통해 host DDR로 돌아옵니다. 이후 GPU 메모리로의 전송은 별도 경로이며 GPUDirect Storage 같은 예외는 지원 조건을 명시해야 합니다.',
      simulatorType: 'nvme-transfer',
      physicsAssumptions: 'host DDR staging 교육 예시만, Nvme-oF/GPU direct 경로 가능. 실제 시스템 내 장치/호스트 물리 경로와 DMA 가용 조건은 제품별로 다름',
      sourceRefs: ['A06 Curriculum: 04-nand-essd-data-center.md (Step 4 N04-S04)'],
      initialParams: {
        transport: 'command',
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: NVMe READ 요청 명령과 실제 읽어낸 데이터 페이로드의 이동 방향은 같을까요?',
          type: 'radioGroup',
          options: [
            {
              label: '요청 명령과 실제 읽은 데이터의 출발점 및 이동 방향을 각각 따져보아야 해요.',
              value: 'directions',
            },
            {
              label: '모든 요청 명령과 데이터는 언제나 같은 단일 방향으로만 이동해요.',
              value: 'same',
            },
          ],
        },
        {
          id: 'transport',
          label: '데이터 전송 단계 (Data Transport Stage):',
          type: 'radioGroup',
          options: [
            { label: '1. NVMe READ 명령 (호스트 CPU/큐 → PCIe → SSD 컨트롤러)', value: 'command' },
            { label: '2. READ 데이터 페이로드 (NAND 미디어 → PCIe DMA → 호스트 DDR)', value: 'read-data' },
            { label: '3. GPU 메모리 전달 (호스트 DDR → PCIe → GPU HBM, 별도 전송)', value: 'to-gpu' },
          ],
        },
        {
          id: 'answer',
          label: '원리 판별: NVMe 프로토콜과 PCIe DMA 전송 경로의 올바른 설명은 무엇인가요?',
          type: 'radioGroup',
          options: [
            {
              label: 'NVMe는 명령·큐 인터페이스, PCIe는 연결이고 호스트→SSD 요청과 SSD→host DDR의 DMA read payload는 별도예요. GPU 이동은 추가 단계예요.',
              value: 'command-dma-staging',
            },
            {
              label: 'NVMe는 SSD를 꽂는 물리 케이블 이름 자체예요.',
              value: 'm1',
              misconception: 'NVMe는 명령·큐와 장치 인터페이스이고 PCIe는 대표적인 실제 전송/연결 경로예요.',
            },
            {
              label: 'CPU 코어가 읽기 payload를 항상 바이트 하나하나 직접 복사해야 해요.',
              value: 'm2',
              misconception: 'CPU는 I/O를 설정할 수 있지만 장치 DMA가 읽기 payload를 호스트 DDR로 옮길 수도 있어요.',
            },
            {
              label: 'SSD READ를 누르면 모든 기기에서 바로 GPU HBM에 무조건 적재돼요.',
              value: 'm3',
              misconception: '기본 경로는 host DDR staging이며 지원 플랫폼의 직접 GPU 경로는 별도 옵션이에요.',
            },
          ],
        },
      ],
      rules: [
        { targetKey: 'history', operator: 'contains', expected: 'command', label: 'NVMe READ 명령 전송 관찰', feedbackIfFail: '1단계 NVMe READ 명령 전송을 확인하세요.' },
        { targetKey: 'history', operator: 'contains', expected: 'read-data', label: 'PCIe DMA 데이터 수신 관찰', feedbackIfFail: '2단계 PCIe DMA 데이터 페이로드 수신을 확인하세요.' },
        { targetKey: 'history', operator: 'contains', expected: 'to-gpu', label: 'GPU 메모리 추가 전송 단계 관찰', feedbackIfFail: '3단계 GPU 메모리 전달 단계를 확인하세요.' },
        { targetKey: 'answer', operator: 'eq', expected: 'command-dma-staging', label: '정답 원리 선택', feedbackIfFail: 'NVMe 인터페이스와 PCIe DMA 경로를 설명한 정답을 선택하세요.' },
      ],
      hints: [
        {
          level: 1,
          title: '명령과 데이터의 시작점',
          description: '읽으라고 요청하는 명령을 시작하는 주체와 데이터가 출발하는 위치를 비교해 보세요.',
          voiceLine: '읽으라고 요청하는 명령을 시작하는 주체와 데이터가 출발하는 위치를 비교해 보세요.',
        },
        {
          level: 2,
          title: '프로토콜 규격 vs 물리 버스',
          description: '명령을 규정하는 NVMe 규격과 실제 전기 신호가 흐르는 PCIe 버스는 서로 다른 계층입니다.',
          voiceLine: '명령을 규정하는 NVMe 규격과 실제 전기 신호가 흐르는 PCIe 버스는 서로 다른 계층입니다.',
        },
        {
          level: 3,
          title: '호스트 DDR 스테이징',
          description: '일반적인 시스템은 호스트 DDR 메모리를 거쳐 GPU로 넘어가며, 직접 GPU 적재는 별도 기술이 필요합니다.',
          voiceLine: '일반적인 시스템은 호스트 DDR 메모리를 거쳐 GPU로 넘어가며, 직접 GPU 적재는 별도 기술이 필요합니다.',
        },
      ],
      voice: {
        intro: 'NVMe와 PCIe, SSD 컨트롤러, NAND 카드를 각각 어떻게 연결할지 먼저 골라 보세요.',
      },
      successMessage: 'NVMe 큐잉 프로토콜과 PCIe DMA를 통한 데이터 전송 경로의 실체를 정확히 이해했습니다!',
    },

    // Step 5: 04-S05 AI Data Center Storage Pipeline
    {
      id: 'step-nand04-s5-ai-datacenter',
      title: '5단계: AI 데이터센터 파이프라인 — 콜드 로딩, 상주 추론과 체크포인트 (N04-S05)',
      stepType: 'MANIPULATE',
      storyLead: 'AI 질문 한 줄을 생성할 때마다 SSD에서 수십 GB 모델을 다시 읽어올까요?',
      prompt:
        '모델이 이미 GPU 메모리에 있는 경우와 처음 적재해야 하는 경우의 경로 차이를 먼저 예상해 보고, 초기 콜드 로딩, 상주 추론, 학습 체크포인트 저장, 그리고 다중 서버 네트워크 조건을 조작하며 데이터센터 병목을 파악하세요.',
      detailExplanation:
        '• 콜드 로딩(Cold Load): 모델 가동 초기에는 SSD에서 수십~수백 GB 가중치를 호스트 DDR을 거쳐 GPU HBM으로 읽어오는 스토리지 대역폭 병목이 발생합니다.\n• 모델 상주 추론(Resident Inference): 모델 가중치가 이미 GPU HBM에 올라와 있으므로, 토큰 생성 시에는 스토리지 접근 없이 초고속 HBM과 연산기 사이에서만 데이터가 순환합니다.\n• 체크포인트(Checkpoint) & 분산 네트워크: 대규모 학습 중에는 가중치 손실 방지를 위해 정기적으로 SSD에 체크포인트를 기록하며, 다중 노드 분산 훈련 시에는 초고속 네트워크(NIC, RoCE/InfiniBand)가 필수적입니다.',
      whyExplanation:
        '처음 로딩과 모델이 이미 GPU 메모리에 있는 추론은 다르고, 체크포인트 SSD 저장·다중 서버 NIC/네트워크 및 전원/냉각도 필요해요. HBM, CPU DDR, NAND/SSD는 속도·용량·비용·보존 목적이 다르며 상호 보완적으로 작동합니다.',
      simulatorType: 'ai-datacenter-pipeline',
      physicsAssumptions: '초기 적재 vs 상주 추론 개념 모델; 실제 토큰당 레이턴시나 체크포인트 시간 수치는 인프라 사양에 따름',
      sourceRefs: ['A06 Curriculum: 04-nand-essd-data-center.md (Step 5 N04-S05)'],
      initialParams: {
        ai: 'cold-load',
        servers: 1,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 이미 가동 중인 거대 언어 모델이 답변 토큰을 하나 생성할 때마다 스토리지에서 모델을 다시 읽을까요?',
          type: 'radioGroup',
          options: [
            {
              label: '모델이 이미 GPU 메모리에 올라와 있는 상태와 처음 적재할 때의 경로를 구분해야 해요.',
              value: 'paths',
            },
            {
              label: 'AI 요청은 매번 어떤 환경에서도 SSD에서 모델 전체를 새로 읽어와요.',
              value: 'same',
            },
          ],
        },
        {
          id: 'ai',
          label: 'AI 파이프라인 실행 시나리오 (Pipeline Stage):',
          type: 'radioGroup',
          options: [
            { label: '1. 초기 콜드 로딩 (SSD 스토리지 → 호스트 DDR → GPU HBM 적재)', value: 'cold-load' },
            { label: '2. 모델 상주 추론 (GPU HBM에 상주, 토큰 생성 시 SSD 재접근 없음)', value: 'resident-infer' },
            { label: '3. 학습 체크포인트 (GPU 계산 가중치를 SSD에 영구 저장)', value: 'checkpoint' },
          ],
        },
        {
          id: 'servers',
          label: '서버 규모 (Server Infrastructure):',
          type: 'radioGroup',
          options: [
            { label: '단일 노드 서버 (내부 버스 통신)', value: 1 },
            { label: '분산 2대 서버 (고속 네트워크 NIC / 스위치 연동)', value: 2 },
          ],
        },
        {
          id: 'answer',
          label: '원리 판별: AI 데이터센터에서 메모리와 스토리지 계층의 실제 작동 원리는 무엇인가요?',
          type: 'radioGroup',
          options: [
            {
              label: '처음 로딩과 모델이 이미 GPU 메모리에 있는 추론은 다르고, 체크포인트 SSD 저장·다중 서버 NIC/네트워크 및 전원/냉각도 필요해요.',
              value: 'resident-vs-cold',
            },
            {
              label: 'AI가 토큰 하나를 생성할 때마다 SSD에서 모델 전체를 언제나 다시 로드해요.',
              value: 'm1',
              misconception: '이미 GPU 메모리/캐시에 상주한 모델은 토큰마다 전체 SSD 재로딩이 필수는 아니에요.',
            },
            {
              label: 'GPU HBM이 빠르니까 장기 저장 NAND/SSD와 CPU DDR은 언제나 불필요해요.',
              value: 'm2',
              misconception: 'HBM, CPU DDR, NAND/SSD는 속도·용량·보존 방식과 목적이 달라요.',
            },
            {
              label: 'AI 데이터센터는 GPU만 연결하면 네트워크·전원·냉각 없이도 돼요.',
              value: 'm3',
              misconception: 'GPU 외에 CPU·SSD·NIC·네트워크, 충분한 전력·냉각·복구 설계가 있어야 운영돼요.',
            },
          ],
        },
      ],
      rules: [
        { targetKey: 'history', operator: 'contains', expected: 'cold-load', label: '초기 콜드 로딩 관찰', feedbackIfFail: '1단계 초기 콜드 로딩을 확인하세요.' },
        { targetKey: 'history', operator: 'contains', expected: 'resident-infer', label: '상주 추론 관찰', feedbackIfFail: '2단계 모델 상주 추론을 확인하세요.' },
        { targetKey: 'history', operator: 'contains', expected: 'checkpoint', label: '체크포인트 저장 관찰', feedbackIfFail: '3단계 학습 체크포인트 저장을 확인하세요.' },
        { targetKey: 'history', operator: 'contains', expected: 'two-servers', label: '분산 2대 서버 네트워크 관찰', feedbackIfFail: '서버 규모를 분산 2대 서버로 설정해 보세요.' },
        { targetKey: 'answer', operator: 'eq', expected: 'resident-vs-cold', label: '정답 원리 선택', feedbackIfFail: '상주 추론과 스토리지 계층 구조를 설명한 정답을 선택하세요.' },
      ],
      hints: [
        {
          level: 1,
          title: '상주 추론과 스토리지 I/O',
          description: '모델이 이미 초고속 GPU HBM에 적재되어 있다면 토큰마다 SSD를 읽을 필요가 있을까요?',
          voiceLine: '모델이 이미 초고속 GPU HBM에 적재되어 있다면 토큰마다 SSD를 읽을 필요가 있을까요?',
        },
        {
          level: 2,
          title: '체크포인트와 데이터 영속성',
          description: '학습 도중 정전이나 장애가 발생했을 때 손실을 막기 위해 가중치를 어디에 영구 저장할까요?',
          voiceLine: '학습 도중 정전이나 장애가 발생했을 때 손실을 막기 위해 가중치를 어디에 영구 저장할까요?',
        },
        {
          level: 3,
          title: '분산 인프라 구성 요소',
          description: '수천 대의 가속기를 묶기 위해서는 고속 NIC, InfiniBand/RoCE 네트워크, 전력과 냉각 설비가 필수적입니다.',
          voiceLine: '수천 대의 가속기를 묶기 위해서는 고속 NIC, 네트워크, 전력과 냉각 설비가 필수적입니다.',
        },
      ],
      voice: {
        intro: '모델이 이미 GPU 메모리에 있는 경우와 저장소에서 처음 적재해야 하는 경우의 경로를 예상해 보세요.',
      },
      successMessage: 'AI 데이터센터의 계층형 스토리지-메모리 파이프라인과 인프라 상호작용을 완벽히 마스터했습니다!',
    },

    // Step 6: Synthesis
    {
      id: 'step-nand04-s6-synthesis',
      title: '종합 정리: 플래시 미디어에서 초거대 AI 데이터센터까지',
      stepType: 'CONCEPT',
      storyLead: '양자역학적 터널링 전하에서 전 세계를 연결하는 AI 인프라까지',
      prompt:
        '단일 NAND 셀의 양자역학적 부유 게이트 전하 보존에서 시작하여, 블록 단위 지우기 제약, FTL의 주소 가상화와 마모 평준화, PCIe/NVMe DMA 고속 전송, 그리고 수만 대의 GPU와 SSD가 협력하는 AI 데이터센터 파이프라인까지의 유기적 구조를 최종 정리하세요.',
      detailExplanation:
        '• 소자 레벨(Device Level): 절연막으로 둘러싸인 트랩에 갇힌 전하가 문턱전압을 이동시켜 전원 없이도 영구 기억을 형성합니다.\n• 컨트롤러 레벨(FTL Level): 제자리 덮어쓰기가 불가능한 물리적 제약을 극복하기 위해 FTL이 논리주소를 새 페이지로 동적 재매핑하고 가비지 컬렉션(GC)을 수행합니다.\n• 인터페이스 레벨(Interface Level): NVMe 큐잉 프로토콜과 PCIe DMA 엔진이 CPU 부하 없이 데이터를 호스트 DDR로 고속 스트리밍합니다.\n• 시스템 레벨(Data Center Level): 초고속 HBM(추론 연산 상주), 대용량 DDR(시스템 버퍼), 고신뢰성 eSSD(콜드 모델 및 체크포인트 영구 보관), 그리고 고속 네트워크가 유기적으로 맞물려 오늘날의 AI 컴퓨팅을 지탱합니다.',
      whyExplanation:
        '현대 컴퓨팅 시스템은 단 하나의 "만능 메모리"로 이루어질 수 없습니다. 나노초 미만의 속도를 내는 대신 비싸고 휘발성인 SRAM/HBM/DRAM과, 상대적으로 느리지만 테라바이트당 비용이 저렴하고 전원이 꺼져도 데이터를 지키는 NAND 플래시가 계층 구조(Memory-Storage Hierarchy)를 이루어 최적의 성능과 경제성을 달성합니다.',
      initialParams: {},
      rules: [],
      voice: {
        intro:
          '축하합니다! 양자역학적 전하 저장부터 초거대 AI 데이터센터까지, 현대 디지털 스토리지를 지탱하는 핵심 원리를 모두 완주하셨습니다.',
      },
      hints: [
        {
          level: 1,
          title: '계층적 메모리 구조',
          description: 'SRAM, DRAM, NAND 플래시가 각자의 속도, 용량, 비휘발성 특성에 맞춰 어떻게 역할을 분담하는지 되새겨보세요.',
          voiceLine: 'SRAM, DRAM, NAND 플래시가 각자의 속도, 용량, 비휘발성 특성에 맞춰 어떻게 역할을 분담하는지 되새겨보세요.',
        },
      ],
      successMessage: 'Lesson 04 NAND·eSSD에서 AI 데이터센터까지: 데이터의 여행 전체 과정을 성공적으로 완주했습니다!',
    },
  ],
};

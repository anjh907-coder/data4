import { JejuDisaster, QuizQuestion } from '../types';

export const DECISION_TREE_QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    question: '우리가 지난 2차시에 배운 인공지능 모델인 "결정트리(Decision Tree)"는 어떤 놀이와 가장 비슷할까요?',
    options: [
      '질문과 대답(예/아니오)으로 정답을 좁혀가는 "스무고개 놀이"',
      '운에 맡겨 번호를 뽑는 "제비뽑기 놀이"',
      '모두 숨고 한 명이 찾는 "숨바꼭질 놀이"',
      '규칙 없이 주사위를 던지는 "보드게임"'
    ],
    answerIndex: 0,
    hint: '힌트: 나뭇가지처럼 질문을 하나씩 던지며 "네", "아니오"로 가지를 쳐 나가는 모습을 떠올려 보세요!',
    explanation: '정답입니다! 결정트리는 마치 "스무고개 놀이"처럼 "바람이 40m/s 이상인가요?", "비가 200mm 이상인가요?"와 같은 기준 질문을 던져 데이터를 분류하거나 예측하는 AI 모델입니다.',
    iconType: 'tree'
  },
  {
    id: 2,
    question: '결정트리(Decision Tree)의 구조에서 데이터를 나누는 기준이 되는 "질문" 부분을 무엇이라고 부를까요?',
    options: [
      '결과를 나타내는 "잎 노드(Leaf Node)"',
      '질문과 조건을 담고 있는 "조건 노드(Decision Node)"',
      '나무를 심은 "화분 바닥"',
      '나무에 맺힌 달콤한 "열매"'
    ],
    answerIndex: 1,
    hint: '힌트: 질문이나 기준 조건을 담고 있는 동그라미나 네모 상자를 뜻해요.',
    explanation: '맞아요! 결정트리에서 질문을 던지는 부분을 "조건 노드(질문 노드)"라고 부르고, 더 이상 나눌 질문이 없어 최종 결과를 알려주는 마지막 끝부분을 "잎 노드(Leaf Node)"라고 불러요.',
    iconType: 'question'
  },
  {
    id: 3,
    question: '결정트리 모델을 사용해서 "제주도 태풍 피해가 클까, 작을까?"를 예측하려고 합니다. 다음 중 결정트리의 질문으로 가장 적절한 것은?',
    options: [
      '"오늘 아침에 먹은 밥이 맛있었나요?"',
      '"순간최대풍속이 40m/s 이상으로 강한가요?"',
      '"태풍의 이름이 마음에 드나요?"',
      '"내일 날짜가 짝수인가요?"'
    ],
    answerIndex: 1,
    hint: '힌트: 태풍 피해와 직접적인 과학적 관련이 있는 데이터를 골라보세요!',
    explanation: '훌륭해요! AI가 정확한 예측을 하려면 "순간최대풍속", "일최대강수량", "중심기압"처럼 재난 피해와 직접적으로 관련된 핵심 데이터를 질문 기준(조건)으로 사용해야 합니다.',
    iconType: 'wind'
  }
];

export const JEJU_DISASTER_DATASET: JejuDisaster[] = [
  {
    id: 'maemi_2003',
    name: '태풍 매미 (2003)',
    year: 2003,
    centerPressure: 950,
    maxWindSpeed: 60.0,
    maxDailyRain: 187,
    damageMillionWon: 48150,
    category: '태풍',
    featureNote: '역대급 강풍(60m/s)으로 건물 지붕 및 과수원, 정전 피해 극심'
  },
  {
    id: 'nari_2007',
    name: '태풍 나리 (2007)',
    year: 2007,
    centerPressure: 960,
    maxWindSpeed: 52.0,
    maxDailyRain: 420,
    damageMillionWon: 130740,
    category: '태풍',
    featureNote: '제주 역사상 최악의 집중호우로 제주시 하천 범람 및 대규모 침수'
  },
  {
    id: 'chaba_2016',
    name: '태풍 차바 (2016)',
    year: 2016,
    centerPressure: 955,
    maxWindSpeed: 56.5,
    maxDailyRain: 501,
    damageMillionWon: 23120,
    category: '태풍',
    featureNote: '한라산 윗세오름에 600mm 폭우와 56m/s 돌풍으로 하천 범람'
  },
  {
    id: 'hinnamnor_2022',
    name: '태풍 힌남노 (2022)',
    year: 2022,
    centerPressure: 945,
    maxWindSpeed: 43.7,
    maxDailyRain: 375,
    damageMillionWon: 31450,
    category: '태풍',
    featureNote: '매우 강한 중심기압(945hPa)과 높은 파도로 해안가 월파 및 정전 발생'
  },
  {
    id: 'bolaven_2012',
    name: '태풍 볼라벤 (2012)',
    year: 2012,
    centerPressure: 960,
    maxWindSpeed: 51.8,
    maxDailyRain: 240,
    damageMillionWon: 27800,
    category: '태풍',
    featureNote: '강한 바람으로 가로수 전도, 정전, 감귤 낙과 피해 집중'
  },
  {
    id: 'kongrey_2018',
    name: '태풍 콩레이 (2018)',
    year: 2018,
    centerPressure: 975,
    maxWindSpeed: 41.2,
    maxDailyRain: 310,
    damageMillionWon: 12400,
    category: '태풍',
    featureNote: '많은 강수량으로 농경지 침수 및 도로 일시 통제'
  },
  {
    id: 'maysak_2020',
    name: '태풍 마이삭 (2020)',
    year: 2020,
    centerPressure: 950,
    maxWindSpeed: 49.2,
    maxDailyRain: 471,
    damageMillionWon: 19800,
    category: '태풍',
    featureNote: '산간 지역 1000mm 이상 폭우와 강풍으로 4만여 가구 정전'
  },
  {
    id: 'bavi_2020',
    name: '태풍 바비 (2020)',
    year: 2020,
    centerPressure: 955,
    maxWindSpeed: 47.4,
    maxDailyRain: 150,
    damageMillionWon: 8900,
    category: '태풍',
    featureNote: '비보다는 바람 위주의 태풍으로 간판 탈락 및 신호등 파손'
  },
  {
    id: 'soulik_2018',
    name: '태풍 솔릭 (2018)',
    year: 2018,
    centerPressure: 965,
    maxWindSpeed: 62.0,
    maxDailyRain: 210,
    damageMillionWon: 14200,
    category: '태풍',
    featureNote: '진달래밭 순간풍속 62m/s 기록, 위성 기지국 및 탑 훼손'
  },
  {
    id: 'muifa_2011',
    name: '태풍 무이파 (2011)',
    year: 2011,
    centerPressure: 970,
    maxWindSpeed: 41.0,
    maxDailyRain: 320,
    damageMillionWon: 15300,
    category: '태풍',
    featureNote: '느린 이동속도로 장시간 비바람 지속되어 방파제 파손'
  },
  {
    id: 'omais_2021',
    name: '태풍 오마이스 (2021)',
    year: 2021,
    centerPressure: 995,
    maxWindSpeed: 24.5,
    maxDailyRain: 220,
    damageMillionWon: 3400,
    category: '태풍',
    featureNote: '소형 태풍이나 야간 집중호우로 주택 마당 일시 침수'
  },
  {
    id: 'danas_2019',
    name: '태풍 다나스 (2019)',
    year: 2019,
    centerPressure: 990,
    maxWindSpeed: 26.3,
    maxDailyRain: 390,
    damageMillionWon: 4600,
    category: '태풍',
    featureNote: '비구름이 집중되어 농경지 침수 및 항공편 다수 결항'
  },
  {
    id: 'heavy_rain_2019',
    name: '2019 여름 장마철 호우',
    year: 2019,
    centerPressure: 1004,
    maxWindSpeed: 18.5,
    maxDailyRain: 285,
    damageMillionWon: 2900,
    category: '호우',
    featureNote: '바람은 강하지 않았으나 지속적인 비로 밭작물 유실'
  },
  {
    id: 'heavy_rain_2021',
    name: '2021 가을 국지성 호우',
    year: 2021,
    centerPressure: 1008,
    maxWindSpeed: 15.2,
    maxDailyRain: 190,
    damageMillionWon: 1100,
    category: '호우',
    featureNote: '국지적 강우로 도로 배수구 역류 등 경미한 피해'
  },
  {
    id: 'calm_rain_2023',
    name: '2023 일반 봄비와 바람',
    year: 2023,
    centerPressure: 1014,
    maxWindSpeed: 12.0,
    maxDailyRain: 45,
    damageMillionWon: 95,
    category: '강풍',
    featureNote: '일반적인 날씨로 특별한 재난 피해 없음'
  }
];

// Helper to format million won into Korean friendly reading (e.g., "1억 3,074만 원")
export function formatDamageText(millionWon: number): string {
  if (millionWon < 100) {
    return `${Math.round(millionWon).toLocaleString()}백만 원`;
  }
  const eok = Math.floor(millionWon / 100);
  const remainderMillion = Math.round(millionWon % 100);
  if (remainderMillion === 0) {
    return `약 ${eok.toLocaleString()}억 원`;
  }
  return `약 ${eok.toLocaleString()}억 ${remainderMillion}백만 원`;
}

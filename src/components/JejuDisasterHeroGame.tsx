import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  CloudLightning,
  Wind,
  Droplets,
  Coins,
  RefreshCw,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  Building,
  Radio,
  Waves,
  Eye,
  TreeDeciduous,
  BellRing,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  X
} from 'lucide-react';

// 방재 시설 아이템 정의
interface Facility {
  id: string;
  name: string;
  cost: number; // 코인 (예산)
  category: '배수/하천' | '해안/바람' | '경보/관측' | '도시/대피';
  icon: string;
  description: string;
  benefit: string;
  reductionPercentage: number; // 피해 경감률 (%)
  realLifeNote: string;
}

const FACILITIES: Facility[] = [
  {
    id: 'drainage_pump',
    name: '스마트 배수펌프장 확충',
    cost: 30,
    category: '배수/하천',
    icon: '🌊',
    description: '저지대와 상습 침수 구역의 빗물을 바다로 신속히 뿜어내 침수를 막아요.',
    benefit: '도심 침수 피해 최대 25% 경감',
    reductionPercentage: 25,
    realLifeNote: '제주도는 제주시 동문시장과 탑동 등 주요 저지대에 대용량 배수펌프장을 24시간 가동 체계로 구축했어요.'
  },
  {
    id: 'retention_basin',
    name: '하천변 저류지(빗물 저장소)',
    cost: 35,
    category: '배수/하천',
    icon: '🏞️',
    description: '한라산에서 급류로 쏟아지는 폭우를 임시로 가두어 하천 범람을 차단해요.',
    benefit: '하천 범람 및 농경지 침수 30% 경감',
    reductionPercentage: 30,
    realLifeNote: '제주도 한천, 병문천, 산지천 상류에는 거대한 저류지가 설치되어 수백만 톤의 빗물을 가둘 수 있어요.'
  },
  {
    id: 'seawall_reinforce',
    name: '해안 방파제 및 테트라포드 보강',
    cost: 25,
    category: '해안/바람',
    icon: '🧱',
    description: '태풍으로 일어나는 거대한 너울성 파도(해일)를 깨뜨려 해안 도로 파손을 막아요.',
    benefit: '해안가 상가 및 항만 파손 20% 경감',
    reductionPercentage: 20,
    realLifeNote: '제주 해안도로와 포구에는 특수 콘크리트 삼각 블록(테트라포드)과 월파 방지벽을 보강하고 있어요.'
  },
  {
    id: 'windbreak_forest',
    name: '해안 방풍림 & 가로수 안전 지지대',
    cost: 15,
    category: '해안/바람',
    icon: '🌲',
    description: '돌풍의 위력을 분산시키고 가로수 전도와 유리창 파손, 간판 탈락을 줄여요.',
    benefit: '강풍 비산물 피해 15% 경감',
    reductionPercentage: 15,
    realLifeNote: '제주 감귤밭을 지키는 삼나무 방풍림과 삼다도 해안 곰솔숲은 자연이 준 최고의 방재 자원입니다.'
  },
  {
    id: 'smart_cctv_alert',
    name: 'AI 스마트 CCTV & 하천 수위계',
    cost: 20,
    category: '경보/관측',
    icon: '📡',
    description: 'AI가 하천 수위와 월파 위험을 실시간 감지해 위험 시 도로 차단기를 자동 작동시켜요.',
    benefit: '인명 피해 0명 달성 & 차량 침수 20% 경감',
    reductionPercentage: 20,
    realLifeNote: '제주도 재난안전대책본부는 섬 전역의 수위 관측 센서와 CCTV를 AI로 연결해 관제하고 있어요.'
  },
  {
    id: 'emergency_broadcast',
    name: '마을 긴급 방송 & 정밀 재난문자',
    cost: 15,
    category: '경보/관측',
    icon: '📢',
    description: '읍면동 단위로 위험 지역 주민에게 대피 골든타임을 확보해 신속히 대피시켜요.',
    benefit: '주민 대피 소요 시간 70% 단축',
    reductionPercentage: 15,
    realLifeNote: '제주형 재난 긴급문자(CBS) 시스템은 지역별 맞춤형(기상특보, 도로통제, 대피소 위치)으로 발송됩니다.'
  },
  {
    id: 'evacuation_shelter',
    name: '내진/내풍 재난대피소 점검 및 구호품',
    cost: 20,
    category: '도시/대피',
    icon: '🏫',
    description: '정전 시에도 작동하는 비상 발전기와 텐트, 식수, 비상약을 충분히 비축해요.',
    benefit: '이재민 구호 안정성 100% 확보 & 2차 피해 15% 경감',
    reductionPercentage: 15,
    realLifeNote: '제주도 내 학교 체육관, 주민센터 등이 임시 주거시설로 지정되어 비상식량과 응급키트를 상시 관리해요.'
  },
  {
    id: 'underground_powerline',
    name: '전선 지하 매설(지중화) 공사',
    cost: 30,
    category: '도시/대피',
    icon: '⚡',
    description: '강풍에 전신주가 쓰러져 발생하는 대규모 정전과 감전 사고를 사전에 차단해요.',
    benefit: '정전 피해 85% 차단 & 도시 복구 시간 50% 단축',
    reductionPercentage: 25,
    realLifeNote: '태풍 매미·차바 당시 수만 가구가 정전된 교훈으로, 제주 도심과 주요 취약지 전선을 땅속에 묻고 있어요.'
  }
];

// 가상 태풍 시나리오
interface TyphoonScenario {
  id: string;
  name: string;
  level: string;
  maxWind: number; // m/s
  rainfall: number; // mm
  rawDamageWon: number; // 방재 대책 없을 때 예상 피해액 (억 원)
  description: string;
}

const SCENARIOS: TyphoonScenario[] = [
  {
    id: 'typhoon_chaba_grade',
    name: '슈퍼 태풍 ‘백록’ (차바급 초강력 태풍)',
    level: '초강력 (특급 경계)',
    maxWind: 56,
    rainfall: 450,
    rawDamageWon: 350, // 350억 원
    description: '제주도를 직격하며 시간당 80mm 폭우와 순간풍속 50m/s 이상의 강풍을 동반합니다!'
  },
  {
    id: 'typhoon_nari_grade',
    name: '집중호우형 태풍 ‘탐라’ (나리급 물폭탄)',
    level: '매우 강 (폭우 집중)',
    maxWind: 42,
    rainfall: 580,
    rawDamageWon: 280, // 280억 원
    description: '한라산 산간과 도심 하천에 600mm에 달하는 기록적인 폭우를 퍼붓습니다!'
  },
  {
    id: 'typhoon_maemi_grade',
    name: '기록적 강풍 태풍 ‘돌풍이’ (매미급 강풍)',
    level: '강 (돌풍·해일)',
    maxWind: 61,
    rainfall: 260,
    rawDamageWon: 240, // 240억 원
    description: '비보다는 무시무시한 폭풍과 10m 넘는 해일이 해안가를 강타합니다!'
  }
];

// 실제 제주 & 정부 방재 노력 카드 뉴스 데이터
interface RealEffortNews {
  id: string;
  title: string;
  tag: string;
  icon: string;
  summary: string;
  details: string[];
  funFact: string;
}

const REAL_EFFORT_NEWS: RealEffortNews[] = [
  {
    id: 'smart_monitoring',
    title: '제주 24시간 스마트 재난안전대책본부',
    tag: 'ICT 첨단 모니터링',
    icon: '🖥️',
    summary: '위성, 기상 레이더, AI CCTV, 드론을 총동원해 태풍 경로와 제주 전역을 24시간 감시해요.',
    details: [
      '제주도 전역 3,000대 이상의 CCTV를 통합 관제실에서 한눈에 확인해요.',
      '하천 수위가 70%를 넘으면 자동으로 인근 도로 진입 차단기가 내려가요.',
      '풍수해 취약 지역에 사물인터넷(IoT) 침수 센서가 설치되어 1초 만에 알람을 울려요.'
    ],
    funFact: '알고 있나요? 제주도 재난안전대책본부 대형 화면은 영화에 나오는 우주 통제실처럼 생겼답니다!'
  },
  {
    id: 'underground_retention',
    title: '도심을 지키는 든든한 방패, 제주 한천 저류지',
    tag: '물폭탄 막는 비밀 수조',
    icon: '🏞️',
    summary: '2007년 태풍 나리 이후 만든 거대한 저류지가 한라산에서 쏟아지는 물을 받아내요.',
    details: [
      '제주시 4개 주요 하천 상류에 총 14개소 이상의 거대 저류지가 있어요.',
      '약 180만 톤 이상의 물을 임시로 가둘 수 있는 엄청난 규모예요 (수영장 수천 개 크기!).',
      '홍수 조절 문을 열고 닫으며 도심 동문시장 일대 범람을 획기적으로 막아냈어요.'
    ],
    funFact: '태풍 차바와 힌남노 때 저류지 수문을 열어 수십만 명의 시민과 상가를 침수로부터 구했어요!'
  },
  {
    id: 'cbs_alert',
    title: '골든타임을 지키는 긴급재난문자와 안전 디딤돌',
    tag: '초스피드 시민 전파',
    icon: '📱',
    summary: '‘삐-’ 소리와 함께 울리는 긴급재난문자는 우리 가족을 지켜주는 가장 빠른 약속이에요.',
    details: [
      '대한민국 기상청과 행정안전부가 위험 지역 반경에 있는 모든 스마트폰에 즉각 발송해요.',
      '‘안전디딤돌’ 앱을 설치하면 기지국이 끊겨도 주변 대피소 위치와 행동요령을 볼 수 있어요.',
      '외국인 관광객을 위한 다국어(영어, 중국어, 일본어) 재난 알림 서비스도 운영돼요.'
    ],
    funFact: '문자를 받았을 때는 바깥 구경을 가지 말고, 문과 창문을 꼭 닫고 라디오나 뉴스에 귀 기울여야 해요!'
  },
  {
    id: 'jeju_windbreak',
    title: '선조들의 지혜가 담긴 돌담과 삼나무 방풍림',
    tag: '제주 전통 & 생태 방재',
    icon: '🪵',
    summary: '바람이 많은 제주는 옛날부터 돌담과 나무를 활용해 태풍과 싸워왔어요.',
    details: [
      '제주 밭담은 구멍이 숭숭 뚫려 있어 강한 바람이 그대로 빠져나가 무너지지 않아요.',
      '감귤밭 둘레를 키 큰 삼나무로 둘러싸서 과일이 바람에 떨어지는 것을 막아요.',
      '해안가에는 곰솔(해송) 숲을 가꾸어 모래가 날리고 바닷물 소금기가 육지로 튀는 것을 막아줘요.'
    ],
    funFact: '돌담의 구멍은 미완성이 아니라 강풍의 힘을 흩어지게 만드는 선조들의 과학적인 유체역학 기술이에요!'
  }
];

export const JejuDisasterHeroGame: React.FC = () => {
  // 예산 시스템 (기본 100 코인)
  const TOTAL_BUDGET = 100;
  const [selectedFacilityIds, setSelectedFacilityIds] = useState<string[]>([
    'drainage_pump',
    'smart_cctv_alert'
  ]);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('typhoon_chaba_grade');

  // 시뮬레이션 상태
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationFinished, setSimulationFinished] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);

  // 카드 뉴스 팝업 상태
  const [selectedNews, setSelectedNews] = useState<RealEffortNews | null>(null);

  // 현재 선택된 시나리오
  const currentScenario =
    SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  // 사용한 예산 계산
  const spentBudget = selectedFacilityIds.reduce((sum, id) => {
    const f = FACILITIES.find((item) => item.id === id);
    return sum + (f ? f.cost : 0);
  }, 0);

  const remainingBudget = TOTAL_BUDGET - spentBudget;

  // 총 방재 경감률 계산 (중복 할인 방식 적용: 피해를 줄이고 남은 잔여 피해에서 다음 방재가 추가 경감)
  // 예: 1 - ((1 - r1) * (1 - r2) * ...)
  const totalReductionRatio = selectedFacilityIds.reduce((remainingRatio, id) => {
    const f = FACILITIES.find((item) => item.id === id);
    if (!f) return remainingRatio;
    const factor = (100 - f.reductionPercentage) / 100;
    return remainingRatio * factor;
  }, 1.0);

  const totalReductionPercent = Math.min(
    92,
    Math.round((1 - totalReductionRatio) * 100)
  );

  // 최종 예상 피해액 (억 원 단위)
  const rawDamage = currentScenario.rawDamageWon;
  const finalDamage = Math.max(
    8,
    Math.round(rawDamage * (1 - totalReductionPercent / 100))
  );
  const savedDamage = rawDamage - finalDamage;

  // 시설 선택 토글
  const toggleFacility = (facility: Facility) => {
    if (simulationFinished) {
      setSimulationFinished(false);
    }

    if (selectedFacilityIds.includes(facility.id)) {
      setSelectedFacilityIds(selectedFacilityIds.filter((id) => id !== facility.id));
    } else {
      if (remainingBudget < facility.cost) {
        // 예산 초과
        alert(`🚨 예산이 부족해요! 남은 예산은 ${remainingBudget}코인인데, 이 시설은 ${facility.cost}코인이 필요합니다.`);
        return;
      }
      setSelectedFacilityIds([...selectedFacilityIds, facility.id]);
    }
  };

  // 모든 시설 초기화
  const resetSelection = () => {
    setSelectedFacilityIds([]);
    setSimulationFinished(false);
  };

  // 추천 방재 패키지 선택
  const applyRecommendedPackage = (type: 'balanced' | 'flood' | 'smart') => {
    setSimulationFinished(false);
    if (type === 'balanced') {
      setSelectedFacilityIds(['drainage_pump', 'seawall_reinforce', 'smart_cctv_alert', 'emergency_broadcast']);
    } else if (type === 'flood') {
      setSelectedFacilityIds(['drainage_pump', 'retention_basin', 'smart_cctv_alert', 'emergency_broadcast']);
    } else {
      setSelectedFacilityIds(['smart_cctv_alert', 'emergency_broadcast', 'evacuation_shelter', 'underground_powerline']);
    }
  };

  // 시뮬레이션 실행 핸들러
  const handleStartSimulation = () => {
    setIsSimulating(true);
    setSimulationFinished(false);
    setSimStep(1);

    const timer1 = setTimeout(() => setSimStep(2), 700);
    const timer2 = setTimeout(() => setSimStep(3), 1400);
    const timer3 = setTimeout(() => {
      setIsSimulating(false);
      setSimulationFinished(true);
      setSimStep(4);

      if (totalReductionPercent >= 60) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }
    }, 2100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* 1. 인트로 히어로 배너 */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-700/40">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold tracking-wide">
              <Shield className="w-3.5 h-3.5" />
              <span>미션: 제주 방재 사령관 도전!</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>제주 방재 히어로 게임</span>
              <span className="text-2xl">🦸‍♂️🏝️</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              태풍이 다가오고 있어요! 주어진 <strong>100 코인 예산</strong> 안에서 가장 효과적인 방재 시설을 설치해보세요.
              우리가 미리 꼼꼼히 대비할수록 제주도의 인명 피해와 재산 피해가 획기적으로 줄어듭니다!
            </p>
          </div>

          {/* 예산 디스플레이 박스 */}
          <div className="w-full md:w-auto shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-row md:flex-col items-center justify-between md:justify-center gap-3 text-center min-w-[200px]">
            <div className="text-left md:text-center">
              <span className="text-xs text-slate-300 font-semibold block">남은 방재 예산</span>
              <div className="flex items-center gap-2 mt-1">
                <Coins className="w-7 h-7 text-amber-400 animate-bounce" />
                <span
                  className={`text-3xl font-black ${
                    remainingBudget < 20
                      ? 'text-rose-400'
                      : remainingBudget < 50
                      ? 'text-amber-300'
                      : 'text-emerald-400'
                  }`}
                >
                  {remainingBudget}
                </span>
                <span className="text-xs text-slate-300 font-bold">/ 100 코인</span>
              </div>
            </div>

            <div className="text-right md:text-center">
              <span className="text-[11px] text-slate-300 block">설치한 시설</span>
              <span className="text-sm font-bold text-white">
                {selectedFacilityIds.length}개 선택됨
              </span>
            </div>
          </div>
        </div>

        {/* 빠른 추천 프리셋 버튼들 */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-300 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 추천 방재 전략:
          </span>
          <button
            onClick={() => applyRecommendedPackage('flood')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition-colors cursor-pointer font-medium"
          >
            🌊 폭우·침수 철벽 대비 패키지
          </button>
          <button
            onClick={() => applyRecommendedPackage('balanced')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition-colors cursor-pointer font-medium"
          >
            ⚖️ 균형 잡힌 종합 방재 패키지
          </button>
          <button
            onClick={() => applyRecommendedPackage('smart')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition-colors cursor-pointer font-medium"
          >
            📡 스마트 경보 &amp; 시민대피 패키지
          </button>
          <button
            onClick={resetSelection}
            className="ml-auto px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-200 transition-colors cursor-pointer font-medium flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> 처음부터 다시 고르기
          </button>
        </div>
      </div>

      {/* 2. 단계 1: 다가오는 태풍 시나리오 선택 */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-orange-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
              1
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              다가오는 가상 태풍 시나리오를 선택하세요
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">실제 과거 태풍 데이터 기반</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SCENARIOS.map((sc) => {
            const isSelected = activeScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  setActiveScenarioId(sc.id);
                  setSimulationFinished(false);
                }}
                className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 text-indigo-600">
                    <CheckCircle2 className="w-5 h-5 fill-indigo-600 text-white" />
                  </span>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <CloudLightning className="w-5 h-5 text-indigo-600" />
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                    {sc.level}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-1">{sc.name}</h4>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">{sc.description}</p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-600 block text-[11px]">최대 풍속</span>
                    <strong className="text-slate-900">{sc.maxWind} m/s</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 block text-[11px]">예상 강수량</span>
                    <strong className="text-slate-900">{sc.rainfall} mm</strong>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-lg">
                  대비 없을 시 피해: 약 {sc.rawDamageWon}억 원
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. 단계 2: 방재 시설 장바구니/설치 카드 그리드 */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-orange-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
              2
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                방재 시설 및 안전 대책을 설치하세요 (예산 관리)
              </h3>
              <p className="text-xs text-slate-500">
                각 시설의 비용과 경감 효과를 꼼꼼히 비교해 최선의 방재 대책을 세워보세요!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-100 px-3 py-1.5 rounded-xl font-semibold text-slate-700">
            <span>남은 예산:</span>
            <strong className="text-indigo-600 text-sm">{remainingBudget} 코인</strong>
          </div>
        </div>

        {/* 시설 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FACILITIES.map((facility) => {
            const isInstalled = selectedFacilityIds.includes(facility.id);
            const canAfford = remainingBudget >= facility.cost || isInstalled;

            return (
              <div
                key={facility.id}
                onClick={() => toggleFacility(facility)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative select-none ${
                  isInstalled
                    ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
                    : canAfford
                    ? 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                    : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* 상단 뱃지 및 아이콘 */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-2xl p-1.5 rounded-xl bg-white shadow-xs border border-slate-100">
                      {facility.icon}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isInstalled
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      <Coins className="w-3 h-3 text-amber-500" />
                      {facility.cost} 코인
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-sm mb-1 leading-snug">
                    {facility.name}
                  </h4>
                  <span className="inline-block text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md mb-2">
                    {facility.category}
                  </span>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {facility.description}
                  </p>
                </div>

                {/* 하단 효과 및 설치 상태 버튼 */}
                <div className="pt-3 border-t border-slate-200/80 space-y-2">
                  <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{facility.benefit}</span>
                  </div>

                  <div
                    className={`w-full py-1.5 px-3 rounded-xl text-center text-xs font-bold transition-colors ${
                      isInstalled
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : canAfford
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isInstalled ? '✓ 설치 완료 (클릭 시 취소)' : '+ 설치하기'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. 단계 3: 시뮬레이션 실행 및 결과 시각화 */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-orange-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
              3
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              태풍 내습 시뮬레이션 &amp; 피해 경감 분석
            </h3>
          </div>

          <button
            onClick={handleStartSimulation}
            disabled={isSimulating || selectedFacilityIds.length === 0}
            className={`px-5 py-2.5 rounded-2xl font-extrabold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isSimulating
                ? 'bg-slate-400 text-white cursor-wait'
                : selectedFacilityIds.length === 0
                ? 'bg-slate-200 text-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white transform hover:-translate-y-0.5'
            }`}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>태풍 시뮬레이션 계산 중...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>제주 방재 시뮬레이션 시작!</span>
              </>
            )}
          </button>
        </div>

        {/* 시뮬레이션 로딩 중 애니메이션 단계 */}
        {isSimulating && (
          <div className="my-6 p-6 rounded-2xl bg-indigo-950 text-white flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
            <div className="relative">
              <CloudLightning className="w-14 h-14 text-amber-400 animate-bounce" />
              <Wind className="w-8 h-8 text-teal-300 absolute -top-1 -right-3 animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-teal-300">
                {simStep === 1 && '🌪️ 태풍이 서귀포 남쪽 해상에서 상륙하고 있습니다...'}
                {simStep === 2 && '🌊 집중호우와 높은 파도가 해안과 하천을 강타합니다...'}
                {simStep === 3 && '🛡️ 설치한 스마트 방재 시설들이 작동하여 물길을 돌리고 주민을 대피시킵니다!'}
              </p>
              <p className="text-xs text-slate-400">데이터 기반 실시간 피해 저감 효과를 연산하고 있어요.</p>
            </div>
            {/* 프로그레스 바 */}
            <div className="w-64 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-amber-400 to-teal-400 h-full transition-all duration-500"
                style={{ width: `${simStep * 33}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* 결과 비교 그래프 & 요약 카드 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* 왼쪽: 시각적 피해 비교 막대 그래프 */}
          <div className="lg:col-span-7 bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>📊 피해 규모 비교 (방재 대책 효과)</span>
              </h4>
              <span className="text-xs font-semibold text-slate-500">
                {currentScenario.name.split(' ')[0]} 기준
              </span>
            </div>

            <div className="space-y-6">
              {/* 1. 대비 없을 때의 예상 피해 */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-bold">
                  <span className="text-rose-600 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> 대비 시설이 전혀 없을 때
                  </span>
                  <span className="text-rose-700">{rawDamage}억 원 (100%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-6 p-0.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2 text-[10px] font-black text-white"
                    style={{ width: '100%' }}
                  >
                    피해 막대 100%
                  </div>
                </div>
              </div>

              {/* 2. 학생이 선택한 방재 시설 설치 후의 피해 */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-bold">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 우리 팀의 방재 대책 적용 후
                  </span>
                  <span className="text-emerald-700">
                    약 {finalDamage}억 원 (
                    {Math.round((finalDamage / rawDamage) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-6 p-0.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2 text-[10px] font-black text-white"
                    style={{
                      width: `${Math.max(12, Math.round((finalDamage / rawDamage) * 100))}%`
                    }}
                  >
                    {Math.round((finalDamage / rawDamage) * 100)}%
                  </div>
                </div>
              </div>

              {/* 절감 효과 인포박스 */}
              <div className="p-3.5 rounded-xl bg-emerald-100/70 border border-emerald-300/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <TrendingDown className="w-5 h-5 text-emerald-700" />
                  <span>시뮬레이션 피해 절감 효과</span>
                </div>
                <div className="text-right">
                  <span className="text-sm sm:text-base font-black text-emerald-800">
                    약 {savedDamage}억 원 절약! ({totalReductionPercent}% 경감)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 사령관 평가 및 깨달음 카드 */}
          <div className="lg:col-span-5 bg-gradient-to-b from-orange-50/80 to-amber-50/40 p-5 sm:p-6 rounded-2xl border border-orange-200 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎖️</span>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    제주 방재 사령관 종합 평가
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    선택한 시설 {selectedFacilityIds.length}개 / 잔여 예산 {remainingBudget}코인
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white shadow-xs border border-orange-100 text-xs space-y-2">
                <p className="text-slate-800 font-bold">
                  {totalReductionPercent >= 70 ? (
                    <span className="text-emerald-700">
                      🌟 완벽한 특급 방재! (재난 복구 영웅)
                    </span>
                  ) : totalReductionPercent >= 50 ? (
                    <span className="text-blue-700">
                      👍 훌륭한 안전망 구축! (우수 방재관)
                    </span>
                  ) : (
                    <span className="text-amber-700">
                      ⚠️ 조금 더 꼼꼼한 시설 투자가 필요해요!
                    </span>
                  )}
                </p>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {totalReductionPercent >= 70
                    ? '배수, 저류, 경보 시스템이 유기적으로 연결되어 폭우와 강풍을 모두 성공적으로 방어했습니다. 시민들이 안심하고 대피할 수 있는 골든타임을 확보했어요!'
                    : totalReductionPercent >= 50
                    ? '주요 피해는 크게 줄였지만, 복합적인 재난(해일 또는 정전)에 취약할 수 있어요. 저류지나 지중화 시설을 추가로 보완해보면 어떨까요?'
                    : '한 가지 분야의 시설만 선택하면 다른 원인(하천 범람, 정전 등)으로 큰 피해가 생길 수 있어요. 예산을 균형 있게 활용해 보세요!'}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 bg-white/60 p-2.5 rounded-lg border border-orange-150">
                💡 <strong>배운 점:</strong> 재난 피해는 자연현상 자체보다 <strong>"우리가 얼마나 미리 계획하고 대비했는가"</strong>에 따라 수백억 원 이상 차이가 날 수 있습니다.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 실제 대한민국 & 제주도의 재난 대비 노력 (카드 뉴스 영역) */}
      <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold mb-2">
              <Eye className="w-3.5 h-3.5" />
              <span>실제 세상에서는 어떻게 대비할까요?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              실제 제주도와 대한민국의 스마트 방재 탐구
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              카드를 클릭하면 더 자세한 실제 사진과 흥미로운 방재 과학 원리를 팝업으로 확인할 수 있어요!
            </p>
          </div>
        </div>

        {/* 4개의 카드 뉴스 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REAL_EFFORT_NEWS.map((news) => (
            <div
              key={news.id}
              onClick={() => setSelectedNews(news)}
              className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/60 rounded-2xl p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:shadow-lg hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 rounded-xl bg-slate-700/60 group-hover:scale-110 transition-transform">
                    {news.icon}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
                    {news.tag}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm mb-2 group-hover:text-teal-300 transition-colors">
                  {news.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                  {news.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs text-teal-400 font-semibold">
                <span>자세히 읽어보기</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. 상세 팝업 모달 (카드 뉴스 클릭 시) */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-slate-100 overflow-hidden text-slate-800">
            {/* 상단 닫기 버튼 */}
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 헤더 */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl p-2.5 rounded-2xl bg-teal-50 border border-teal-100">
                {selectedNews.icon}
              </span>
              <div>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-md">
                  {selectedNews.tag}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  {selectedNews.title}
                </h3>
              </div>
            </div>

            {/* 요약 */}
            <p className="text-xs sm:text-sm text-slate-600 font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4 leading-relaxed">
              {selectedNews.summary}
            </p>

            {/* 상세 불렛 포인트 */}
            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>실제 운영 방식과 과학적 원리:</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {selectedNews.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50/60 p-2.5 rounded-lg">
                    <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 재미있는 팩트 / 팁 */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-5">
              <span className="font-bold flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> 알고 있나요?
              </span>
              <p className="leading-relaxed">{selectedNews.funFact}</p>
            </div>

            {/* 닫기 액션 */}
            <button
              onClick={() => setSelectedNews(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              이해했어요! 닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

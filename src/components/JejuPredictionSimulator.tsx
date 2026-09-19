import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { JEJU_DISASTER_DATASET, formatDamageText } from '../data/jejuData';
import { JejuDisaster, PredictionResult } from '../types';
import { ShieldAlert, Play, Sparkles, AlertTriangle, CheckCircle, Code2, RotateCcw } from 'lucide-react';

interface JejuPredictionSimulatorProps {
  onNextTab?: () => void;
}

export const JejuPredictionSimulator: React.FC<JejuPredictionSimulatorProps> = ({ onNextTab }) => {
  // Simulator inputs
  const [pressure, setPressure] = useState<number>(955);
  const [windSpeed, setWindSpeed] = useState<number>(45);
  const [dailyRain, setDailyRain] = useState<number>(320);
  const [kValue, setKValue] = useState<number>(3);

  // Prediction result state
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showEntryCode, setShowEntryCode] = useState<boolean>(false);

  // Presets
  const presets = [
    {
      name: '태풍 매미급 (초강풍형)',
      icon: '💨',
      pressure: 950,
      windSpeed: 59,
      dailyRain: 190
    },
    {
      name: '태풍 나리급 (기록적 폭우형)',
      icon: '🌊',
      pressure: 960,
      windSpeed: 52,
      dailyRain: 430
    },
    {
      name: '태풍 힌남노급 (복합 강력형)',
      icon: '🌀',
      pressure: 945,
      windSpeed: 44,
      dailyRain: 380
    },
    {
      name: '보통 장마철 비바람',
      icon: '🌧️',
      pressure: 1005,
      windSpeed: 18,
      dailyRain: 120
    }
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setPressure(p.pressure);
    setWindSpeed(p.windSpeed);
    setDailyRain(p.dailyRain);
  };

  // kNN Prediction algorithm
  const runKnnPrediction = () => {
    setIsCalculating(true);

    setTimeout(() => {
      // Normalization boundaries based on historical Jeju data
      const minP = 930, maxP = 1015;
      const minW = 10, maxW = 65;
      const minR = 0, maxR = 550;

      // Normalize current query
      const qP = (pressure - minP) / (maxP - minP);
      const qW = (windSpeed - minW) / (maxW - minW);
      const qR = (dailyRain - minR) / (maxR - minR);

      // Calculate Euclidean distance to all historical points
      const scored = JEJU_DISASTER_DATASET.map((d) => {
        const dP = (d.centerPressure - minP) / (maxP - minP);
        const dW = (d.maxWindSpeed - minW) / (maxW - minW);
        const dR = (d.maxDailyRain - minR) / (maxR - minR);

        // Distance in 3D feature space
        const dist = Math.sqrt(
          Math.pow(qP - dP, 2) + Math.pow(qW - dW, 2) + Math.pow(qR - dR, 2)
        );

        // Similarity percentage (approx)
        const similarityPercent = Math.max(5, Math.round((1 - Math.min(1, dist / 1.5)) * 100));

        return {
          disaster: d,
          distance: Math.round(dist * 100) / 100,
          similarityPercent
        };
      });

      // Sort ascending by distance
      scored.sort((a, b) => a.distance - b.distance);

      // Top K neighbors
      const neighbors = scored.slice(0, kValue);

      // Weighted average damage
      // Weight = 1 / (dist + 0.05)
      let totalWeight = 0;
      let weightedDamageSum = 0;

      neighbors.forEach((n) => {
        const weight = 1 / (n.distance + 0.08);
        totalWeight += weight;
        weightedDamageSum += n.disaster.damageMillionWon * weight;
      });

      const predictedDamage = Math.round(weightedDamageSum / totalWeight);

      // Determine risk level and safety tips
      let riskLevel: '안전' | '관심' | '주의' | '경계' | '심각' = '관심';
      let safetyTips: string[] = [];

      if (predictedDamage < 1000) {
        riskLevel = '안전';
        safetyTips = [
          '가벼운 우산을 챙기고 비바람에 미끄러지지 않도록 조심해요.',
          '작은 화분이나 날아갈 물건을 안전한 곳으로 치워두세요.'
        ];
      } else if (predictedDamage < 10000) {
        riskLevel = '주의';
        safetyTips = [
          '외출할 때 간판이나 높은 나뭇가지 근처를 피해서 걸어요.',
          '집 안 창문 잠금장치를 확인하고 단단히 닫아두세요.',
          '저지대나 개울가 근처에 가지 마세요.'
        ];
      } else if (predictedDamage < 30000) {
        riskLevel = '경계';
        safetyTips = [
          '불필요한 외출을 멈추고 부모님과 함께 안전한 실내에 머물러요.',
          '창문에 테이프나 신문지를 붙여 강풍 파손을 대비해요.',
          '하천 범람 위험이 있는 곳은 절대 접근 금지예요.'
        ];
      } else {
        riskLevel = '심각';
        safetyTips = [
          '🚨 즉시 안전한 실내로 대피하고 외출을 전면 금지하세요!',
          '침수 위험 지역(지하, 반지하)은 대피소로 미리 피하세요.',
          'TV나 라디오의 기상특보와 재난 방송을 계속해서 시청해요.',
          '정전에 대비해 손전등과 비상 연락망을 챙겨두세요.'
        ];
      }

      setPrediction({
        predictedDamageMillionWon: predictedDamage,
        nearestNeighbors: neighbors,
        riskLevel,
        safetyTips
      });

      setIsCalculating(false);

      // Fire celebratory confetti if simulation executed
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* 시뮬레이터 배너 */}
      <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 rounded-2xl p-5 border border-rose-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-200 text-rose-900">
                4차시 나만의 AI 프로젝트
              </span>
              <span className="text-xs text-rose-800 font-semibold">
                kNN 기반 제주 재난 피해 예측기
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              미래에 올 태풍의 피해를 AI로 미리 예측해봐요!
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              학교 엔트리 실습처럼 <strong>중심기압, 풍속, 강수량</strong>을 입력하면, 
              kNN 모델이 과거 15건의 제주 재해 데이터에서 <strong>가장 닮은 이웃 태풍</strong>을 찾아 
              예상 피해 규모(백만원)와 안전 수칙을 계산해줍니다.
            </p>
          </div>

          <button
            id="btn-toggle-entry-code"
            onClick={() => setShowEntryCode(!showEntryCode)}
            className="px-3.5 py-2 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-slate-800 text-xs font-bold flex items-center gap-2 shrink-0 shadow-xs transition-colors"
          >
            <Code2 className="w-4 h-4 text-rose-600" />
            <span>{showEntryCode ? '시뮬레이터 보기' : '엔트리 블록 코딩 원리'}</span>
          </button>
        </div>
      </div>

      {/* 엔트리 블록 코딩 원리 해설 패널 */}
      {showEntryCode && (
        <div className="bg-white rounded-2xl p-5 border border-indigo-200 shadow-sm space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
              E
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              엔트리(Entry) 인공지능 모델 학습 블록과 연결하기
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            엔트리에서 [인공지능] ➡️ [모델 학습] ➡️ [숫자 데이터 (kNN)]를 생성했을 때와 동일한 원리입니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
              <span className="font-bold text-amber-900 block">1. 핵심 속성(특징) 3가지</span>
              <p className="text-slate-700">
                • 중심기압 (hPa)<br />
                • 순간최대풍속 (m/s)<br />
                • 일최대강수량 (mm)
              </p>
              <span className="text-[11px] text-amber-700 block">이 3개 숫자가 인공지능의 입력 데이터예요.</span>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs space-y-1">
              <span className="font-bold text-blue-900 block">2. kNN 모델 학습 블록</span>
              <p className="text-slate-700">
                엔트리 블록: <code>[입력한 값]으로 [kNN 모델] 결과 예측하기</code>
              </p>
              <span className="text-[11px] text-blue-700 block">가장 가까운 거리의 K개 과거 데이터를 찾아서 평균을 구해요.</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
              <span className="font-bold text-emerald-900 block">3. 출력(결과) 예측값</span>
              <p className="text-slate-700">
                <code>예상 재산 피해액 (백만원)</code>
              </p>
              <span className="text-[11px] text-emerald-700 block">피해 규모에 맞춰 방재 경보와 대피 수칙을 안내해요.</span>
            </div>
          </div>
        </div>
      )}

      {/* 시뮬레이터 본체 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 입력 제어판 (5열) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>가상의 날씨 조건 입력</span>
            </h3>
            <span className="text-xs text-slate-500">엔트리 입력창</span>
          </div>

          {/* 빠른 프리셋 버튼 */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>과거 대표 재난 프리셋으로 빠르게 채우기</span>
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  id={`btn-preset-${idx}`}
                  onClick={() => applyPreset(p)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-orange-50/80 border border-slate-200 hover:border-orange-300 text-left text-xs transition-colors flex items-center gap-1.5"
                >
                  <span className="text-base">{p.icon}</span>
                  <span className="font-semibold text-slate-800 truncate">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 슬라이더 1: 중심기압 */}
          <div className="space-y-1.5 p-3 bg-slate-50/70 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="input-pressure" className="font-bold text-slate-800">
                1. 중심기압 (hPa)
              </label>
              <span className="font-black text-rose-700 px-2 py-0.5 bg-white rounded border border-rose-200">
                {pressure} hPa
              </span>
            </div>
            <input
              id="input-pressure"
              type="range"
              min={930}
              max={1015}
              value={pressure}
              onChange={(e) => setPressure(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="text-rose-600 font-semibold">930hPa (매우 위험)</span>
              <span>1015hPa (평온)</span>
            </div>
          </div>

          {/* 슬라이더 2: 순간최대풍속 */}
          <div className="space-y-1.5 p-3 bg-slate-50/70 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="input-wind" className="font-bold text-slate-800">
                2. 순간최대풍속 (m/s)
              </label>
              <span className="font-black text-blue-700 px-2 py-0.5 bg-white rounded border border-blue-200">
                {windSpeed} m/s
              </span>
            </div>
            <input
              id="input-wind"
              type="range"
              min={10}
              max={65}
              value={windSpeed}
              onChange={(e) => setWindSpeed(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>10m/s (약풍)</span>
              <span className="text-blue-600 font-semibold">65m/s (기차 탈선급)</span>
            </div>
          </div>

          {/* 슬라이더 3: 일최대강수량 */}
          <div className="space-y-1.5 p-3 bg-slate-50/70 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="input-rain" className="font-bold text-slate-800">
                3. 일최대강수량 (mm)
              </label>
              <span className="font-black text-emerald-700 px-2 py-0.5 bg-white rounded border border-emerald-200">
                {dailyRain} mm
              </span>
            </div>
            <input
              id="input-rain"
              type="range"
              min={10}
              max={550}
              value={dailyRain}
              onChange={(e) => setDailyRain(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>10mm (가벼운 비)</span>
              <span className="text-emerald-600 font-semibold">550mm (대홍수)</span>
            </div>
          </div>

          {/* K값 선택 */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-700">참고할 이웃 수 (K값):</span>
            <div className="flex items-center gap-2">
              {[3, 5].map((k) => (
                <button
                  key={k}
                  id={`btn-sim-k-${k}`}
                  onClick={() => setKValue(k)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    kValue === k
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  K = {k}명
                </button>
              ))}
            </div>
          </div>

          {/* 예측하기 버튼 */}
          <button
            id="btn-run-prediction"
            onClick={runKnnPrediction}
            disabled={isCalculating}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-extrabold text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            {isCalculating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                kNN 거리 계산 및 이웃 찾는 중...
              </span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>kNN 모델로 재난 피해 예측하기</span>
              </>
            )}
          </button>
        </div>

        {/* 결과 출력판 (7열) */}
        <div className="lg:col-span-7 space-y-4">
          {prediction ? (
            <div className="space-y-4 animate-fadeIn">
              {/* 예상 피해액 메인 대형 카드 */}
              <div
                className={`rounded-2xl p-6 border shadow-sm ${
                  prediction.riskLevel === '심각'
                    ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
                    : prediction.riskLevel === '경계'
                      ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
                      : 'bg-emerald-50 border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-600">
                    인공지능 kNN 모델(K={kValue})의 최종 예측
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black shadow-xs ${
                      prediction.riskLevel === '심각'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : prediction.riskLevel === '경계'
                          ? 'bg-amber-500 text-white'
                          : prediction.riskLevel === '주의'
                            ? 'bg-yellow-500 text-slate-900'
                            : 'bg-emerald-500 text-white'
                    }`}
                  >
                    위험 등급: {prediction.riskLevel}
                  </span>
                </div>

                <div className="my-2">
                  <p className="text-xs text-slate-500 font-medium">예상 재산 피해 규모</p>
                  <div className="flex flex-wrap items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {prediction.predictedDamageMillionWon.toLocaleString()}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-600">
                      백만 원
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-rose-600 ml-1">
                      ({formatDamageText(prediction.predictedDamageMillionWon)})
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2">
                  💡 과거 가장 유사한 제주 날씨 {kValue}건의 피해 데이터를 바탕으로 계산된 예상치입니다.
                </p>
              </div>

              {/* kNN이 찾아낸 가장 가까운 이웃 태풍 TOP K */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span>kNN이 찾아낸 가장 닮은 과거 제주 재해 (이웃 {kValue}건)</span>
                  </span>
                  <span className="text-xs text-slate-400 font-normal">거리순 정렬</span>
                </h4>

                <div className="space-y-2">
                  {prediction.nearestNeighbors.map((item, idx) => (
                    <div
                      key={item.disaster.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-amber-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {item.disaster.name}
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                            유사도 {item.similarityPercent}%
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-3">
                          <span>기압: {item.disaster.centerPressure}hPa</span>
                          <span>풍속: {item.disaster.maxWindSpeed}m/s</span>
                          <span>강수: {item.disaster.maxDailyRain}mm</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-[11px] text-slate-400">당시 실제 피해액</p>
                        <p className="text-xs sm:text-sm font-black text-rose-700">
                          {item.disaster.damageMillionWon.toLocaleString()}백만 원
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 초등학생 눈높이 안전 행동 요령 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>우리 집과 학교의 안전 행동 요령</span>
                </h4>
                <div className="space-y-1.5">
                  {prediction.safetyTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5차시 제주 방재 히어로 게임 이동 배너 */}
              {onNextTab && (
                <div className="bg-gradient-to-r from-teal-500 to-indigo-600 rounded-2xl p-4 text-white flex items-center justify-between gap-3 shadow-sm">
                  <div>
                    <h5 className="font-bold text-xs">🚀 다음 활동: 5단계 ‘제주 방재 히어로’ 도전!</h5>
                    <p className="text-[11px] text-teal-100">
                      예측된 재난 피해를 막기 위해 직접 방재 시설을 짓는 시뮬레이션 게임을 시작해보세요.
                    </p>
                  </div>
                  <button
                    onClick={onNextTab}
                    className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 shrink-0 cursor-pointer shadow-sm transition-transform active:scale-95"
                  >
                    방재 게임 시작 🦸‍♂️
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* 아직 실행하지 않았을 때의 가이드 화면 */
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center space-y-3 min-h-[350px]">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 text-3xl flex items-center justify-center shadow-inner">
                🌀
              </div>
              <h4 className="font-bold text-base text-slate-900">
                예측할 날씨 조건을 정하고 &apos;예측하기&apos;를 눌러보세요!
              </h4>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                왼쪽에서 중심기압, 순간최대풍속, 일최대강수량을 조절하거나 
                &apos;태풍 매미급&apos;, &apos;태풍 나리급&apos; 프리셋 버튼을 클릭하면 
                kNN 인공지능이 과거 데이터를 뒤져 결과를 알려줍니다.
              </p>
              <button
                id="btn-trigger-initial-prediction"
                onClick={runKnnPrediction}
                className="mt-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-transform active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>지금 바로 시뮬레이션 시작</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

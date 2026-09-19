import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { JEJU_DISASTER_DATASET, formatDamageText } from '../data/jejuData';
import { JejuDisaster } from '../types';
import { BarChart3, CheckCircle2, Award, ArrowRight, Table, Sparkles, Filter } from 'lucide-react';

interface JejuDataWorksheetProps {
  onComplete: () => void;
  onNextTab: () => void;
}

type XAxisType = 'wind' | 'rain' | 'pressure';

export const JejuDataWorksheet: React.FC<JejuDataWorksheetProps> = ({ onComplete, onNextTab }) => {
  const [xAxis, setXAxis] = useState<XAxisType>('wind');
  const [hoveredPoint, setHoveredPoint] = useState<JejuDisaster | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<JejuDisaster | null>(null);
  const [showDataTable, setShowDataTable] = useState<boolean>(false);

  // Worksheet answers state
  const [q1Answer, setQ1Answer] = useState<string>('');
  const [q2Answer, setQ2Answer] = useState<string>('');
  const [q3Answer, setQ3Answer] = useState<string>('');
  const [studentNote, setStudentNote] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Maximum damage in dataset for Y-axis scaling (태풍 나리: 130740백만원)
  const maxDamage = 140000;

  // Min/Max for each X-axis metric
  const axisConfig = {
    wind: {
      label: '순간최대풍속 (m/s)',
      sub: '바람의 빠르기',
      min: 10,
      max: 65,
      getValue: (d: JejuDisaster) => d.maxWindSpeed,
      format: (v: number) => `${v} m/s`,
      ticks: [10, 20, 30, 40, 50, 60]
    },
    rain: {
      label: '일최대강수량 (mm)',
      sub: '하루 동안 쏟아진 비의 양',
      min: 0,
      max: 550,
      getValue: (d: JejuDisaster) => d.maxDailyRain,
      format: (v: number) => `${v} mm`,
      ticks: [0, 100, 200, 300, 400, 500]
    },
    pressure: {
      label: '중심기압 (hPa)',
      sub: '낮을수록 강력한 태풍',
      min: 940,
      max: 1015,
      getValue: (d: JejuDisaster) => d.centerPressure,
      format: (v: number) => `${v} hPa`,
      ticks: [940, 960, 980, 1000, 1015]
    }
  };

  const currentAxis = axisConfig[xAxis];

  const handleSubmitWorksheet = (e: React.FormEvent) => {
    e.preventDefault();
    let currentScore = 0;
    if (q1Answer === 'increase') currentScore += 1;
    if (q2Answer === 'lower_stronger') currentScore += 1;
    if (q3Answer === '420') currentScore += 1;

    setScore(currentScore);
    setIsSubmitted(true);
    onComplete();

    if (currentScore >= 2) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 상단 워크시트 안내 배너 */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-amber-50 rounded-2xl p-5 border border-blue-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-200 text-blue-900">
                3차시 워크시트 실습
              </span>
              <span className="text-xs text-blue-800 font-semibold">
                엔트리 데이터 시각화 탐구
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              제주도 자연재해 데이터 분석과 특징 탐구
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              제주도에 닥쳤던 실제 과거 태풍과 집중호우 데이터입니다. 
              <strong>가로축(X축)</strong>을 바꾸어가며 어떤 날씨 조건에서 재산 피해가 커지는지 
              직접 발견하고 워크시트를 작성해 보세요!
            </p>
          </div>

          <button
            id="btn-toggle-raw-data"
            onClick={() => setShowDataTable(!showDataTable)}
            className="px-3.5 py-2 rounded-xl bg-white border border-blue-200 hover:bg-blue-50 text-slate-700 text-xs font-bold flex items-center gap-2 shrink-0 shadow-xs transition-colors"
          >
            <Table className="w-4 h-4 text-blue-600" />
            <span>{showDataTable ? '차트만 보기' : '전체 데이터 표 보기'}</span>
          </button>
        </div>
      </div>

      {/* 전체 데이터 표 (열고 닫기) */}
      {showDataTable && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm overflow-x-auto">
          <h4 className="font-bold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-500" />
            <span>제주도 주요 자연재해 15건 데이터셋 (엔트리 테이블과 동일)</span>
          </h4>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="p-2 font-bold">재난명</th>
                <th className="p-2 font-bold">연도</th>
                <th className="p-2 font-bold">중심기압 (hPa)</th>
                <th className="p-2 font-bold">순간최대풍속 (m/s)</th>
                <th className="p-2 font-bold">일최대강수량 (mm)</th>
                <th className="p-2 font-bold">재산피해액 (백만원)</th>
                <th className="p-2 font-bold">주요 특징</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {JEJU_DISASTER_DATASET.map((d) => (
                <tr
                  key={d.id}
                  onClick={() => setSelectedPoint(d)}
                  className={`hover:bg-amber-50/60 cursor-pointer transition-colors ${
                    selectedPoint?.id === d.id ? 'bg-amber-100/70 font-semibold' : ''
                  }`}
                >
                  <td className="p-2 text-slate-900">{d.name}</td>
                  <td className="p-2 text-slate-600">{d.year}년</td>
                  <td className="p-2 text-slate-700">{d.centerPressure} hPa</td>
                  <td className="p-2 text-blue-700 font-medium">{d.maxWindSpeed} m/s</td>
                  <td className="p-2 text-emerald-700 font-medium">{d.maxDailyRain} mm</td>
                  <td className="p-2 text-rose-700 font-bold">{d.damageMillionWon.toLocaleString()}</td>
                  <td className="p-2 text-slate-500 text-[11px] max-w-xs truncate">{d.featureNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 인터랙티브 산점도 차트 영역 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        {/* 가로축 선택 탭 버튼들 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>가로축(X) 선택하여 데이터 관계 살펴보기</span>
            </h3>
            <p className="text-xs text-slate-500">
              선택한 날씨 조건과 세로축(재산 피해 규모)의 상관관계를 한눈에 관찰해보세요.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              id="axis-btn-wind"
              onClick={() => setXAxis('wind')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                xAxis === 'wind'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💨 순간최대풍속
            </button>
            <button
              id="axis-btn-rain"
              onClick={() => setXAxis('rain')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                xAxis === 'rain'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌧️ 일최대강수량
            </button>
            <button
              id="axis-btn-pressure"
              onClick={() => setXAxis('pressure')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                xAxis === 'pressure'
                  ? 'bg-white text-orange-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🧭 중심기압
            </button>
          </div>
        </div>

        {/* 차트 SVG */}
        <div className="relative w-full aspect-auto h-72 sm:h-96 bg-slate-50/50 rounded-xl p-4 sm:p-6 border border-slate-200">
          {/* 세로축 Y 라벨 */}
          <div className="absolute top-3 left-4 text-xs font-bold text-slate-700 flex items-center gap-1">
            <span>🔺 세로축 (Y): 재산피해액 (백만원)</span>
          </div>

          {/* 차트 본체 */}
          <svg className="w-full h-full" viewBox="0 0 600 300">
            {/* 배경 보조선 (Y축 피해액) */}
            {[0, 30000, 60000, 90000, 120000].map((amt) => {
              const y = 260 - (amt / maxDamage) * 220;
              return (
                <g key={`y-grid-${amt}`}>
                  <line x1="60" y1={y} x2="580" y2={y} stroke="#e2e8f0" strokeDasharray="3,3" />
                  <text x="50" y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
                    {amt >= 10000 ? `${amt / 10000}만` : amt}
                  </text>
                </g>
              );
            })}

            {/* X축 기준선 */}
            <line x1="60" y1="260" x2="580" y2="260" stroke="#64748b" strokeWidth="1.5" />
            {/* Y축 기준선 */}
            <line x1="60" y1="20" x2="60" y2="260" stroke="#64748b" strokeWidth="1.5" />

            {/* X축 눈금 및 라벨 */}
            {currentAxis.ticks.map((val) => {
              const xRange = currentAxis.max - currentAxis.min;
              const xPos = 60 + ((val - currentAxis.min) / xRange) * 510;
              return (
                <g key={`x-tick-${val}`}>
                  <line x1={xPos} y1="260" x2={xPos} y2="266" stroke="#64748b" />
                  <text x={xPos} y="278" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* 가로축 하단 설명 */}
            <text x="320" y="295" textAnchor="middle" fontSize="11" fill="#334155" fontWeight="bold">
              {currentAxis.label} ➡️
            </text>

            {/* 데이터 점들 렌더링 */}
            {JEJU_DISASTER_DATASET.map((disaster) => {
              const val = currentAxis.getValue(disaster);
              const xRange = currentAxis.max - currentAxis.min;
              const cx = 60 + ((val - currentAxis.min) / xRange) * 510;
              const cy = 260 - (disaster.damageMillionWon / maxDamage) * 220;

              const isHovered = hoveredPoint?.id === disaster.id;
              const isSelected = selectedPoint?.id === disaster.id;
              const isBigDamage = disaster.damageMillionWon > 40000;

              return (
                <g
                  key={disaster.id}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredPoint(disaster)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => setSelectedPoint(disaster)}
                >
                  {/* 외곽 링 강조 */}
                  {(isHovered || isSelected) && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="14"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      className="animate-pulse"
                    />
                  )}

                  {/* 메인 점 */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered || isSelected ? 8 : isBigDamage ? 6.5 : 5}
                    fill={
                      isBigDamage
                        ? '#ef4444' // 큰 피해: 빨간색
                        : disaster.category === '태풍'
                          ? '#3b82f6' // 태풍: 파란색
                          : '#10b981' // 호우: 초록색
                    }
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="shadow-sm"
                  />

                  {/* 큰 태풍들의 이름 라벨 */}
                  {isBigDamage && (
                    <text
                      x={cx}
                      y={cy - 10}
                      textAnchor="middle"
                      fontSize="9.5"
                      fill="#b91c1c"
                      fontWeight="bold"
                    >
                      {disaster.name.split(' ')[1] || disaster.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* 마우스 호버 또는 클릭 시 나타나는 정보 카드 */}
          {(hoveredPoint || selectedPoint) && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-slate-300 shadow-lg text-xs max-w-xs pointer-events-none sm:pointer-events-auto animate-fadeIn">
              {(() => {
                const target = hoveredPoint || selectedPoint!;
                return (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1">
                      <span className="font-black text-slate-900 text-sm">{target.name}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-800">
                        {target.category}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                      <div>💨 풍속: <strong>{target.maxWindSpeed} m/s</strong></div>
                      <div>🌧️ 강수: <strong>{target.maxDailyRain} mm</strong></div>
                      <div>🧭 기압: <strong>{target.centerPressure} hPa</strong></div>
                      <div className="text-rose-600 font-bold col-span-2">
                        💰 피해액: {target.damageMillionWon.toLocaleString()}백만 원 ({formatDamageText(target.damageMillionWon)})
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 bg-slate-50 p-1.5 rounded">
                      📌 {target.featureNote}
                    </p>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span> 극심한 피해 (400억 원 이상)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> 태풍
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> 집중호우
            </span>
          </div>
          <span>차트의 점을 클릭하거나 마우스를 올려 상세 정보를 확인해보세요.</span>
        </div>
      </div>

      {/* 엔트리 연계 워크시트 활동지 폼 */}
      <form onSubmit={handleSubmitWorksheet} className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-slate-900">
              엔트리 데이터 탐구 워크시트 (질문 풀기)
            </h3>
          </div>
          {isSubmitted && (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
              {score}/3 점 획득 완료!
            </span>
          )}
        </div>

        {/* 문항 1: 풍속과 피해액 */}
        <div className="space-y-2 p-3.5 bg-slate-50/70 rounded-xl border border-slate-200">
          <label className="text-xs sm:text-sm font-bold text-slate-800 block">
            1. [순간최대풍속 탐구] 가로축을 &apos;순간최대풍속&apos;으로 보았을 때, 풍속이 40m/s 이상으로 매우 센 태풍(매미, 차바 등)일수록 재산피해액은 대체로 어떻게 되나요?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {[
              { id: 'increase', label: '① 대체로 크게 늘어난다 (위험 커짐)' },
              { id: 'decrease', label: '② 오히려 줄어든다' },
              { id: 'no_change', label: '③ 아무 상관이 없다' }
            ].map((opt) => (
              <label
                key={opt.id}
                className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                  q1Answer === opt.id
                    ? 'bg-blue-500 text-white font-bold border-blue-600'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="q1"
                  value={opt.id}
                  checked={q1Answer === opt.id}
                  onChange={(e) => setQ1Answer(e.target.value)}
                  className="sr-only"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {isSubmitted && (
            <p className={`text-xs font-semibold ${q1Answer === 'increase' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {q1Answer === 'increase'
                ? '✅ 정답입니다! 바람이 강해지면 건물, 가로수, 감귤 과수원 낙과 등 시설물 피해가 급증합니다.'
                : '❌ 다시 확인해보세요: 차트에서 오른쪽으로 갈수록 점들이 위쪽(피해액 많음)에 위치합니다.'}
            </p>
          )}
        </div>

        {/* 문항 2: 중심기압과 태풍 세기 */}
        <div className="space-y-2 p-3.5 bg-slate-50/70 rounded-xl border border-slate-200">
          <label className="text-xs sm:text-sm font-bold text-slate-800 block">
            2. [중심기압 탐구] 가로축을 &apos;중심기압&apos;으로 보았을 때, 태풍의 중심기압 숫자가 낮을수록(예: 940~960hPa) 태풍의 세기와 피해는 어떨까요?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { id: 'lower_stronger', label: '① 중심기압 숫자가 낮을수록 태풍이 강력하여 피해가 크다' },
              { id: 'higher_stronger', label: '② 중심기압 숫자가 높을수록 태풍이 강력하다' }
            ].map((opt) => (
              <label
                key={opt.id}
                className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                  q2Answer === opt.id
                    ? 'bg-blue-500 text-white font-bold border-blue-600'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="q2"
                  value={opt.id}
                  checked={q2Answer === opt.id}
                  onChange={(e) => setQ2Answer(e.target.value)}
                  className="sr-only"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {isSubmitted && (
            <p className={`text-xs font-semibold ${q2Answer === 'lower_stronger' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {q2Answer === 'lower_stronger'
                ? '✅ 딩동댕! 기압은 공기의 무게예요. 중심기압이 낮을수록 주변 공기를 강하게 빨아들여 태풍이 거대해집니다!'
                : '❌ 기압의 과학적 성질: 태풍은 중심기압 숫자가 낮을수록(950 이하) 훨씬 강력합니다!'}
            </p>
          )}
        </div>

        {/* 문항 3: 태풍 나리의 강수량과 침수 피해 */}
        <div className="space-y-2 p-3.5 bg-slate-50/70 rounded-xl border border-slate-200">
          <label className="text-xs sm:text-sm font-bold text-slate-800 block">
            3. [일최대강수량 탐구] 2007년 제주에 약 1,300억 원의 최악 침수 피해를 안긴 &apos;태풍 나리&apos;의 일최대강수량은 데이터 차트에서 몇 mm로 나타나나요?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { id: '187', label: '187 mm' },
              { id: '240', label: '240 mm' },
              { id: '420', label: '420 mm (정답 후보)' },
              { id: '501', label: '501 mm' }
            ].map((opt) => (
              <label
                key={opt.id}
                className={`p-2.5 rounded-lg border flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  q3Answer === opt.id
                    ? 'bg-blue-500 text-white font-bold border-blue-600'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="q3"
                  value={opt.id}
                  checked={q3Answer === opt.id}
                  onChange={(e) => setQ3Answer(e.target.value)}
                  className="sr-only"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {isSubmitted && (
            <p className={`text-xs font-semibold ${q3Answer === '420' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {q3Answer === '420'
                ? '✅ 맞아요! 태풍 나리는 하루에만 420mm의 전례 없는 폭우가 쏟아져 제주시 도심 하천이 넘쳤습니다.'
                : '❌ 차트에서 가장 높은 피해액(130,740백만원) 점인 태풍 나리를 클릭해보세요. 420mm입니다.'}
            </p>
          )}
        </div>

        {/* 학생 자유 관찰 메모 */}
        <div className="space-y-1.5">
          <label htmlFor="student-observation-memo" className="text-xs sm:text-sm font-bold text-slate-800 block">
            📝 [나의 탐구 노트] 데이터를 관찰하고 알게 된 점이나 태풍 피해를 줄이기 위해 AI가 필요한 이유를 한 줄로 적어보세요.
          </label>
          <textarea
            id="student-observation-memo"
            rows={2}
            value={studentNote}
            onChange={(e) => setStudentNote(e.target.value)}
            placeholder="예시: 풍속이 빠르고 비가 많이 올수록 피해가 커지므로, 새로운 태풍이 오기 전에 과거 비슷한 태풍을 AI로 찾아서 미리 대피 준비를 해야겠다고 생각했다."
            className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* 제출 버튼 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-500">
            {isSubmitted ? '🌟 워크시트가 제출되었습니다. 검토 후 다음 단계로 이동하세요.' : '💡 모든 문제를 선택하고 제출하기를 누르면 점수와 해설이 나와요.'}
          </p>

          <button
            type="submit"
            id="btn-submit-worksheet"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitted ? '답안 다시 채점하기' : '워크시트 제출하기'}</span>
          </button>
        </div>
      </form>

      {/* 다음 단계 버튼 */}
      <div className="flex justify-end pt-2">
        <button
          id="btn-go-to-simulator-tab"
          onClick={onNextTab}
          className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95"
        >
          <span>4단계: 나만의 재난 피해 예측기 시뮬레이터 실행하기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

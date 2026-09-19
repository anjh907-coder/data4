import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { KnnPoint } from '../types';
import { ArrowRight, Sparkles, HelpCircle, Check, Target, Shuffle, Info } from 'lucide-react';

// Default dataset: Blue points (강풍형 재난 Class A) vs Green points (폭우형 재난 Class B)
const INITIAL_POINTS: KnnPoint[] = [
  // Blue cluster (left/top area: 높은 바람, 적당한 비)
  { id: 1, x: 25, y: 30, team: 'blue', label: '강풍 A1' },
  { id: 2, x: 35, y: 22, team: 'blue', label: '강풍 A2' },
  { id: 3, x: 20, y: 45, team: 'blue', label: '강풍 A3' },
  { id: 4, x: 40, y: 38, team: 'blue', label: '강풍 A4' },
  { id: 5, x: 30, y: 55, team: 'blue', label: '강풍 A5' },
  { id: 6, x: 48, y: 25, team: 'blue', label: '강풍 A6' },
  { id: 7, x: 22, y: 20, team: 'blue', label: '강풍 A7' },

  // Green cluster (right/bottom area: 많은 비, 적당한 바람)
  { id: 8, x: 70, y: 65, team: 'green', label: '폭우 B1' },
  { id: 9, x: 80, y: 72, team: 'green', label: '폭우 B2' },
  { id: 10, x: 65, y: 80, team: 'green', label: '폭우 B3' },
  { id: 11, x: 85, y: 55, team: 'green', label: '폭우 B4' },
  { id: 12, x: 75, y: 45, team: 'green', label: '폭우 B5' },
  { id: 13, x: 60, y: 60, team: 'green', label: '폭우 B6' },
  { id: 14, x: 88, y: 85, team: 'green', label: '폭우 B7' },

  // Border/mixed zone (경계면 데이터들로 K값에 따라 재미있는 결과 유도)
  { id: 15, x: 52, y: 48, team: 'blue', label: '강풍 A8' },
  { id: 16, x: 55, y: 52, team: 'green', label: '폭우 B8' }
];

interface KnnPlaygroundProps {
  onNextTab: () => void;
}

export const KnnPlayground: React.FC<KnnPlaygroundProps> = ({ onNextTab }) => {
  const [points, setPoints] = useState<KnnPoint[]>(INITIAL_POINTS);
  const [starPos, setStarPos] = useState<{ x: number; y: number }>({ x: 50, y: 46 });
  const [kValue, setKValue] = useState<number>(3);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [quizGuess, setQuizGuess] = useState<'blue' | 'green' | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate Euclidean distances from the star to all points
  const pointsWithDistance = points.map((p) => {
    const dx = p.x - starPos.x;
    const dy = p.y - starPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return { ...p, dist };
  });

  // Sort by distance ascending
  pointsWithDistance.sort((a, b) => a.dist - b.dist);

  // Top K neighbors
  const nearestNeighbors = pointsWithDistance.slice(0, kValue);
  const neighborIds = new Set(nearestNeighbors.map((n) => n.id));

  // Max distance among K neighbors for circle radius
  const maxKDist = nearestNeighbors.length > 0 ? nearestNeighbors[nearestNeighbors.length - 1].dist : 0;

  // Vote counting
  const blueCount = nearestNeighbors.filter((n) => n.team === 'blue').length;
  const greenCount = nearestNeighbors.filter((n) => n.team === 'green').length;

  let predictedTeam: 'blue' | 'green' | 'tie' = 'tie';
  if (blueCount > greenCount) predictedTeam = 'blue';
  else if (greenCount > blueCount) predictedTeam = 'green';

  // Handle clicking or dragging on the 2D plane
  const updateStarPosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPercent = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    const yPercent = Math.max(5, Math.min(95, ((clientY - rect.top) / rect.height) * 100));
    setStarPos({ x: Math.round(xPercent * 10) / 10, y: Math.round(yPercent * 10) / 10 });
    setQuizGuess(null);
    setQuizFeedback(null);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateStarPosition(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateStarPosition(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Mini-game: Test my guess!
  const handleGuess = (team: 'blue' | 'green') => {
    setQuizGuess(team);
    if (team === predictedTeam) {
      setQuizFeedback('🎉 정답입니다! 다수결로 이웃들의 표를 더 많이 받은 팀을 정확히 맞혔어요!');
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    } else {
      setQuizFeedback(`😅 아쉬워요! 지금 가장 가까운 ${kValue}명의 이웃 중 ${predictedTeam === 'blue' ? '파란색' : '초록색'}이 더 많아서 ${predictedTeam === 'blue' ? '파란색' : '초록색'} 팀으로 분류돼요!`);
    }
  };

  // Randomize Star position to an interesting spot
  const handleRandomizeStar = () => {
    const rx = Math.floor(30 + Math.random() * 40);
    const ry = Math.floor(30 + Math.random() * 40);
    setStarPos({ x: rx, y: ry });
    setQuizGuess(null);
    setQuizFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* 개념 설명 영역 */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-blue-50 rounded-2xl p-5 border border-emerald-200 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
            🤝
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-200 text-emerald-900">
                알고리즘 배움터
              </span>
              <span className="text-xs text-emerald-800 font-semibold">
                kNN (K-Nearest Neighbor / K-최근접 이웃)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              새로운 데이터는 누구와 가장 가까울까?
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>kNN 알고리즘</strong>은 우리 속담 <em>&quot;유유상종(끼리끼리 모인다)&quot;</em>처럼, 
              새로운 데이터(★)가 나타났을 때 <strong>가장 가까운 거리의 이웃 K개</strong>를 살펴보고, 
              <strong>다수결(가장 많은 표)</strong>로 어느 반/종류인지 결정하는 친절하고 똑똑한 인공지능 방법이에요!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <div className="text-xs">
                  <span className="font-bold text-slate-800">거리 재기:</span>
                  <span className="text-slate-600 block">모든 데이터와 별(★) 사이의 거리를 계산</span>
                </div>
              </div>
              <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <div className="text-xs">
                  <span className="font-bold text-slate-800">K개 이웃 뽑기:</span>
                  <span className="text-slate-600 block">제일 가까운 이웃 K명을 순서대로 선정</span>
                </div>
              </div>
              <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <div className="text-xs">
                  <span className="font-bold text-slate-800">다수결 판정:</span>
                  <span className="text-slate-600 block">이웃이 더 많은 팀으로 별의 정체를 결정!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2D 인터랙티브 시뮬레이션 및 미니 게임 공간 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽 2열: 2D 좌표 평면 */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col">
          {/* 조작 및 상태 헤더 */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" />
                <span>2D 이웃 시뮬레이션 평면</span>
              </h3>
              <p className="text-xs text-slate-500">
                화면을 터치하거나 마우스로 클릭하여 <strong>별표(★)</strong>의 위치를 옮겨보세요!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-random-star-pos"
                onClick={handleRandomizeStar}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="별표 위치 랜덤 변경"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>위치 무작위</span>
              </button>
            </div>
          </div>

          {/* SVG 인터랙티브 평면 */}
          <div
            ref={containerRef}
            id="knn-interactive-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative w-full aspect-square sm:aspect-[4/3] bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-xl border-2 border-slate-300 overflow-hidden cursor-crosshair select-none touch-none shadow-inner"
          >
            {/* 배경 격자선 */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <defs>
                <pattern id="grid-pattern" width="10%" height="10%" patternUnits="userSpaceOnUse">
                  <path d="M 0 0 L 100 0 100 100 0 100 Z" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>

            {/* 범례 축 라벨 */}
            <div className="absolute top-2 left-2 text-[11px] font-bold text-blue-800 bg-blue-100/90 px-2 py-0.5 rounded shadow-xs pointer-events-none">
              ⬆️ 바람이 강한 영역 (Class A 파란색)
            </div>
            <div className="absolute bottom-2 right-2 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded shadow-xs pointer-events-none">
              비가 많이 오는 영역 (Class B 초록색) ➡️
            </div>

            {/* SVG 연결선 및 이웃 반경 원 */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* K개 이웃을 포함하는 반경 원 */}
              {nearestNeighbors.length > 0 && (
                <ellipse
                  cx={`${starPos.x}%`}
                  cy={`${starPos.y}%`}
                  rx={`${maxKDist}%`}
                  ry={`${maxKDist}%`}
                  fill="rgba(245, 158, 11, 0.08)"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  className="transition-all duration-150"
                />
              )}

              {/* 별표에서 K개의 최근접 이웃으로 연결되는 점선들 */}
              {nearestNeighbors.map((neighbor) => (
                <line
                  key={`line-${neighbor.id}`}
                  x1={`${starPos.x}%`}
                  y1={`${starPos.y}%`}
                  x2={`${neighbor.x}%`}
                  y2={`${neighbor.y}%`}
                  stroke={neighbor.team === 'blue' ? '#3b82f6' : '#10b981'}
                  strokeWidth="2.5"
                  strokeDasharray="3,3"
                  className="animate-pulse"
                />
              ))}
            </svg>

            {/* 기존 데이터 점들 */}
            {points.map((pt) => {
              const isNeighbor = neighborIds.has(pt.id);
              const isBlue = pt.team === 'blue';

              return (
                <div
                  key={pt.id}
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-[10px] text-white transition-all duration-150 shadow-md ${
                    isBlue
                      ? isNeighbor
                        ? 'bg-blue-600 ring-4 ring-blue-300 scale-125 z-20 animate-bounce-short'
                        : 'bg-blue-400 opacity-80'
                      : isNeighbor
                        ? 'bg-emerald-600 ring-4 ring-emerald-300 scale-125 z-20 animate-bounce-short'
                        : 'bg-emerald-400 opacity-80'
                  }`}
                  title={`${pt.label} (${isBlue ? '파란팀' : '초록팀'})`}
                >
                  {isNeighbor ? '★' : isBlue ? 'A' : 'B'}
                </div>
              );
            })}

            {/* 새로운 데이터 점: 별표 (★) */}
            <div
              style={{ left: `${starPos.x}%`, top: `${starPos.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-xl z-30 transition-transform cursor-grab active:cursor-grabbing ${
                predictedTeam === 'blue'
                  ? 'bg-blue-500 text-amber-200 ring-4 ring-blue-200'
                  : predictedTeam === 'green'
                    ? 'bg-emerald-500 text-amber-200 ring-4 ring-emerald-200'
                    : 'bg-amber-400 text-slate-900 ring-4 ring-amber-200'
              }`}
            >
              ★
              <div className="absolute -bottom-5 whitespace-nowrap text-[10px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded shadow">
                새 데이터
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>💡 팁: 별(★)을 잡고 끌어당기거나, 빈 공간을 클릭하면 위치가 바뀝니다.</span>
            <span>좌표: X={starPos.x}, Y={starPos.y}</span>
          </div>
        </div>

        {/* 오른쪽 1열: K값 조절 및 다수결 투표 판정단 */}
        <div className="space-y-4">
          {/* K값 설정 카드 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="knn-k-slider" className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <span>이웃의 수 $K$ 설정</span>
                <span className="text-xs font-semibold text-slate-500">(K-값)</span>
              </label>
              <span className="text-base font-black px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-800 border border-orange-200">
                K = {kValue}
              </span>
            </div>

            <p className="text-xs text-slate-600">
              가장 가까운 몇 명의 이웃을 찾아볼까요? 슬라이더를 움직이거나 버튼을 눌러보세요.
            </p>

            {/* K값 빠른 선택 버튼 */}
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 3, 5, 7].map((num) => (
                <button
                  key={num}
                  id={`btn-k-value-${num}`}
                  onClick={() => {
                    setKValue(num);
                    setQuizGuess(null);
                    setQuizFeedback(null);
                  }}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    kValue === num
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  K = {num}
                </button>
              ))}
            </div>

            <input
              id="knn-k-slider"
              type="range"
              min={1}
              max={9}
              step={2} // 홀수 위주로 동점 방지
              value={kValue}
              onChange={(e) => {
                setKValue(Number(e.target.value));
                setQuizGuess(null);
                setQuizFeedback(null);
              }}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1">
              <span>1명</span>
              <span>3명</span>
              <span>5명</span>
              <span>7명</span>
              <span>9명</span>
            </div>
          </div>

          {/* 실시간 다수결 투표 결과 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center justify-between">
              <span>실시간 다수결 투표함</span>
              <span className="text-xs font-normal text-slate-500">총 {kValue}표</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div
                className={`p-3 rounded-xl border text-center transition-all ${
                  blueCount > greenCount
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-xs font-bold text-blue-700">파란팀 (Class A)</span>
                <p className="text-2xl font-black text-blue-800 my-1">{blueCount}표</p>
                <span className="text-[10px] text-slate-500">강풍 우세형</span>
              </div>

              <div
                className={`p-3 rounded-xl border text-center transition-all ${
                  greenCount > blueCount
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-xs font-bold text-emerald-700">초록팀 (Class B)</span>
                <p className="text-2xl font-black text-emerald-800 my-1">{greenCount}표</p>
                <span className="text-[10px] text-slate-500">폭우 우세형</span>
              </div>
            </div>

            {/* 최종 판정 배너 */}
            <div
              className={`p-3 rounded-xl border text-center text-xs font-bold ${
                predictedTeam === 'blue'
                  ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
                  : predictedTeam === 'green'
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              {predictedTeam === 'blue' && '🏆 다수결 결과: 새 데이터(★)는 [파란팀 (Class A)] 입니다!'}
              {predictedTeam === 'green' && '🏆 다수결 결과: 새 데이터(★)는 [초록팀 (Class B)] 입니다!'}
              {predictedTeam === 'tie' && '🤝 동점입니다! K값을 홀수로 바꾸어보세요.'}
            </div>
          </div>

          {/* 도전! 퀴즈 미니게임 (별의 정체 맞히기) */}
          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                도전 퀴즈: 이 별은 어느 팀일까요?
              </h4>
            </div>
            <p className="text-xs text-slate-600">
              현재 위치에서 $K={kValue}$일 때, 별(★)은 최종적으로 어느 팀이 될지 먼저 맞춰보세요!
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-guess-blue"
                onClick={() => handleGuess('blue')}
                className="py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
              >
                🔵 파란팀 맞히기
              </button>
              <button
                id="btn-guess-green"
                onClick={() => handleGuess('green')}
                className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
              >
                🟢 초록팀 맞히기
              </button>
            </div>

            {quizFeedback && (
              <div className="p-2.5 bg-white rounded-xl border border-amber-300 text-xs text-slate-800 animate-fadeIn">
                {quizFeedback}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 다음 단계 버튼 */}
      <div className="flex justify-end pt-2">
        <button
          id="btn-go-to-worksheet-tab"
          onClick={onNextTab}
          className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95"
        >
          <span>3단계: 제주 재난 데이터 탐구 워크시트 풀러 가기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

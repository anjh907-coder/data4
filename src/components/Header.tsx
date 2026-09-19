import React from 'react';
import { Sparkles, Compass, ShieldAlert, Award, Shield } from 'lucide-react';

interface HeaderProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  quizScore: number;
  worksheetCompleted: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  quizScore,
  worksheetCompleted
}) => {
  const tabs = [
    {
      id: 1,
      title: '1. 결정트리 복습',
      subtitle: '2차시 퀴즈 풀기',
      icon: Sparkles,
      badge: quizScore > 0 ? `${quizScore}/3 완료` : undefined,
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 2,
      title: '2. kNN 알고리즘',
      subtitle: '이웃 찾기 게임',
      icon: Compass,
      badge: '체험 학습',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 3,
      title: '3. 제주 데이터 탐구',
      subtitle: '엔트리 워크시트',
      icon: Award,
      badge: worksheetCompleted ? '작성 완료!' : '활동지',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 4,
      title: '4. 피해 예측기',
      subtitle: 'kNN 시뮬레이터',
      icon: ShieldAlert,
      badge: '실습 프로젝트',
      color: 'from-rose-500 to-red-500'
    },
    {
      id: 5,
      title: '5. 제주 방재 히어로',
      subtitle: '대비 시뮬레이션',
      icon: Shield,
      badge: '방재 게임',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-orange-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-2">
        {/* Top title bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-md text-xl font-bold select-none">
              🍊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                  초등 AI 3차시 수업
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">제주도 자연재해 데이터 분석</span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                제주 재난 피해 예측기 &amp; kNN AI 교실
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-semibold text-slate-700">
            <span className="text-base">🏝️</span>
            <span>한라산 AI 탐험대</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pb-1" aria-label="수업 단계 선택">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all duration-200 border relative ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md transform -translate-y-0.5'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {tab.title}
                    </p>
                  </div>
                  <p className={`text-[11px] truncate ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                    {tab.subtitle}
                  </p>
                </div>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md hidden lg:inline-block ${
                      isActive
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

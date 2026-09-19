/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { DecisionTreeQuiz } from './components/DecisionTreeQuiz';
import { KnnPlayground } from './components/KnnPlayground';
import { JejuDataWorksheet } from './components/JejuDataWorksheet';
import { JejuPredictionSimulator } from './components/JejuPredictionSimulator';
import { JejuDisasterHeroGame } from './components/JejuDisasterHeroGame';
import { BookOpen, CheckCircle, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [worksheetCompleted, setWorksheetCompleted] = useState<boolean>(false);
  const [showLearningGoal, setShowLearningGoal] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800 font-sans selection:bg-orange-200">
      {/* 글로벌 상단 헤더 & 탭 네비게이션 */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        quizScore={quizScore}
        worksheetCompleted={worksheetCompleted}
      />

      {/* 메인 학습 콘텐츠 영역 */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* 학습 목표 안내 한 줄 바 */}
        <div className="mb-4 bg-white/70 backdrop-blur-xs rounded-xl px-4 py-2 border border-orange-100 flex items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2 truncate">
            <span className="text-orange-500 font-bold">🎯 오늘의 수업 목표:</span>
            <span className="truncate">
              {activeTab === 1 && '2차시 결정트리(스무고개 원리)를 복습하고 AI의 규칙 기반 데이터 분류를 떠올려요.'}
              {activeTab === 2 && '새로운 데이터의 이웃을 찾아 다수결로 분류하는 kNN 알고리즘의 원리를 체험해요.'}
              {activeTab === 3 && '제주도 과거 태풍·호우 데이터를 인터랙티브 차트로 관찰하고 워크시트를 완성해요.'}
              {activeTab === 4 && '날씨 조건을 입력하고 kNN 모델로 예상 재난 피해액을 예측하는 시뮬레이터를 조작해요.'}
              {activeTab === 5 && '주어진 예산으로 방재 시설을 설치해 태풍 피해를 막아보고, 제주의 실제 재난 대비 노력을 배워요.'}
            </span>
          </div>

          <button
            onClick={() => setShowLearningGoal(!showLearningGoal)}
            className="text-[11px] font-bold text-orange-600 hover:text-orange-700 underline shrink-0 cursor-pointer"
          >
            {showLearningGoal ? '닫기' : '수업 개요'}
          </button>
        </div>

        {/* 수업 개요 드롭다운 정보창 */}
        {showLearningGoal && (
          <div className="mb-6 p-4 bg-white rounded-2xl border border-orange-200 shadow-xs text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <BookOpen className="w-4 h-4 text-orange-500" />
              <span>초등학교 인공지능 3차시 수업 안내 (제주 재난 피해 예측기 &amp; 방재 히어로)</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              본 웹 애플리케이션은 초등학교 실과/정보 및 AI 융합 수업을 위해 제작되었습니다. 
              2차시에서 학습한 <strong>결정트리(Decision Tree)</strong>를 복습한 뒤, 
              3차시 주제인 <strong>kNN(K-최근접 이웃) 알고리즘</strong>의 핵심 원리를 2D 시뮬레이션 게임으로 체득합니다. 
              이어서 실제 제주도 자연재해 데이터셋을 탐구하고, 엔트리(Entry) 인공지능 프로젝트와 연계하여 
              직접 재난 피해 규모를 예측해봅니다. 마지막으로 <strong>제주 방재 히어로 시뮬레이션</strong>을 통해 
              충분한 사전 대비가 재난 피해를 얼마나 극적으로 줄여주는지 깨닫고 실제 제주도와 대한민국의 방재 과학을 탐구합니다.
            </p>
          </div>
        )}

        {/* 탭별 뷰 렌더링 */}
        {activeTab === 1 && (
          <DecisionTreeQuiz
            onComplete={(score) => setQuizScore(score)}
            onNextTab={() => setActiveTab(2)}
          />
        )}

        {activeTab === 2 && (
          <KnnPlayground
            onNextTab={() => setActiveTab(3)}
          />
        )}

        {activeTab === 3 && (
          <JejuDataWorksheet
            onComplete={() => setWorksheetCompleted(true)}
            onNextTab={() => setActiveTab(4)}
          />
        )}

        {activeTab === 4 && (
          <JejuPredictionSimulator
            onNextTab={() => setActiveTab(5)}
          />
        )}

        {activeTab === 5 && (
          <JejuDisasterHeroGame />
        )}
      </main>

      {/* 하단 푸터 */}
      <footer className="mt-auto border-t border-orange-100 bg-white/80 py-5 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🍊 제주 자연재해 데이터 기반 초등 인공지능 배움터</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline">엔트리(Entry) 인공지능 블록 연계</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>만든이: AI &amp; 데이터 교육 연구팀</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 inline" />
          </div>
        </div>
      </footer>
    </div>
  );
}

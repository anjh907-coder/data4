import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { DECISION_TREE_QUIZZES } from '../data/jejuData';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, GitFork, Lightbulb } from 'lucide-react';

interface DecisionTreeQuizProps {
  onComplete: (score: number) => void;
  onNextTab: () => void;
}

export const DecisionTreeQuiz: React.FC<DecisionTreeQuizProps> = ({ onComplete, onNextTab }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: number }>({});
  const [showExplanations, setShowExplanations] = useState<{ [questionId: number]: boolean }>({});
  const [interactiveStep, setInteractiveStep] = useState<number>(0);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (selectedAnswers[questionId] !== undefined) return; // already answered

    const newAnswers = { ...selectedAnswers, [questionId]: optionIndex };
    setSelectedAnswers(newAnswers);
    setShowExplanations((prev) => ({ ...prev, [questionId]: true }));

    const question = DECISION_TREE_QUIZZES.find((q) => q.id === questionId);
    if (question && optionIndex === question.answerIndex) {
      // Small celebratory confetti for correct answer
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 }
      });
    }

    // Check if all 3 are answered
    const answeredCount = Object.keys(newAnswers).length;
    if (answeredCount === DECISION_TREE_QUIZZES.length) {
      const correctCount = DECISION_TREE_QUIZZES.filter(
        (q) => newAnswers[q.id] === q.answerIndex
      ).length;
      onComplete(correctCount);

      if (correctCount === DECISION_TREE_QUIZZES.length) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }, 300);
      }
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowExplanations({});
    setInteractiveStep(0);
    onComplete(0);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = DECISION_TREE_QUIZZES.filter(
    (q) => selectedAnswers[q.id] === q.answerIndex
  ).length;

  return (
    <div className="space-y-6">
      {/* 2차시 복습 도입 배너 */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-900">
                2차시 배움터 복습
              </span>
              <span className="text-xs text-amber-800 font-medium">스무고개와 인공지능</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              결정트리(Decision Tree) 복습 퀴즈
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              지난 시간에 우리는 컴퓨터가 마치 <strong>&quot;스무고개 놀이&quot;</strong>를 하듯이 
              기준 질문(조건)에 따라 가지를 뻗어나가며 정답을 찾아내는 <strong>결정트리 모델</strong>을 배웠어요! 
              퀴즈 3문항을 풀며 기억을 되살려 볼까요?
            </p>
          </div>

          <div className="bg-white px-4 py-3 rounded-xl border border-amber-200 shadow-xs flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium">퀴즈 진행도</p>
              <p className="text-lg font-black text-slate-900">
                <span className="text-orange-600">{correctCount}</span> / {DECISION_TREE_QUIZZES.length} 정답
              </p>
            </div>
            {answeredCount > 0 && (
              <button
                id="btn-reset-quiz"
                onClick={handleReset}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="퀴즈 다시 풀기"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 인터랙티브 결정트리 시각화 미니 체험기 */}
        <div className="mt-5 bg-white rounded-xl p-4 border border-amber-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <GitFork className="w-4 h-4 text-orange-500" />
              <span>눈으로 보는 결정트리 구조도 (직접 클릭해보세요!)</span>
            </div>
            <span className="text-[11px] text-slate-400">질문 노드 ➡️ 잎 노드(결과)</span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/70 rounded-lg border border-dashed border-slate-200">
            {/* 루트 노드 */}
            <div className="bg-orange-100 text-orange-950 font-bold px-4 py-2 rounded-lg border border-orange-300 text-xs sm:text-sm text-center shadow-xs">
              질문 1: &quot;순간최대풍속이 40m/s 이상인가요?&quot;
            </div>

            {/* 분기선 */}
            <div className="w-48 sm:w-64 h-4 border-b-2 border-slate-300 relative my-1">
              <div className="absolute -top-3 left-2 text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded">예 (강풍)</div>
              <div className="absolute -top-3 right-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-1 rounded">아니오 (약풍)</div>
            </div>

            {/* 자식 노드들 */}
            <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full max-w-md pt-2">
              <div className="flex flex-col items-center space-y-2">
                <button
                  id="btn-tree-branch-high-wind"
                  onClick={() => setInteractiveStep(1)}
                  className={`w-full p-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                    interactiveStep === 1
                      ? 'bg-rose-500 text-white border-rose-600 shadow-sm scale-102'
                      : 'bg-white hover:bg-rose-50 text-slate-800 border-rose-200'
                  }`}
                >
                  질문 2: &quot;강수량이 300mm 이상인가요?&quot;
                </button>
                {interactiveStep === 1 && (
                  <div className="w-full bg-rose-100 border border-rose-300 rounded p-2 text-center text-xs font-bold text-rose-900 animate-fadeIn">
                    🚨 [결과 잎 노드]: 재난 피해 &quot;매우 심각&quot; (태풍 나리/차바급)
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center space-y-2">
                <button
                  id="btn-tree-branch-low-wind"
                  onClick={() => setInteractiveStep(2)}
                  className={`w-full p-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                    interactiveStep === 2
                      ? 'bg-blue-500 text-white border-blue-600 shadow-sm scale-102'
                      : 'bg-white hover:bg-blue-50 text-slate-800 border-blue-200'
                  }`}
                >
                  질문 2: &quot;비가 전혀 안 오나요?&quot;
                </button>
                {interactiveStep === 2 && (
                  <div className="w-full bg-blue-100 border border-blue-300 rounded p-2 text-center text-xs font-bold text-blue-900 animate-fadeIn">
                    🌿 [결과 잎 노드]: 재난 피해 &quot;안전 및 경미&quot;
                  </div>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              💡 이렇게 조건 질문을 계속 통과하며 최종 결론을 내리는 것이 결정트리예요!
            </p>
          </div>
        </div>
      </div>

      {/* 퀴즈 문제 3문항 */}
      <div className="space-y-4">
        {DECISION_TREE_QUIZZES.map((quiz, idx) => {
          const selected = selectedAnswers[quiz.id];
          const isAnswered = selected !== undefined;
          const isCorrect = isAnswered && selected === quiz.answerIndex;

          return (
            <div
              key={quiz.id}
              className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-200 shadow-xs ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0">
                    Q{idx + 1}
                  </span>
                  <h3 className="font-bold text-base text-slate-900">
                    {quiz.question}
                  </h3>
                </div>
                {isAnswered && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> 정답!
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> 다시 생각해봐요
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* 보기 리스트 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                {quiz.options.map((option, optIdx) => {
                  const isThisSelected = selected === optIdx;
                  const isThisCorrect = quiz.answerIndex === optIdx;

                  let buttonStyle = 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200';
                  if (isAnswered) {
                    if (isThisCorrect) {
                      buttonStyle = 'bg-emerald-500 text-white font-bold border-emerald-600 shadow-sm';
                    } else if (isThisSelected && !isThisCorrect) {
                      buttonStyle = 'bg-rose-100 text-rose-800 font-semibold border-rose-300 line-through';
                    } else {
                      buttonStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      id={`quiz-${quiz.id}-opt-${optIdx}`}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(quiz.id, optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all duration-150 flex items-center justify-between ${buttonStyle}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                            isThisCorrect && isAnswered
                              ? 'bg-white text-emerald-600'
                              : 'bg-slate-200/80 text-slate-700'
                          }`}
                        >
                          {optIdx + 1}
                        </span>
                        <span className="truncate">{option}</span>
                      </div>
                      {isAnswered && isThisCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 해설 및 피드백 박스 */}
              {showExplanations[quiz.id] && (
                <div
                  className={`mt-4 p-3.5 rounded-xl text-xs sm:text-sm border transition-all ${
                    isCorrect
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                      : 'bg-amber-50 text-amber-950 border-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className={`w-4 h-4 mt-0.5 shrink-0 ${isCorrect ? 'text-emerald-600' : 'text-amber-600'}`} />
                    <div className="space-y-1">
                      <p className="font-bold">
                        {isCorrect ? '🎉 딩동댕! 정확해요!' : '💡 힌트와 해설을 확인해 볼까요?'}
                      </p>
                      <p className="leading-relaxed text-slate-700">
                        {quiz.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 완료 시 다음 단계로 이동 안내 */}
      {answeredCount === DECISION_TREE_QUIZZES.length && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xl">🏆</span>
              <h3 className="text-lg font-black">2차시 복습 퀴즈 완료!</h3>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100">
              결정트리를 완벽하게 복습했어요! 이제 오늘의 주인공인 <strong>&quot;kNN 알고리즘&quot;</strong>을 배우러 가볼까요?
            </p>
          </div>

          <button
            id="btn-go-to-knn-tab"
            onClick={onNextTab}
            className="px-5 py-3 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-sm shadow-md flex items-center gap-2 shrink-0 transition-transform active:scale-95"
          >
            <span>2단계: kNN 알고리즘 체험하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

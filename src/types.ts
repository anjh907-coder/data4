export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  hint: string;
  iconType: 'tree' | 'question' | 'wind';
}

export interface KnnPoint {
  id: number;
  x: number;
  y: number;
  team: 'blue' | 'green';
  label: string;
}

export interface JejuDisaster {
  id: string;
  name: string;
  year: number;
  centerPressure: number; // hPa (낮을수록 강함: 930 ~ 1015)
  maxWindSpeed: number;   // m/s (높을수록 강함: 10 ~ 65)
  maxDailyRain: number;   // mm (높을수록 강함: 20 ~ 550)
  damageMillionWon: number; // 백만원 (0 ~ 150,000)
  category: '태풍' | '호우' | '강풍';
  featureNote: string;
}

export interface WorksheetAnswer {
  q1Choice: string;
  q2Choice: string;
  q3Choice: string;
  q4Choice: string;
  studentMemo: string;
  isGraded: boolean;
}

export interface PredictionResult {
  predictedDamageMillionWon: number;
  nearestNeighbors: {
    disaster: JejuDisaster;
    distance: number;
    similarityPercent: number;
  }[];
  riskLevel: '안전' | '관심' | '주의' | '경계' | '심각';
  safetyTips: string[];
}

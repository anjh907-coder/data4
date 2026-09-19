import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-amber-50/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-rose-200 text-center space-y-4">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              화면을 불러오는 중 문제가 발생했습니다
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              일시적인 네트워크 또는 브라우저 로딩 오류일 수 있습니다. 아래 버튼을 눌러 페이지를 다시 새로고침해 주세요.
            </p>
            {this.state.error && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-xs text-slate-500 font-mono overflow-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>페이지 새로고침하기</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

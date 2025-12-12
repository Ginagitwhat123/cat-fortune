import React, { useState, useEffect } from 'react';
import { FortuneResult } from './types';
import { getStoredFortune, saveFortune } from './utils/storage';
import { fetchCatImage } from './utils/api';
import { FortuneModal } from './components/FortuneModal';
import fortunesData from './data/fortunes.json';

const App: React.FC = () => {
  const [hasDrawn, setHasDrawn] = useState(false);
  const [currentResult, setCurrentResult] = useState<FortuneResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = getStoredFortune();
    if (stored) {
      setHasDrawn(true);
      setCurrentResult(stored);
    }
  }, []);

  const drawFortune = async () => {
    setIsLoading(true);
    try {
      // 取得貓咪圖片
      const catImage = await fetchCatImage();

      // 隨機選擇運勢小語
      const randomFortune =
        fortunesData[Math.floor(Math.random() * fortunesData.length)];

      const result: FortuneResult = {
        catImage,
        fortune: randomFortune,
        date: new Date().toDateString(),
      };

      // 儲存到 localStorage
      saveFortune(result);
      setCurrentResult(result);
      setHasDrawn(true);
      setShowModal(true);
    } catch (error) {
      console.error('抽籤失敗:', error);
      alert('抽籤失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewFortune = () => {
    if (currentResult) {
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="mb-8 flex justify-center w-full">
        <img 
          src="/logo cat.png" 
          alt="抽一籤好喵" 
          className="w-full max-w-6xl h-auto object-contain"
        />
      </div>
      <p className="text-gray-600 mb-8 text-xl">每日運勢，貓咪相伴</p>

      {hasDrawn ? (
        <div>
          <div className="mb-6">
            <p className="text-lg text-gray-700 mb-4">你今天已經抽過籤了！</p>
            <button
              onClick={handleViewFortune}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg"
            >
              查看已抽的籤
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={drawFortune}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
        >
          {isLoading ? '抽籤中...' : '抽一籤'}
        </button>
      )}

      {showModal && currentResult && (
        <FortuneModal
          result={currentResult}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default App;


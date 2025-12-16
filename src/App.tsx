import React, { useState, useEffect } from 'react';
import { FortuneResult } from '@/types';
import { getStoredFortune, saveFortune } from '@/utils/storage';
import { fetchCatImage } from '@/utils/api';
import { FortuneModal } from '@/components/FortuneModal';
import { DrawingPage } from '@/components/DrawingPage';
import fortunesData from '@/data/fortunes.json';

const App: React.FC = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hasDrawn, setHasDrawn] = useState(false);
  const [currentResult, setCurrentResult] = useState<FortuneResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const [showDrawingPage, setShowDrawingPage] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const stored = getStoredFortune();
    if (stored) {
      setHasDrawn(true);
      setCurrentResult(stored);
    }
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const withinX = e.clientX >= 0 && e.clientX <= window.innerWidth;
      const withinY = e.clientY >= 0 && e.clientY <= window.innerHeight;
      setCursorPos({ x: e.clientX, y: e.clientY });
      setIsCursorVisible(withinX && withinY);
    };
    const handleEnter = () => setIsCursorVisible(true);
    const handleLeave = () => setIsCursorVisible(false);
    const handleOut = (e: MouseEvent) => {
      if (!e.relatedTarget && !(e as any).toElement) {
        setIsCursorVisible(false);
      }
    };
    const handleBlur = () => setIsCursorVisible(false);
    const handleFocus = () => setIsCursorVisible(true);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseenter', handleEnter);
    window.addEventListener('mouseleave', handleLeave);
    window.addEventListener('mouseout', handleOut);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseenter', handleEnter);
      window.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('mouseout', handleOut);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // 偵測是否為觸控設備
  useEffect(() => {
    const supportsTouch = 'ontouchstart' in window;
    const hasTouchPoints = navigator.maxTouchPoints > 0;
    const hasMsTouchPoints = (navigator as any).msMaxTouchPoints > 0;

    if (supportsTouch || hasTouchPoints || hasMsTouchPoints) {
      setIsTouchDevice(true);
    }
  }, []);

  const handleStartDrawing = () => {
    setShowDrawingPage(true);
  };

  const fetchFortuneData = async (): Promise<FortuneResult> => {
    setIsLoading(true);
    try {
      const catImage = await fetchCatImage();

      const randomFortune =
        fortunesData[Math.floor(Math.random() * fortunesData.length)];

      const result: FortuneResult = {
        catImage,
        fortune: randomFortune,
        date: new Date().toDateString(),
      };

      saveFortune(result);
      setCurrentResult(result);
      setHasDrawn(true);
      return result;
    } catch (error) {
      console.error('抽籤失敗:', error);
      alert('抽籤失敗，請稍後再試');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (showDrawingPage) {
        setShowDrawingPage(false); 
    }
};

  const handleViewFortune = () => {
    if (currentResult) {
      setShowModal(true);
    }
  };

  if (showDrawingPage) {
    return (
      <>
        <DrawingPage 
        onFetchData={fetchFortuneData}
        result={currentResult}
        showModal={showModal}
        setShowModal={setShowModal}
        onModalClose={handleModalClose}
        isLoading={isLoading}/>
        {!isTouchDevice && isCursorVisible && (
          <img
            src="/cursor.png"
            alt="cursor"
            className="pointer-events-none fixed w-12 h-12 -translate-x-1/2 -translate-y-1/2 z-50 select-none"
            style={{ left: cursorPos.x, top: cursorPos.y }}
          />
        )}
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="mb-0 flex justify-center w-full">
        <img 
          src="/logo cat.png" 
          alt="抽一籤好喵" 
          className="w-full max-w-4xl h-auto object-contain"
        />
      </div>
      <p className="text-gray-600 mb-4 text-sm sm:text-base lg:text-lg">每日運勢，貓咪相伴</p>

      {hasDrawn ? (
        <div>
          <div className="mb-6">
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4">今天已經抽過籤囉！</p>
            <button
              onClick={handleViewFortune}
              className="bg-purple-500 shadow-lg shadow-gray-500/50 hover:bg-purple-600 text-white font-semibold py-3 px-4 sm:px-8 rounded-lg transition-colors text-sm sm:text-base lg:text-lg"
            >
              查看今日份的貓貓
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleStartDrawing}
          disabled={isLoading}
          className="shimmer-button bg-cyan-600 shadow-lg shadow-gray-500/50  hover:bg-cyan-800 text-white font-semibold py-4 px-4 sm:px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg relative text-sm sm:text-base lg:text-lg"
        >
          {isLoading ? '抽籤中...' : '抽出今日份的貓貓'}
        </button>
      )}

      {showModal && currentResult && (
        <FortuneModal
          result={currentResult}
          onClose={handleModalClose}
        />
      )}

      {!isTouchDevice && isCursorVisible && (
        <img
          src="/cursor.png"
          alt="cursor"
          className="pointer-events-none fixed w-12 h-12 -translate-x-1/2 -translate-y-1/2 z-50 select-none"
          style={{ left: cursorPos.x, top: cursorPos.y }}
        />
      )}
    </div>
  );
};

export default App;


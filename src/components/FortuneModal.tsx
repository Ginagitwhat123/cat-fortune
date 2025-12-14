import React from 'react';
import { FortuneResult } from '@/types';
import { StarRating } from '@/components/StarRating';

interface FortuneModalProps {
  result: FortuneResult;
  onClose: () => void;
}

export const FortuneModal: React.FC<FortuneModalProps> = ({ result, onClose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      style={{
        background: 'repeating-conic-gradient(#FFD700 0deg 15deg,#FFFACD 15deg 30deg)',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-5"></div>
      <div
        className="bg-sky-100 rounded-lg shadow-xl max-w-md w-full p-6 relative z-10 animate-modal-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 bg-indigo-300 -mx-6 -mt-6 px-6 py-7 rounded-t-lg">
          <div className="flex items-center gap-2">
            <img 
              src="/lucky leaf-2.png" 
              alt="幸運葉" 
              className="h-8 w-auto object-contain"
            />
            <h2 
              className="text-2xl font-bold text-gray-50"
              style={{ textShadow: '2px 2px 4px rgba(20, 20, 20, 0.5)' }}
            >
              今日運勢
            </h2>
          </div>
          <button
            onClick={onClose}
            className="relative text-gray-100 hover:text-gray-800 text-2xl leading-none w-8 h-8 flex items-center justify-center transition-colors group"
          >
            <span className="absolute inset-0 rounded-full bg-amber-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
            <span className="relative z-10">×</span>
          </button>
        </div>

        <div className="mb-6">
          <div
            className="w-full h-80 rounded-lg mb-4 bg-gray-200"
            style={{
              backgroundImage: `url(${result.catImage.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>

        <div className="mb-4">
          <StarRating stars={result.fortune.stars} />
        </div>

        <p className="text-gray-700 text-center text-lg leading-relaxed">
          {result.fortune.message}
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-indigo-300 hover:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
        >
          關閉
        </button>
      </div>
    </div>
  );
};


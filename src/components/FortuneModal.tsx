import React from 'react';
import { FortuneResult } from '../types';
import { StarRating } from './StarRating';

interface FortuneModalProps {
  result: FortuneResult;
  onClose: () => void;
}

export const FortuneModal: React.FC<FortuneModalProps> = ({ result, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-sky-100 rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 bg-indigo-400 -mx-6 -mt-6 px-6 py-7 rounded-t-lg">
          <div className="flex items-center gap-2">
            <img 
              src="/lucky leaf-2.png" 
              alt="幸運葉" 
              className="h-8 w-auto object-contain"
            />
            <h2 className="text-2xl font-bold text-gray-50">今日運勢</h2>
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
          className="mt-6 w-full bg-indigo-400 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          關閉
        </button>
      </div>
    </div>
  );
};


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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">今日運勢</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
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
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          關閉
        </button>
      </div>
    </div>
  );
};


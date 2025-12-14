import React, { useState, useEffect, useRef } from "react";
import { FortuneResult } from '@/types'; 
import { FortuneModal } from '@/components/FortuneModal'; 

interface DrawingPageProps {
  onFetchData: () => Promise<FortuneResult>;
  result: FortuneResult | null;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onModalClose: () => void;
  isLoading: boolean;
}

export const DrawingPage: React.FC<DrawingPageProps> = ({
  onFetchData,
  result,
  showModal,
  setShowModal,
  onModalClose,
  isLoading,
}) => {
  const catRef = useRef<HTMLDivElement>(null);
  const [eyePositions, setEyePositions] = useState({
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
  });
  const [hasSelected, setHasSelected] = useState(false);

  const handleSelectLeaf = async () => { 
    if (hasSelected || isLoading) return; 

    try {
      await onFetchData(); 
      setShowModal(true); 

    } catch (e) {
        setHasSelected(false); 
    }
  };

  // 眼白和眼黑的配置（需要根據實際圖片調整）
  const eyeConfig = {
    left: {
      centerX: 0.4, // 左眼中心相對於圖片寬度的比例
      centerY: 0.45, // 左眼中心相對於圖片高度的比例
      radius: 0.03, // 眼白半徑相對於圖片寬度的比例
      pupilRadius: 0.015, // 眼黑半徑相對於圖片寬度的比例
    },
    right: {
      centerX: 0.6, // 右眼中心相對於圖片寬度的比例
      centerY: 0.45, // 右眼中心相對於圖片高度的比例
      radius: 0.03,
      pupilRadius: 0.015,
    },
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!catRef.current) return;

      const rect = catRef.current.getBoundingClientRect();

      // 更新兩個眼睛的位置
      const updateEyePosition = (eye: "left" | "right") => {
        const config = eyeConfig[eye];

        // 計算眼睛中心在頁面上的絕對位置
        const eyeCenterX = rect.left + config.centerX * rect.width;
        const eyeCenterY = rect.top + config.centerY * rect.height;

        // 計算從眼睛中心到滑鼠的方向向量
        const eyeToMouseX = e.clientX - eyeCenterX;
        const eyeToMouseY = e.clientY - eyeCenterY;
        const eyeToMouseDistance = Math.sqrt(
          eyeToMouseX * eyeToMouseX + eyeToMouseY * eyeToMouseY
        );

        // 眼白半徑（像素）
        const eyeRadius = config.radius * rect.width;
        // 眼黑半徑（像素）
        const pupilRadius = config.pupilRadius * rect.width;
        // 眼黑可以移動的最大距離（眼白半徑 - 眼黑半徑）
        const maxDistance = Math.max(0, eyeRadius - pupilRadius);

        let pupilX = 0;
        let pupilY = 0;

        if (eyeToMouseDistance > 0) {
          // 限制眼黑在眼白範圍內
          const limitedDistance = Math.min(eyeToMouseDistance, maxDistance);
          pupilX = (eyeToMouseX / eyeToMouseDistance) * limitedDistance;
          pupilY = (eyeToMouseY / eyeToMouseDistance) * limitedDistance;
        }

        return { x: pupilX, y: pupilY };
      };

      setEyePositions({
        left: updateEyePosition("left"),
        right: updateEyePosition("right"),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: "#b5b2be" }}
    >
      <div className="flex flex-col items-center gap-8">
        {/* 貓咪圖片容器 */}
        <div
          ref={catRef}
          className="relative"
          style={{ width: "400px", height: "auto" }}
        >
          <img
            src="/looking cat.png"
            alt="Looking Cat"
            className="w-full h-auto"
          />

          {/* 左眼眼黑 */}
          <div
            className="absolute rounded-full bg-black transition-all duration-100 ease-out"
            style={{
              width: `${eyeConfig.left.pupilRadius * 400 * 2}px`,
              height: `${eyeConfig.left.pupilRadius * 400 * 2}px`,
              left: `calc(${eyeConfig.left.centerX * 100}% + ${
                eyePositions.left.x
              }px)`,
              top: `calc(${eyeConfig.left.centerY * 100}% + ${
                eyePositions.left.y
              }px)`,
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* 右眼眼黑 */}
          <div
            className="absolute rounded-full bg-black transition-all duration-100 ease-out"
            style={{
              width: `${eyeConfig.right.pupilRadius * 400 * 2}px`,
              height: `${eyeConfig.right.pupilRadius * 400 * 2}px`,
              left: `calc(${eyeConfig.right.centerX * 100}% + ${
                eyePositions.right.x
              }px)`,
              top: `calc(${eyeConfig.right.centerY * 100}% + ${
                eyePositions.right.y
              }px)`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        <p className="text-xl text-gray-600 mb-5">
          {isLoading ? "貓貓產生中..." : "請選擇其中一個幸運草"}
        </p>

        <div className="flex gap-20 items-center">
          {[1, 2, 3, 4, 5].map((index) => (
            <button
              key={index}
              onClick={handleSelectLeaf}
              disabled={isLoading || hasSelected}
              className={`transition-transform hover:scale-150 active:scale-95 cursor-pointer ${
                isLoading || hasSelected ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <img
                src="/lucky leaf-2.png"
                alt={`Lucky Leaf ${index}`}
                className={`w-16 h-16 object-contain ${
                  isLoading || hasSelected ? "opacity-70" : "animate-pulse" // 💡 停止動畫
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            </button>
          ))}
        </div>
      </div>
      {showModal && result && (
            <FortuneModal
              result={result}
              onClose={onModalClose} // 呼叫 App.tsx 的 handleModalClose，它會關閉 Modal 並切換頁面
            />
        )}

      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="text-white text-2xl animate-spin border-4 border-t-4 border-gray-200 border-t-purple-500 rounded-full w-12 h-12"></div>
        </div>
      )}
    </div>
  );
};

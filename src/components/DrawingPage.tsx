import React, { useState, useEffect, useRef } from "react";
import { FortuneResult } from "@/types";
import { FortuneModal } from "@/components/FortuneModal";

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
  const STATIC_OFFSET = {
    left: { x: -67, y: 78 },
    right: { x: -89, y: 69 },
  };

  const [dynamicPositions, setDynamicPositions] = useState({
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

  // 眼白和眼黑的配置
  const eyeConfig = {
    left: {
      centerX: 0.4, 
      centerY: 0.45, 
      radius: 0.04,
      pupilRadius: 0.023, 
    },
    right: {
      centerX: 0.6, 
      centerY: 0.45, 
      radius: 0.042,
      pupilRadius: 0.024,
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

        // 眼白眼黑半徑
        const eyeRadius = config.radius * rect.width;
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

      setDynamicPositions({
        left: updateEyePosition("left"),
        right: updateEyePosition("right"),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const finalLeftX = STATIC_OFFSET.left.x + dynamicPositions.left.x;
  const finalLeftY = STATIC_OFFSET.left.y + dynamicPositions.left.y;
  const finalRightX = STATIC_OFFSET.right.x + dynamicPositions.right.x;
  const finalRightY = STATIC_OFFSET.right.y + dynamicPositions.right.y;

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
              left: `calc(${eyeConfig.left.centerX * 100}% + ${finalLeftX}px)`,
              top: `calc(${eyeConfig.left.centerY * 100}% + ${finalLeftY}px)`,
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* 右眼眼黑 */}
          <div
            className="absolute rounded-full bg-black transition-all duration-100 ease-out"
            style={{
              width: `${eyeConfig.right.pupilRadius * 400 * 2}px`,
              height: `${eyeConfig.right.pupilRadius * 400 * 2}px`,
              left: `calc(${
                eyeConfig.right.centerX * 100
              }% + ${finalRightX}px)`,
              top: `calc(${eyeConfig.right.centerY * 100}% + ${finalRightY}px)`,
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
                src="/lucky leaf-1.png"
                alt={`Lucky Leaf ${index}`}
                className={`w-16 h-16 object-contain ${
                  isLoading || hasSelected
                    ? "opacity-70"
                    : "animate-pulse hover:animate-none"
                }`}
                style={{ animationDelay: `${index * 0.8}s` }}
              />
            </button>
          ))}
        </div>
      </div>
      {showModal && result && (
        <FortuneModal
          result={result}
          onClose={onModalClose} 
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

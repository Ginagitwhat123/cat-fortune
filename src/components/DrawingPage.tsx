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
  isTouchDevice: boolean;
}

export const DrawingPage: React.FC<DrawingPageProps> = ({
  onFetchData,
  result,
  showModal,
  setShowModal,
  onModalClose,
  isLoading,
  isTouchDevice,
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

  const [targetLeafIndex, setTargetLeafIndex] = useState(0); 
  const leafRefs = useRef<(HTMLButtonElement | null)[]>([]); 
  const TARGET_LEAVES = [1, 3, 5];

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
    if (hasSelected || isLoading) return; 

    const updateEyePositionLogic = (targetX: number, targetY: number, catRect: DOMRect) => {
      const newPositions = { left: { x: 0, y: 0 }, right: { x: 0, y: 0 } };

      (["left", "right"] as const).forEach(eye => {
          const config = eyeConfig[eye];
          const eyeCenterX = catRect.left + config.centerX * catRect.width;
          const eyeCenterY = catRect.top + config.centerY * catRect.height;

          const eyeToTargetX = targetX - eyeCenterX;
          const eyeToTargetY = targetY - eyeCenterY;
          const eyeToTargetDistance = Math.sqrt(
              eyeToTargetX * eyeToTargetX + eyeToTargetY * eyeToTargetY
          );

          const eyeRadius = config.radius * catRect.width;
          const pupilRadius = config.pupilRadius * catRect.width;
          const maxDistance = Math.max(0, eyeRadius - pupilRadius);

          let pupilX = 0;
          let pupilY = 0;

          if (eyeToTargetDistance > 0) {
              const limitedDistance = Math.min(eyeToTargetDistance, maxDistance);
              pupilX = (eyeToTargetX / eyeToTargetDistance) * limitedDistance;
              pupilY = (eyeToTargetY / eyeToTargetDistance) * limitedDistance;
          }
          newPositions[eye] = { x: pupilX, y: pupilY };
      });
      return newPositions;
    };


    if (!isTouchDevice) {
      // 模式 1：網頁版 (Mouse Move)
      const handleMouseMove = (e: MouseEvent) => {
        if (!catRef.current) return;
        const rect = catRef.current.getBoundingClientRect();
        const newPositions = updateEyePositionLogic(e.clientX, e.clientY, rect);
        setDynamicPositions(newPositions);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };

    } else {
      // 模式 2：手機版 (定時動畫) 
      const timer = setInterval(() => {
          setTargetLeafIndex(prevIndex => (prevIndex + 1) % TARGET_LEAVES.length);
      }, 1500); 

      const animateEyes = () => {
          if (!catRef.current || leafRefs.current.length === 0) return;

          const targetIndex = TARGET_LEAVES[targetLeafIndex];
          const targetRef = leafRefs.current[targetIndex - 1]; 

          if (!targetRef) return;

          const catRect = catRef.current.getBoundingClientRect();
          const targetRect = targetRef.getBoundingClientRect();
          const targetCenterX = targetRect.left + targetRect.width / 2;
          const targetCenterY = targetRect.top + targetRect.height / 2;
          
          const newPositions = updateEyePositionLogic(targetCenterX, targetCenterY, catRect);
          setDynamicPositions(newPositions);
      };
      animateEyes();

      return () => clearInterval(timer);
    }

  }, [isTouchDevice, targetLeafIndex, hasSelected, isLoading]);

  const finalLeftX = STATIC_OFFSET.left.x + dynamicPositions.left.x;
  const finalLeftY = STATIC_OFFSET.left.y + dynamicPositions.left.y;
  const finalRightX = STATIC_OFFSET.right.x + dynamicPositions.right.x;
  const finalRightY = STATIC_OFFSET.right.y + dynamicPositions.right.y;

  return (
    <div
      className="min-h-screen-safe flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: "#b5b2be" }}
    >
      <div className="flex flex-col items-center gap-2 sm:gap-8">
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

        <p className="text-gray-600 mb-5 text-sm sm:text-base lg:text-lg">
          {isLoading ? "貓貓產生中..." : "請選擇其中一個幸運草"}
        </p>

        <div className="flex gap-2 sm:gap-20 items-center">
          {[1, 2, 3, 4, 5].map((index) => (
            <button
              key={index}
              ref={el => (leafRefs.current[index - 1] = el)}
              onClick={handleSelectLeaf}
              disabled={isLoading || hasSelected}
              className={`transition-transform hover:scale-150 active:scale-95 cursor-pointer ${
                isLoading || hasSelected ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <img
                src="/lucky leaf-1.png"
                alt={`Lucky Leaf ${index}`}
                className={`w-16 h-16 object-contain  ${
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

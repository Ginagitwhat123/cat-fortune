import React, { useState, useEffect } from "react";

interface CustomCursorProps {
  isTouchDevice: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ isTouchDevice }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleBlur = () => setIsVisible(false);
    const handleFocus = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isTouchDevice, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <img
      src="/cursor.png"
      alt="cursor"
      className="pointer-events-none fixed w-12 h-12 -translate-x-1/2 -translate-y-1/2 z-[9999] select-none"
      style={{
        left: position.x,
        top: position.y,
        // transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))`
      }}
    />
  );
};

export default React.memo(CustomCursor);

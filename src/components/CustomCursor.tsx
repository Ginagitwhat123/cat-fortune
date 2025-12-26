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
      const isInside =
        e.clientX > 2 &&
        e.clientY > 2 &&
        e.clientX < window.innerWidth - 2 &&
        e.clientY < window.innerHeight - 2;

      if (!isInside) {
        setIsVisible(false);
      } else {
        if (!isVisible) setIsVisible(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        setIsVisible(false);
      }
    };
    const handleMouseEnter = () => setIsVisible(true);
    const handleBlur = () => setIsVisible(false);
    const handleFocus = () => setIsVisible(true);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseenter", handleMouseEnter);
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
      }}
    />
  );
};

export default React.memo(CustomCursor);

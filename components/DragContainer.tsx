"use client";
import { motion, useMotionValue } from "framer-motion";
import { useRef } from "react";

type Anchor = "top-left" | "top-right";
type HandlePosition = "bottom-left" | "bottom-right";

export default function CornerResizeContainer({
  children,
  min = 0.7,
  max = 1.05,
  anchor = "top-right",
  handlePosition = "bottom-left",
  icon = "↗",
}: {
  children: React.ReactNode;
  min?: number;
  max?: number;
  anchor?: Anchor;
  handlePosition?: HandlePosition;
  icon?: string;
}) {
  const scale = useMotionValue(1);
  const start = useRef<{ x: number; y: number } | null>(null);
  const startScale = useRef(1);

  const originClass =
    anchor === "top-left" ? "origin-top-left" : "origin-top-right";

  const handleClass =
    handlePosition === "bottom-left"
      ? "bottom-3 left-3 cursor-nesw-resize"
      : "bottom-3 right-3 cursor-nwse-resize";

  return (
    <motion.div
      style={{ scale }}
      className={`relative touch-none w-fit h-fit ${originClass}`}
    >
      {children}
      <div
        className={`absolute ${handleClass}
          w-8 h-8 rounded-full
          bg-slate-800 border shadow-lg 
          flex items-center justify-center z-50
          text-white text-xs select-none`}
        onTouchStart={(e) => {
          const t = e.touches[0];
          start.current = { x: t.clientX, y: t.clientY };
          startScale.current = scale.get();
        }}
        onTouchMove={(e) => {
          if (!start.current) return;

          const t = e.touches[0];
          const dx = t.clientX - start.current.x;
          const dy = start.current.y - t.clientY;

          const diagonal = -(dx + dy) / 2;
          const sensitivity = 0.0025;

          let nextScale = startScale.current + diagonal * sensitivity;
          nextScale = Math.min(Math.max(nextScale, min), max);
          scale.set(nextScale);
        }}
        onTouchEnd={() => {
          start.current = null;
        }}
      >
        {icon}
      </div>
    </motion.div>
  );
}

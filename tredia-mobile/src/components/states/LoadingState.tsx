// src/components/states/LoadingState.tsx
import React from "react";
import { MotiView } from "moti";
import GlassPanel from "../GlassPanel";

const LoadingState = () => {
  return (
    <GlassPanel className="p-4 w-full h-24 overflow-hidden">
      <MotiView
        from={{ translateX: -100 }}
        animate={{ translateX: 100 }}
        transition={{ loop: true, type: "timing", duration: 1000 }}
        style={{
          width: "30%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          position: "absolute",
        }}
      />
    </GlassPanel>
  );
};

export default LoadingState;

// src/components/AlertCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";

interface AlertCardProps {
  alert: {
    id?: string;
    title: string;
    description: string;
    severity: "HIGH" | "MEDIUM" | "LOW";
    timeAgo?: string;
    source?: string;
  };
}

const StyledView = styled(View);
const StyledText = styled(Text);

type SeverityStyle = {
  border: string;
  dot: string;
  labelBg: string;
  labelText: string;
};

const severityStyles: Record<AlertCardProps["alert"]["severity"], SeverityStyle> = {
  HIGH: {
    border: "border-loss/60",
    dot: "bg-loss",
    labelBg: "bg-loss/10",
    labelText: "text-loss",
  },
  MEDIUM: {
    border: "border-electricBlue/60",
    dot: "bg-electricBlue",
    labelBg: "bg-electricBlue/10",
    labelText: "text-electricBlue",
  },
  LOW: {
    border: "border-gray-600/60",
    dot: "bg-gray-400",
    labelBg: "bg-gray-500/10",
    labelText: "text-gray-300",
  },
};

const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const styles = severityStyles[alert.severity];

  return (
    <StyledView
      className={`mb-3 rounded-2xl border bg-cardBg px-4 py-3 flex-row ${styles.border}`}
    >
      {/* Left dot */}
      <StyledView className="mr-3 mt-1">
        <StyledView className={`w-2 h-2 rounded-full ${styles.dot}`} />
      </StyledView>

      {/* Content */}
      <StyledView className="flex-1">
        {/* Severity pill */}
        <StyledView
          className={`self-start mb-1 px-2 py-0.5 rounded-full ${styles.labelBg}`}
        >
          <StyledText
            className={`text-[10px] font-semibold tracking-wide ${styles.labelText}`}
          >
            {alert.severity}
          </StyledText>
        </StyledView>

        {/* Title */}
        <StyledText className="text-white text-sm font-semibold mb-1">
          {alert.title}
        </StyledText>

        {/* Description */}
        <StyledText className="text-gray-400 text-xs leading-5 mb-1">
          {alert.description}
        </StyledText>

        {/* Meta */}
        {(alert.timeAgo || alert.source) && (
          <StyledText className="text-gray-500 text-[11px]">
            {alert.source ? `${alert.source} • ` : ""}
            {alert.timeAgo}
          </StyledText>
        )}
      </StyledView>
    </StyledView>
  );
};

export default AlertCard;

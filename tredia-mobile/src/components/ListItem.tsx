// src/components/ListItem.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { styled } from "nativewind";
import { MaterialIcons } from "@expo/vector-icons";
import { trediaTheme } from "../theme/trediaTheme";

const StyledPressable = styled(Pressable);
const StyledView = styled(View);
const StyledText = styled(Text);

interface ListItemProps {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  onPress?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
  icon,
  title,
  subtitle,
  rightContent,
  onPress,
}) => {
  return (
    <StyledPressable
      onPress={onPress}
      className="flex-row items-center p-4 rounded-lg active:bg-white/10"
    >
      {icon && (
        <MaterialIcons
          name={icon}
          size={24}
          color={trediaTheme.colors.electricBlue}
          style={{ marginRight: 16 }}
        />
      )}
      <StyledView className="flex-1">
        <StyledText className="text-base text-white">{title}</StyledText>
        {subtitle && (
          <StyledText className="text-sm text-gray-400">
            {subtitle}
          </StyledText>
        )}
      </StyledView>
      {rightContent}
    </StyledPressable>
  );
};

export default ListItem;

// src/screens/AssistantScreen.tsx
import React from "react";
import { View, Text, FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { mockChatHistory, ChatMessage } from "../lib/mockAssistant";
import { MaterialIcons } from "@expo/vector-icons";
import NeonButton from "../components/NeonButton";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

const ChatBubble = ({ item }: { item: ChatMessage }) => (
  <StyledView
    className={`p-3 rounded-lg my-2 ${
      item.isUser ? "bg-electricBlue self-end" : "bg-gray-700 self-start"
    }`}
    style={{ maxWidth: "80%" }}
  >
    <StyledText className="text-white">{item.text}</StyledText>
    <StyledText className="text-xs text-gray-400 mt-1 self-end">
      {item.timestamp}
    </StyledText>
  </StyledView>
);

const AssistantScreen = () => {
  return (
    <StyledSafeAreaView className="flex-1 bg-[#0A0F1E]">
      <StyledView className="p-4 flex-1">
        <StyledText className="text-2xl font-bold text-white mb-4">
          Assistant
        </StyledText>
        <FlatList
          data={mockChatHistory}
          renderItem={({ item }) => <ChatBubble item={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          inverted
        />
        <StyledView className="flex-row items-center mt-4">
          <StyledTextInput
            className="flex-1 bg-gray-800 text-white rounded-full p-3 pl-5 mr-2 border border-border"
            placeholder="Type your message..."
            placeholderTextColor="gray"
          />
          <NeonButton className="rounded-full w-12 h-12 p-0">
            <MaterialIcons name="send" size={24} color="white" />
          </NeonButton>
        </StyledView>
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default AssistantScreen;

import { View, Text } from "react-native";
import React from "react";

const Badge = ({ children, className, textClassName }) => {
  return (
    <View className={className || "bg-red-500 px-2 py-1 rounded-full"}>
      <Text className={textClassName || "text-white text-xs font-bold"}>
        {children || "Badge"}
      </Text>
    </View>
  );
};

export default Badge;

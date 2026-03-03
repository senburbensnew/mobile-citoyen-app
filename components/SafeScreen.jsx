import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const SafeScreen = ({ children }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SafeScreen;

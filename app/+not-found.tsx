import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

export default function NotFound() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#0A2472", "#1E3A8A", "#D7263D"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <MaterialIcons
          name="error-outline"
          size={80}
          color="#fff"
          style={styles.icon}
        />

        <Text style={styles.title}>Oups !</Text>
        <Text style={styles.message}>
          On dirait que vous vous êtes égaré. Retournons à l’accueil pour
          continuer.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/")}
        >
          <Text style={styles.buttonText}>Retour à l’accueil</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: "#1E3A8A",
    fontSize: 16,
    fontWeight: "bold",
  },
});

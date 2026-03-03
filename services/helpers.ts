import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n/i18n"; // 👈 import your i18n instance

const LANGUAGE_KEY = "appLanguage";

export const toMillions = (amount: number) =>
  Number((amount / 1_000_000).toFixed(2));

/**
 * Store a key/value pair depending on platform
 */
const setStorageItem = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await AsyncStorage.setItem(key, value);
  }
};

/**
 * Retrieve a value depending on platform
 */
const getStorageItem = async (key: string) => {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await AsyncStorage.getItem(key);
  }
};

export const changeAppLanguage = async (lang: string) => {
  try {
    await i18n.changeLanguage(lang);
    await setStorageItem(LANGUAGE_KEY, lang);
    console.log("Language changed and saved:", lang);
  } catch (error) {
    console.log("Error changing language:", error);
  }
};

export const loadSavedLanguage = async () => {
  try {
    const savedLang = await getStorageItem(LANGUAGE_KEY);
    if (savedLang) {
      await i18n.changeLanguage(savedLang);
      console.log("Loaded saved language:", savedLang);
    } else {
      await i18n.changeLanguage("fr");
      console.log("No saved language found, using default.");
    }
  } catch (error) {
    console.log("Error loading saved language:", error);
  }
};

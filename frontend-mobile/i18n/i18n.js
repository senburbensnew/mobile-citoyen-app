import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ht from "./translations/ht.json";
import fr from "./translations/fr.json";

const resources = {
  ht: { translation: ht },
  fr: { translation: fr },
};

// Use French if Localization.locale is undefined
const deviceLanguage = Localization?.locale
  ? Localization.locale.split("-")[0]
  : "fr";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources,
  lng: deviceLanguage || "fr", // 👈 always safe
  fallbackLng: "fr",            // 👈 default language = French
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

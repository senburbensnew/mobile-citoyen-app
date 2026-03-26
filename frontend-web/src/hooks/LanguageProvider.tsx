import { ReactNode, useState } from "react";
import { Language } from "../types";
import { getTranslation } from "../utils/translations";
import { LanguageContext } from "./useLanguage";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("fr");

  const t = (key: string) => getTranslation(key, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

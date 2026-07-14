import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../../translations/index";

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({ children }: any) => {

  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLang = sessionStorage.getItem("language");
    if (savedLang) setLanguage(savedLang);
  }, []);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    sessionStorage.setItem("language", lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
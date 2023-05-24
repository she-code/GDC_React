import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    //   lng: "hi",
    fallbackLng: "en",
    detection: {
      order: ["path", "localStorage", "htmlTag", "cookie"],
      caches: ["localStorage", "cookie"], // cache user language on
    },
  });

export default i18n;

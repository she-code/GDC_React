import { useEffect, useState } from "react";
import logo from "../logo.svg";
import { ActiveLink } from "raviger";
import { useTranslation } from "react-i18next";

import { User } from "../types/userTypes";
import { getAuthToken } from "../utils/storageUtils";

export default function Header(props: { title: string; currentUser: User }) {
  const { t, i18n } = useTranslation();
  const languages = [
    { name: t("english"), code: "en" },
    { name: t("hindi"), code: "hi" },
  ];
  const currentLocale = localStorage.getItem("i18next") || "en";
  const [language, setLanguage] = useState(currentLocale);
  useEffect(() => {
    // Set initial language
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleChangeLocale = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);
    // Store language preference in localStorage
    localStorage.setItem("i18next", lang);
  };
  return (
    <div className="flex items-center justify-between text-gray-500">
      <img
        src={logo}
        className="animate-spin h-16 w-16"
        alt="img"
        style={{ animation: "spin 2s linear infinite" }}
      />
      <div>
        <span>{t("languages")}</span>{" "}
        <select
          onChange={handleChangeLocale}
          value={language}
          tabIndex={0}
          aria-label="language-switcher"
          className="focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-50"
        >
          {languages.map(({ name, code }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>{" "}
      <div className="flex justify-evenly">
        {[
          { page: t("home"), url: "/" },
          { page: t("about"), url: "/about" },
          // ...(props.currentUser?.username?.length > 0
          ...(getAuthToken()
            ? [
                {
                  page: t("logout"),
                  onclick: () => {
                    localStorage.removeItem("token");
                    window.location.reload();
                  },
                },
              ]
            : [
                {
                  page: t("login"),
                  url: "/login",
                },
              ]),
        ].map((link) =>
          link.url ? (
            <ActiveLink
              role="link"
              tabIndex={0}
              aria-label={link.page}
              href={link.url}
              key={link.page}
              exactActiveClass="text-green-500"
              className="p-3 shadow-md text-lg mx-2 font-semibold focus:outline-none
              focus:ring-1 focus:ring-blue-600 focus:ring-opacity-50"
            >
              {link.page}
            </ActiveLink>
          ) : (
            <button
              key={link.page}
              tabIndex={0}
              aria-label={link.page}
              onClick={link.onclick}
              className="p-3 shadow-md text-lg mx-2 font-semibold focus:outline-none
              focus:ring-1 focus:ring-blue-600 focus:ring-opacity-50"
            >
              {link.page}
            </button>
          )
        )}
      </div>
    </div>
  );
}

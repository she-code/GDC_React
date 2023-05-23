import logo from "../logo.svg";
import { ActiveLink } from "raviger";
import { User } from "../types/userTypes";
import { getAuthToken } from "../utils/storageUtils";

export default function Header(props: { title: string; currentUser: User }) {
  return (
    <div className="flex items-center justify-between text-gray-500">
      <img
        src={logo}
        className="animate-spin h-16 w-16"
        alt="img"
        style={{ animation: "spin 2s linear infinite" }}
      />
      <div className="flex justify-evenly">
        {[
          { page: "HOME", url: "/" },
          { page: "ABOUT", url: "/about" },
          // ...(props.currentUser?.username?.length > 0
          ...(getAuthToken()
            ? [
                {
                  page: "LOGOUT",
                  onclick: () => {
                    localStorage.removeItem("token");
                    window.location.reload();
                  },
                },
              ]
            : [
                {
                  page: "LOGIN",
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

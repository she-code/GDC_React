import logo from "../logo.svg";
import { ActiveLink } from "raviger";
import { User } from "../types/userTypes";

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
          ...(props.currentUser?.username?.length > 0
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
              href={link.url}
              key={link.page}
              exactActiveClass="text-green-500"
              className="p-3 shadow-md text-lg mx-2 font-semibold "
            >
              {link.page}
            </ActiveLink>
          ) : (
            <button
              key={link.page}
              onClick={link.onclick}
              className="p-3 shadow-md text-lg mx-2 font-semibold "
            >
              {link.page}
            </button>
          )
        )}
        {/* {links.map((link) => (
          <ActiveLink
            href={link.url}
            key={link.url}
            exactActiveClass="text-green-500"
            className="p-3 shadow-md text-lg mx-2 font-semibold "
          >
            {link.page}
          </ActiveLink>
        ))} */}
      </div>
    </div>
  );
}

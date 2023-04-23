import logo from "../logo.svg";
import { ActiveLink } from "raviger";

export default function Header(props: { title: string }) {
  const links = [
    { page: "HOME", url: "/" },
    { page: "ABOUT", url: "/about" },
  ];
  return (
    <div className="flex items-center justify-between text-gray-500">
      <img
        src={logo}
        className="animate-spin h-16 w-16"
        alt="img"
        style={{ animation: "spin 2s linear infinite" }}
      />
      <div className="flex justify-evenly">
        {links.map((link) => (
          <ActiveLink
            href={link.url}
            key={link.url}
            exactActiveClass="text-green-500"
            className="p-3 shadow-md text-lg mx-2 font-semibold "
          >
            {link.page}
          </ActiveLink>
        ))}
      </div>
    </div>
  );
}

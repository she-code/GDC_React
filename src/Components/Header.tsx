import React from "react";
import logo from "../logo.svg";
import { ActiveLink, Link } from "raviger";

export default function Header(props: { title: string }) {
  const links = [
    { page: "Home", url: "/" },
    { page: "About", url: "/about" },
  ];
  return (
    <div className="flex items-center justify-between">
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
            exactActiveClass="text-yellow-500"
            className="p-3 shadow-md text-lg mx-2"
          >
            {link.page}
          </ActiveLink>
        ))}
      </div>
    </div>
  );
}

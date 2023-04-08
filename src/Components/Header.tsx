import React from "react";
import logo from "../logo.svg";

export default function Header(props: { title: string }) {
  return (
    <div className="flex items-center justify-center">
      <img
        src={logo}
        className="animate-spin h-16 w-16"
        alt="img"
        style={{ animation: "spin 2s linear infinite" }}
      />
      <h1 className="text-center text-2xl flex-1 font-semibold">
        {props.title}
      </h1>
    </div>
  );
}

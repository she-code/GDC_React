import React from "react";
import Header from "./Header";

export default function AppContainer(props: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100 items-center overflow-y-auto">
      <div className=" p-4 mx-auto bg-white shadow-lg rounded-xl w-1/2 px-5">
        <Header title="Typeform using #react-typescript with #tailwindcss" />
        {props.children}
      </div>
    </div>
  );
}

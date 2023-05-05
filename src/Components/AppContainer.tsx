import React from "react";
import Header from "./Header";
import { User } from "../types/userTypes";

export default function AppContainer(props: {
  children: React.ReactNode;
  currentUser: User;
}) {
  return (
    <div className="flex  max-h-max min-h-screen bg-gray-100 items-center overflow-y-auto py-5">
      <div className=" p-4 mx-auto bg-white shadow-lg rounded-xl  w-2/3 px-5">
        <Header
          title="Typeform using #react-typescript with #tailwindcss"
          currentUser={props.currentUser}
        />
        {props.children}
      </div>
    </div>
  );
}

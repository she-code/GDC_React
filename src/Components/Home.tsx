import React from "react";
import logo from "../logo.svg";
export default function Home(props: { openFormCB: () => void }) {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex">
        <img src={logo} alt="logo" className="h-48" />
        <div className=" items-center flex-1 justify-center h-48 flex">
          <p className="text-xl font-semibold ">Welcome to home Page</p>
        </div>
      </div>
      <button className="p-2 bg-blue-500 text-white font-bold" onClick={props.openFormCB}>
        Open Form{" "}
      </button>
    </div>
  );
}

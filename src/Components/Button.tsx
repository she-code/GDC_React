import React from "react";

export default function Button(props: { name: string ,handleEvent :()=>void}) {
  const { name,handleEvent } = props;
  return (
    <button className="bg-blue-600 text-white py-2 px-3 text-lg uppercase rounded-xl m-3 w-1/6 mx-auto" onClick={handleEvent}>
      {name}
    </button>
  );
}

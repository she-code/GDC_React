import React from "react";
import loading from "../../loading.gif";

export default function Loading() {
  return (
    <img
      src={loading}
      alt="Loading"
      className="text-center w-20 mx-auto  h-20"
    />
  );
}

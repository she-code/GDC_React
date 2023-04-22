import React from "react";

export default function CustomHeader(props: { title: string }) {
  const { title } = props;
  return <p className="text-xl font-semibold text-gray-600">{title}</p>;
}

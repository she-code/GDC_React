import React from "react";

export default function CustomHeader(props: {
  title: string;
  margin?: boolean;
  capitalize?: boolean;
}) {
  const { title, margin, capitalize } = props;
  return (
    <p
      className={`text-xl font-semibold text-gray-600 ${
        margin ? "mt-6" : "mt-0"
      } ${capitalize ? "capitalize" : "none"} `}
    >
      {title}
    </p>
  );
}

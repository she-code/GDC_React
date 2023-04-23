import { Link } from "raviger";
import React, { useState } from "react";

export default function FormCard(props: {
  title: string;
  questions: number;
  id: number;
  handleDeleteEventCB: (id: number) => void;
}) {
  const { title, questions, id, handleDeleteEventCB } = props;
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="flex my-2 p-5 justify-between shadow-md w-full rounded-lg bg-white">
      <div>
        <p className="capitalize text-lg font-semibold text-gray-500 mb-1">
          {title}
        </p>
        <p className="text-md text-gray-500 border-2 border-yellow-200 px-2 py-1">
          {questions ? `${questions} Questions` : "No questions"}
        </p>
      </div>

      <div className="relative">
        <button
          className="inline-flex justify-center items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md hover:bg-gray-200 focus:outline-none "
          onClick={() => setOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-7 h-7 text-black-600 hover:text-yellow-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg flex flex-col  z-10">
            <Link
              href={`/forms/${id}`}
              className="hover:bg-neutral-100 w-full px-4 py-2 text-lg font-normal text-neutral"
            >
              Edit
            </Link>
            <button
              className=" px-4 py-2 text-lg font-normal text-neutral hover:bg-neutral-100 w-full text-start"
              onClick={(_) => handleDeleteEventCB(id)}
            >
              Delete
            </button>
            <Link
              href={`/preview/${id}`}
              className="  px-4 py-2 text-lg font-normal text-neutral hover:bg-neutral-100 w-full"
            >
              Preview
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

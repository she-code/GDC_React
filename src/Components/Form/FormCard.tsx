import { Link } from "raviger";
import { useDrag, useDrop } from "react-dnd";
import { FormItem } from "../../types/formTypes";
import { useRef } from "react";

export default function FormCard(props: {
  title: string;
  id: number;
  handleDeleteEventCB: (id: number) => void;
}) {
  const { title, id, handleDeleteEventCB } = props;

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "formCard",
      item: { id },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult();
        if (item && dropResult) {
          console.log(dropResult, item.id);
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id]
  );

  return (
    <div
      ref={drag}
      draggable
      className="flex my-2 p-5 justify-between shadow-md w-full rounded-lg bg-white focus-outline-none focus-visible:bg-transparent 
                          focus:outline-none 
                          focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 "
      tabIndex={0}
    >
      <div>
        <p className="capitalize text-lg font-semibold text-gray-500 mb-1">
          {title}
        </p>
      </div>
      <div className=" flex items-start">
        <Link
          role="link"
          aria-label="edit"
          tabIndex={0}
          href={`/forms/${id}`}
          className="hover:bg-neutral-100 w-full px-4 py-2 text-lg font-normal text-neutral focus:outline-none focus:bg-neutral-100 focus:text-green-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </Link>
        <button
          aria-label="delete"
          className=" px-4 py-2 text-lg font-normal text-neutral hover:bg-neutral-100 w-full text-start focus:outline-none focus:bg-neutral-100 focus:text-red-600"
          onClick={(_) => handleDeleteEventCB(id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-red-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
        <Link
          href={`/preview/${id}`}
          arai-label="preview"
          role="link"
          className="  px-4 py-2 text-lg font-normal text-neutral hover:bg-neutral-100 w-full items-center focus:outline-none focus:bg-neutral-100 focus:text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-blue-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

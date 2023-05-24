import { t } from "i18next";
import { Link } from "raviger";

export default function SubmissionCard(props: {
  formId: number;
  submissionId: number;
  answersCount: number;
  index: number;
}) {
  const { formId, answersCount, submissionId, index } = props;
  return (
    <div
      className="flex my-2 p-5 justify-between shadow-md w-full rounded-lg bg-white focus:outline-none
       focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
      tabIndex={0}
    >
      <div>
        <p className="capitalize text-lg font-semibold text-gray-500 mb-1">
          {t("submission")}
          {index + 1}
        </p>
        <p className="text-md text-gray-500 border-2 border-yellow-200 px-2 py-1">
          {answersCount === 0
            ? `${answersCount} Answer`
            : `${answersCount} Answers`}
        </p>
      </div>
      <div className=" flex items-start">
        <Link
          role="link"
          aria-label={`View submission ${index + 1}`}
          href={`/forms/${formId}/submission/${submissionId}`}
          className="  px-4 py-2 text-lg font-normal text-neutral hover:bg-neutral-100 w-full items-center focus:outline-none focus:bg-neutral-200 focus:text-blue-600"
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

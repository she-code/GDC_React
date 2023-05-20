import React, { useReducer, useEffect } from "react";
import { submissionReducer } from "../../reducers/submissionReducer";
import { Pagination } from "../../types/common";
import { submissionIntialState, Submission } from "../../types/responseTypes";
import { getSubmissions } from "../../utils/apiUtils";
import Loading from "../common/Loading";
import SubmissionCard from "./SubmissionCard";

export default function SubmissionsList(props: { formId: number }) {
  const [state, dispatch] = useReducer(
    submissionReducer,
    submissionIntialState
  );
  useEffect(() => {
    const get_Form = async () => {
      try {
        const submissions: Pagination<Submission> = await getSubmissions(
          { offset: 0, limit: 5 },
          formId
        );
        if (submissions.results) {
          dispatch({
            type: "SUBMISSIONS_FETCH_SUCCESS",
            submissions: submissions.results,
          });
        }
      } catch (error) {
        dispatch({
          type: "SUBMISSIONS_FETCH_ERROR",
          error: "Something went wrong. Please try later",
        });
      }
    };
    get_Form();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { formId } = props;
  return (
    <div>
      {" "}
      <div>
        {state?.loading ? (
          <Loading />
        ) : (
          <>
            {" "}
            {state?.error ? (
              <>{state.error}</>
            ) : (
              <div className="mx-5">
                {state?.submissions?.length === 0 ? (
                  <p>No Submissions are created</p>
                ) : (
                  <>
                    {state?.submissions?.map(
                      (submission: Submission, index: number) => (
                        <div
                          className="flex gap-2 justify-between my-2 items-center"
                          key={submission.id}
                        >
                          <SubmissionCard
                            key={formId}
                            index={index}
                            answersCount={submission?.answers?.length}
                            formId={formId}
                            submissionId={submission?.id as number}
                          />
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import React, { useState, Fragment, useEffect, useReducer } from "react";
import { navigate, usePath } from "raviger";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { getSubmission } from "../../utils/apiUtils";
import { submissionReducer } from "../../reducers/submissionReducer";
import { submissionIntialState, Answer } from "../../types/responseTypes";
import Loading from "../common/Loading";
import NotFound from "../NotFound";
import { getAuthToken } from "../../utils/storageUtils";

const fetchSubmission = async (id: number, submissionId: number) => {
  try {
    const response = await getSubmission(id, submissionId);
    // const data = await response.json();
    return response;
  } catch (error) {
    console.error(error);
  }
};
export default function SubmissionDetail(props: {
  id: number;
  submissionId: number;
}) {
  const [open, setOpen] = useState(1);
  const { id, submissionId } = props;
  const param = usePath();
  const subId = Number(param?.split("/")[4]);
  const [state, dispatch] = useReducer(
    submissionReducer,
    submissionIntialState
  );
  //checks if the user is authenticated
  useEffect(() => {
    if (getAuthToken() === null) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const sub_Id = subId ?? submissionId;
    fetchSubmission(id, sub_Id)
      .then((data) => {
        dispatch({ type: "FETCH_SUBMISSION_SUCCESS", submission: data });
      })
      .catch((error) => {
        dispatch({ type: "FETCH_SUBMISSION_FAILURE", error: error });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <>
      {state?.loading ? (
        <Loading />
      ) : (
        <>
          {state?.error ? (
            <p>{state?.error.toString()}</p>
          ) : (
            <>
              {state?.submission ? (
                <Fragment>
                  <p className="text-center text-xl font-semibold">
                    {state?.submission?.form?.title}
                  </p>
                  {state?.submission?.answers?.map(
                    (answer: Answer, index: number) => (
                      <Accordion
                        open={open === index + 1}
                        key={index}
                        className="p-3 divide-y-2 divider mt-3"
                        role="region"
                        aria-labelledby={`accordion-header-${index + 1}`}
                      >
                        <AccordionHeader
                          role="button"
                          onClick={() => handleOpen(index + 1)}
                          className="flex justify-between mb-3"
                          id={`accordion-header-${index + 1}`}
                          tabIndex={0}
                          aria-controls={`accordion-body-${index + 1}`}
                          aria-expanded={open === index + 1 ? "true" : "false"}
                        >
                          <p>Answer {index + 1}</p>
                          <p className="font-light text-lg flex-2">
                            <span className=" font-semibold">Created At: </span>
                            {
                              state?.submission?.created_date
                                ?.toString()
                                .split("T")[0]
                            }
                          </p>
                        </AccordionHeader>
                        <AccordionBody
                          id={`accordion-body-${index + 1}`}
                          hidden={open !== index + 1}
                          aria-labelledby={`accordion-header-${index + 1}`}
                          role="region"
                        >
                          <div className="flex gap-2 justify-between w-1/2">
                            <p>{answer?.form_field}</p>
                            <p className="capitalize text-lg">
                              {answer?.value}
                            </p>
                          </div>
                        </AccordionBody>
                      </Accordion>
                    )
                  )}
                </Fragment>
              ) : (
                <NotFound />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

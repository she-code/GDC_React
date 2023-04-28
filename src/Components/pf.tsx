import React, { useState } from "react";
import { responseData } from "../types/responseTypes";
import { getLocalResponses, initialState } from "../utils/storageUtils";

export default function pf(props: { id: number }) {
  const { id } = props;
  //     const [state, setState] = useState(() => initialState(id!));

  //     //initializes the response value
  //   const initialResponse: (id: number) => responseData | undefined = (id) => {
  //     if (state?.formFields?.length) {
  //       const localResponses = getLocalResponses();
  //       const selectedResponse = localResponses?.find(
  //         (response) => response.formId === id
  //       );
  //       if (selectedResponse) {
  //         return selectedResponse;
  //       } else {
  //         const newResponse = {
  //           id: Number(new Date()),
  //           formId: state.id,
  //           formTitle: state.title,
  //           responses: [],
  //         };
  //         return newResponse;
  //       }
  //     }}
  return <div>pf</div>;
}

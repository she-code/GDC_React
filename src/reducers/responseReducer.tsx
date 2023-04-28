import { ResponeActions } from "../types/responseReducerTypes";
import { responseData, responseType } from "../types/responseTypes";
import { getNewResponse } from "../utils/getNewResponse";

export const reducer = (
  responseState: responseData | undefined,
  action: ResponeActions
) => {
  switch (action.type) {
    case "ADD_RESPONSE": {
      const newResponse = getNewResponse(
        action.question,
        action.response,
        action.questionId
      );
      let existingRes = responseState?.responses.find(
        (res) =>
          res.questionId === action.state?.formFields[action.currentField]?.id
      );
      if (existingRes) {
        action.updateUserResCB();

        if (action.state.formFields[action.currentField]?.kind === "dropdown") {
          action.updateSelectedCB();
        }
        return responseState;
      }
      if (newResponse?.question?.length > 0 && responseState?.responses) {
        return {
          ...responseState,
          responses: [...responseState.responses, newResponse],
        };
      }
      return responseState;
    }
    case "SET_USER_RES": {
      action.updateUserResCB();
      return responseState;
    }
    case "SET_SELECTED": {
      action.updateSelectedCB();
      return responseState;
    }
    case "UPDATE_BY_USER_RES": {
      let valueToUpdate = responseState?.responses.find(
        (field: responseType) =>
          field.questionId === action.state.formFields[action.currentField]?.id
      );
      if (valueToUpdate !== undefined) {
        valueToUpdate.response = action.userRes;
      }
      if (responseState?.responses.length) {
        return {
          ...responseState,
          responses: [...responseState?.responses],
        };
      }
      return responseState;
    }
    case "UPDATE_BY_SELECTED": {
      let valueToUpdate = responseState?.responses.find(
        (field: responseType) =>
          field.questionId === action.state.formFields[action.currentField]?.id
      );
      if (valueToUpdate !== undefined) {
        valueToUpdate.response = [...action.selectedOptions];
      }
      if (responseState?.responses.length) {
        return {
          ...responseState,
          responses: [...responseState?.responses],
        };
      }
      return responseState;
    }
  }
};
// case "UPDATE_RESPONSE": {
//   const {
//     state,
//     response,
//     question,
//     questionId,
//     currentField,
//     updateSelectedCB,
//     updateUserResCB,
//   } = action;
// }
//   ...responseState,
//  responses:[...responseState?.responses ?? [], newResponse],
//     responses: [...(responseState?.responses ?? []), newResponse],

// case "UPDATE_RESPONSE": {
//   return {
//     ...responseState,
//     responses: responseState?.responses?.map((response) => {
//       if (response.questionId === action.questionId) {
//         return {
//           ...response,
//           response: action.response,
//         };
//       }
//       return response;
//     }),
//   };
// }
// case "ADD_RESPONSE": {
//   const newResponse = getNewResponse(action.question, action.response);
//   if (newResponse.question.length > 0) {
//     action.updateUserResCB();
//     return {
//       ...responseState,
//       responses: [...responseState.responses, newResponse],
//     };
//   }
//   return responseState;
// }
/* This code block is handling the "UPDATE_RESPONSE" action in the reducer function. */
//  const existingRes = responseState?.responses.find(
//   (res) => res.questionId === state?.formFields[currentField]?.id
// );
// if (existingRes) {
//   updateUserResCB();

//   if (state.formFields[currentField]?.kind === "dropdown") {
//     updateSelectedCB();
//   }
//   return responseState;
// } else {
//   // const newResponse = {
//   //   question: state?.formFields[currentField]?.label,
//   //   response: response,
//   //   questionId: state.formFields[currentField]?.id,
//   // };
//   const newResponse = {
//     question: question,
//     response: response,
//     questionId: questionId,
//   };
//   return {
//   ...responseState,
//   responses: [
//     ...responseState.responses,
//     {
//       question: state.formFields[currentField]?.label,
//       response: userRes,
//       questionId: state.formFields[currentField]?.id,
//     },
//   ],
//     },

//   }

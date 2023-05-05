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
        action.questionId,
        action.kind
      );
      let existingQues = responseState?.responses?.find(
        (ques) => ques.questionId === newResponse.questionId
      );
      if (
        newResponse?.question?.length > 0 &&
        responseState?.responses &&
        !existingQues
      ) {
        return {
          ...responseState,
          responses: [...responseState.responses, newResponse],
        };
      }
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
    case "SET_CURRENT_FIELD": {
      if (typeof action.currentField === "number" && responseState) {
        return {
          ...responseState,
          currentField: action.currentField,
        };
      }

      return responseState;
    }
    case "SET_USER_RESPONSE": {
      if (typeof action.userRes === "string" && responseState) {
        return {
          ...responseState,
          userRes: action.userRes,
        };
      }
      return responseState;
    }
    case "SET_SELECTED_RESPONSE": {
      if (
        Array.isArray(action.selectedOptions) &&
        action.selectedOptions.every((option) => typeof option === "string") &&
        responseState
      ) {
        return {
          ...responseState,
          selectedOptions: action.selectedOptions,
        };
      }
      return responseState;
    }
  }
};

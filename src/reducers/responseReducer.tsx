import { ResponeActions } from "../types/responseReducerTypes";
import { responseData } from "../types/responseTypes";
import { getNewResponse } from "../utils/getNewResponse";

export const reducer = (
  responseState: responseData,
  action: ResponeActions
) => {
  switch (action.type) {
    case "ADD_RESPONSE": {
      const newResponse = getNewResponse(action.question, action.response);
      if (newResponse.question.length > 0) {
        action.updateUserResCB();
        return {
          ...responseState,
          responses: [...responseState.responses, newResponse],
        };
      }
      return responseState;
    }
    case "UPDATE_RESPONSE": {
      return {
        ...responseState,
        responses: responseState.responses?.map((response) => {
          if (response.questionId === action.questionId) {
            return {
              ...response,
              response: action.response,
            };
          }
          return response;
        }),
      };
    }
  }
};

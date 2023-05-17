import { Submission } from "../types/responseTypes";
import { SubmissionAction } from "../types/submissionReducerTypes";

export const submissionReducer = (
  state: Submission,
  action: SubmissionAction
) => {
  switch (action.type) {
    case "SUBMISSIONS_FETCH_SUCCESS": {
      return {
        ...state,
        answers: action.submissions,
        loading: false,
        error: "",
      };
    }
    case "CREATE_SUBMISSION": {
      if (state && state?.answers && typeof action.currentField === "number" ) {
        return {
          ...state,
          answers: [...state.answers, action.submission],
          currentField: action.currentField,
        };
      }
      return state;
    }
    case "SET_USER_RESPONSE": {
      if (typeof action.userRes === "string" && state) {
        return {
          ...state,
          userRes: action.userRes,
        };
      }
      return state;
    }
    case "SET_CURRENT_FIELD": {
      if (typeof action.currentField === "number" && state) {
        return {
          ...state,
          currentField: action.currentField,
        };
      }

      return state;
    }
    case "SET_FIELDS": {
      if (
        typeof action.currentField === "number" &&
        state &&
        typeof action.userRes === "string"
      ) {
        return {
          ...state,
          currentField: action.currentField,
          userRes: action.userRes,
        };
      }

      return state;
    }
  }
};

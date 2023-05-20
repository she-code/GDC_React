import { Answer, SubmissionType } from "../types/responseTypes";
import { SubmissionAction } from "../actions/submissionReducerActions";

export const submissionReducer = (
  state: SubmissionType,
  action: SubmissionAction
) => {
  switch (action.type) {
    case "SUBMISSIONS_FETCH_SUCCESS": {
      return {
        ...state,
        submissions: action.submissions,
        loading: false,
        error: "",
      };
    }
    case "SUBMISSIONS_FETCH_ERROR": {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }
    case "CREATE_SUBMISSION": {
      if (state && state?.submission?.answers) {
        return {
          ...state,
          submissions: [...state.submissions, action.submission],
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
    case "SET_ANSWER": {
      let existingAnswer = state?.submission.answers.find(
        (answer) => answer.form_field === action.fieldId
      );
      if (
        typeof action.fieldId === "number" &&
        typeof action.value === "string" &&
        state &&
        !existingAnswer
      ) {
        return {
          ...state,
          submission: {
            ...state.submission,
            userRes: action.value,
            answers: [
              ...state.submission.answers,
              { form_field: action.fieldId, value: state.userRes as string },
            ],
          },
        };
      }
      return state;
      // case "CREATE_ANSWERS":{
      //   if(typeof action.fieldId === "number" && typeof action.value === "string" && state){
      //     return {
      //       ...state,
      //       submissions:[...state.submissions,]
      //     }
      //   }
      // }
    }
    case "UPDATE_BY_USER_RES": {
      let valueToUpdate = state?.submission.answers.find(
        (field: Answer) =>
          field.form_field === action.state.formFields[action.currentField]?.id
      );
      if (valueToUpdate !== undefined) {
        valueToUpdate.value = action.userRes;
      }
      if (state?.submission.answers.length) {
        return {
          ...state,
          submission: {
            ...state.submission,
            answers: [...state?.submission.answers],
          },
        };
      }
      return state;
    }
    case "UPDATE_BY_SELECTED": {
      let valueToUpdate = state?.submission?.answers?.find(
        (field: Answer) =>
          field.form_field === action.state?.formFields[action.currentField]?.id
      );
      if (valueToUpdate !== undefined) {
        let copy = action.selectedOptions;
        let newAnswers: Answer[] = [];

        // Filter out existing values that are unchecked
        state.submission.answers.forEach((existingAnswer) => {
          if (
            existingAnswer.form_field === valueToUpdate!.form_field &&
            !copy?.includes(existingAnswer.value as string)
          ) {
            // Skip adding the existing value to the newAnswers array
            return;
          }
          newAnswers.push(existingAnswer);
        });

        copy?.forEach((val) => {
          // Check if the value already exists
          const existingAnswer = newAnswers.find(
            (answer) =>
              answer.form_field === valueToUpdate!.form_field &&
              answer.value === val
          );
          if (!existingAnswer) {
            let newAnswer: Answer = {
              form_field: valueToUpdate!.form_field as number,
              value: val,
            };
            newAnswers.push(newAnswer);
          }
        });

        return {
          ...state,
          submission: {
            ...state.submission,
            answers: newAnswers,
          },
        };
      }

      return state;
    }
    case "SET_FORM": {
      return {
        ...state,
        submission: { ...state.submission, form: action.form },
      };
    }
    case "SET_SELECTED_OPTION": {
      if (
        Array.isArray(action.selectedOptions) &&
        action.selectedOptions.every((option) => typeof option === "string") &&
        state
      ) {
        console.log({ action });
        return {
          ...state,
          selectedOptions: action.selectedOptions,
        };
      }
      return state;
    }
    case "RESET_RESPONSES": {
      if (
        Array.isArray(action.selectedOptions) &&
        action.selectedOptions.every((option) => typeof option === "string") &&
        state &&
        typeof action.userRes === "string"
      ) {
        return {
          ...state,
          userRes: action.userRes,
          selectedOptions: action.selectedOptions,
        };
      }
      return state;
    }
    case "FETCH_SUBMISSION_SUCCESS": {
      return {
        ...state,
        loading: false,
        submission: action.submission,
      };
    }
    case "FETCH_SUBMISSION_FAILURE": {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }
  }
};

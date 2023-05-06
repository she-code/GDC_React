import { FormAction, FormIntialState } from "../types/formReducerTypes";

export const FormReducer = (state: FormIntialState, action: FormAction) => {
  switch (action.type) {
    case "FETCH_FORMS_SUCCESS": {
      return {
        ...state,
        forms: action.fomrs,
        error: "",
        loading: false,
      };
    }
    case "FETCH_FORMS_FAILURE": {
      return {
        ...state,
        forms: [],
        error: action.error,
        loading: false,
      };
    }
  }
};

import { FormAction, FormIntialState } from "../types/formReducerTypes";

export const FormReducer = (state: FormIntialState, action: FormAction) => {
  switch (action.type) {
    case "FETCH_FORMS_SUCCESS": {
      return {
        ...state,
        forms: action.forms,
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
    case "FETCH_FORM": {
      return {
        ...state,
        form: action.form,
        error: "",
        loading: false,
      };
    }
    case "FETCH_FORM_FIELDS": {
      return {
        ...state,
        formFields: action.formFields,
      };
    }
    case "SET_FORM_TITLE": {
      return {
        ...state,
        form: {
          ...state.form,
          title: action.title,
        },
      };
    }
    case "SET_FORM_DESCRIPTION": {
      return {
        ...state,
        form: {
          ...state.form,
          description: action.description,
        },
      };
    }
    case "SET_FORM_VISIBILITY": {
      return {
        ...state,
        form: {
          ...state.form,
          is_public: action.is_public,
        },
      };
    }
    case "SET_ERROR": {
      return {
        ...state,
        error: action.error,
      };
    }
    case "CREATE_FORM": {
      return {
        ...state,
        forms: [...state.forms, action.form],
      };
    }
    case "UPDATE_FORM": {
      let form = state.forms.find((form) => form.id === action.form.id);
      if (form) {
        form = action.form;
        return {
          ...state,
          forms: [...state.forms, form],
        };
      }
      return state;
    }
    case "DELETE_FORM": {
      return {
        ...state,
        forms: state.forms.filter((product) => product.id !== action.formId),
      };
    }
  }
};

import { FormAction } from "../actions/formReducerActions";
import { DropdownField, FormIntialState, RadioType } from "../types/formTypes";

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
    case "FETCH_FORM_FAILURE": {
      return {
        ...state,
        form: { title: "" },
        error: action.error,
        loading: false,
      };
    }
    case "FETCH_FORM_FIELD": {
      return {
        ...state,
        formField: action.formField,
        error: "",
        loading: false,
      };
    }
    case "FETCH_FORM_FIELDS": {
      return {
        ...state,
        formFields: action.formFields,
        error: "",
        loading: false,
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
      if (typeof action.is_public === "boolean" && state) {
        return {
          ...state,
          form: {
            ...state.form,
            is_public: Boolean(action.is_public),
          },
        };
      }
      return state;
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
    case "SET_FIELD_KIND": {
      return {
        ...state,
        kind: action.kind,
      };
    }
    case "SET_FIELD_LABEL": {
      return {
        ...state,
        label: action.label,
      };
    }
    case "CLEAR_FORM_FIELD": {
      return {
        ...state,
        Kind: action.kind,
        label: action.label,
      };
    }
    case "ADD_FORM_FIELD": {
      action.callBack();
      return {
        ...state,
        formFields: [...state.formFields, action.formField],
      };
    }
    case "DELETE_FORM_FIELD": {
      return {
        ...state,
        formFields: state?.formFields?.filter(
          (product) => product.id !== action.formFieldId
        ),
      };
    }
    case "GET_FORM": {
      let form = state?.forms?.find((form) => form.id === action.formId);
      if (form) {
        return {
          ...state,
          form: form,
        };
      }
      return state;
    }
    case "UPDATE_FORM_FIELD": {
      return {
        ...state,
        formFields: state?.formFields?.map((field) => {
          if (field.id === action?.formField?.id && field.kind !== "TEXT") {
            return {
              ...field,
              options: action?.formField?.options,
            };
          }
          return field;
        }),
      };
    }

    case "SET_OPTION": {
      if (typeof action.option === "string" && state) {
        return {
          ...state,
          userRes: action.option,
        };
      }
      return state;
    }
    case "DELETE_OPTION": {
      return {
        ...state,
        formFields: state?.formFields?.map((field) => {
          if (field.id === action.fieldId && field.kind !== "TEXT") {
            return {
              ...field,
              options: (field as DropdownField | RadioType).options?.filter(
                (option: string, index: number) => index !== action.index
              ),
            };
          }
          return field;
        }),
      };
    }
  }
};

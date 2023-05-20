import { FormFieldKind, FormFieldType, FormItem } from "../types/formTypes";

export type FetchFormsSucess = {
  type: "FETCH_FORMS_SUCCESS";
  forms: FormItem[];
};
export type FetchFormsError = {
  type: "FETCH_FORMS_FAILURE";
  error: string;
};
export type FetchFormFailure = {
  type: "FETCH_FORM_FAILURE";
  error: string;
};
export type FetchForm = {
  type: "FETCH_FORM";
  form: FormItem;
};
// export type CreateForm ={
//     type: "CREATE_FORM";
//     form: FormItem;
// }
export type SetFormTitle = {
  type: "SET_FORM_TITLE";
  title: string;
};
export type GetForm = {
  type: "GET_FORM";
  formId: number;
};
export type SetFormDescription = {
  type: "SET_FORM_DESCRIPTION";
  description: string;
};
export type SetFormVisibility = {
  type: "SET_FORM_VISIBILITY";
  is_public: boolean;
};
export type FetchFormFields = {
  type: "FETCH_FORM_FIELDS";
  formFields: FormFieldType[];
};
export type FetchFormField = {
  type: "FETCH_FORM_FIELD";
  formField: FormFieldType;
};

export type SetError = {
  type: "SET_ERROR";
  error: string;
};
export type CreateForm = {
  type: "CREATE_FORM";
  form: FormItem;
};
export type UpdateForm = {
  type: "UPDATE_FORM";
  form: FormItem;
};
export type DeleteForm = {
  type: "DELETE_FORM";
  formId: number;
};

export type SetFieldKind = {
  type: "SET_FIELD_KIND";
  kind: FormFieldKind;
};
export type SetFieldLabel = {
  type: "SET_FIELD_LABEL";
  label: string;
};
export type AddFormField = {
  type: "ADD_FORM_FIELD";
  formField: FormFieldType;
  callBack: () => void;
};
export type ClearFormField = {
  type: "CLEAR_FORM_FIELD";
  kind: FormFieldKind;
  label: string;
};

export type DeleteFormField = {
  type: "DELETE_FORM_FIELD";
  formFieldId: number;
};

export type UpdateFormField = {
  type: "UPDATE_FORM_FIELD";
  // option: string;
  formField: FormFieldType;
  fieldId: number;
};
export type SetOption = {
  type: "SET_OPTION";
  option: string;
};

export type DeleteOption = {
  type: "DELETE_OPTION";
  index: number;
  fieldId: number;
};
export type FormAction =
  | FetchFormsSucess
  | FetchFormsError
  | FetchForm
  | SetError
  | DeleteForm
  | UpdateForm
  | AddFormField
  | ClearFormField
  | SetOption
  | DeleteOption
  | FetchFormFields
  | SetFormTitle
  | SetFormDescription
  | UpdateFormField
  | SetFormVisibility
  | GetForm
  | DeleteFormField
  | FetchFormField
  | CreateForm
  | SetFieldKind
  | FetchFormFailure
  | SetFieldLabel;

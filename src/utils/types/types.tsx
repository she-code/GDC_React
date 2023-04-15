export interface formData {
  id: number;
  title: string;
  formFields: formField[];
}
export interface formField {
  id: number;
  label: string;
  fieldType: string;
  value: string;
}
export interface responseType {
  question: string;
  response: string;
}
export interface responseData {
  id: number;
  formId: number;
  formTitle: string;
  responses: responseType[];
}

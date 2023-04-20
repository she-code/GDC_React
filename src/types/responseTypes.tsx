export interface responseType {
  question: string;
  response: string | string[];
}
export interface responseData {
  id: number;
  formId: number;
  formTitle: string;
  responses: responseType[];
}

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

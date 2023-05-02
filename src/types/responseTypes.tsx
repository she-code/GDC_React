export interface responseType {
  question: string;
  questionId: number;
  response: string | string[];
}
export interface responseData {
  id: number;
  formId: number;
  formTitle: string;
  responses: responseType[];
  currentField?: number;
  userRes?: string | string[];
}

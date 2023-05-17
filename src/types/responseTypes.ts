import { FormItem } from "./formTypes";

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
  selectedOptions?: string[];
}

export type Answer = {
  form_field: number;
  value: string;
};

export type Submission = {
  answers: Answer[];
  form?: FormItem;
  created_date?: string;
  loading: boolean;
  error: string;
  answer?: Answer;
  currentField?: number;
  userRes?: string | string[];
  selectedOptions?: string[];
};
export const submissionIntialState: Submission = {
  answers: [],
  answer: { form_field: 0, value: "" },
  loading: true,
  error: "",
};

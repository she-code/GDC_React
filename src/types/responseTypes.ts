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
  value: string | string[];
};

export type Submission = {
  answers: Answer[];
  form?: FormItem;
  created_date?: string;
  answer?: Answer;
  id?: number;
};

export type SubmissionType = {
  submissions: Submission[];
  submission: Submission;
  loading: boolean;
  userRes?: string | string[];
  selectedOptions?: string[];
  error: string;
  currentField?: number;
};
export const submissionIntialState: SubmissionType = {
  submission: {
    answers: [
      {
        form_field: 0,
        value: "",
      },
    ],
  },
  submissions: [],
  loading: true,
  error: "",
};

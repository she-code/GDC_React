import { FormIntialState, FormItem } from "../types/formTypes";
import { Submission } from "../types/responseTypes";

export type CreateSubmission = {
  type: "CREATE_SUBMISSION";
  submission: Submission;
};
type SubmissionsFetchSuccess = {
  type: "SUBMISSIONS_FETCH_SUCCESS";
  submissions: Submission[];
};
type SubmissionsFetchError = {
  type: "SUBMISSIONS_FETCH_ERROR";
  error: string;
};
type FetchSubmission = {
  type: "FETCH_SUBMISSION_SUCCESS";
  submission: Submission;
};
type FetchSubmissionFailure = {
  type: "FETCH_SUBMISSION_FAILURE";
  error: string;
};
type SetUserResponse = {
  type: "SET_USER_RESPONSE";
  userRes: string | string[];
};
type SetCurrentField = {
  type: "SET_CURRENT_FIELD";
  currentField: number;
};
type SetAnswers = {
  type: "SET_ANSWER";
  fieldId: number;
  value: string;
};
type SetFields = {
  type: "SET_FIELDS";
  currentField: number;
  userRes: string | string[];
};
type ResetResponses = {
  type: "RESET_RESPONSES";
  userRes: string | string[];
  selectedOptions: string | string[];
};
type UpdateByUserRes = {
  type: "UPDATE_BY_USER_RES";
  state: FormIntialState;
  currentField: number;
  userRes: string | string[];
};

type SetSelectedOption = {
  type: "SET_SELECTED_OPTION";
  selectedOptions: string | string[];
};
type SetForm = {
  type: "SET_FORM";
  form: FormItem;
};
type UpdateBySelectedOption = {
  type: "UPDATE_BY_SELECTED";
  state: FormIntialState;
  currentField: number;
  selectedOptions: string[];
};
export type SubmissionAction =
  | SubmissionsFetchSuccess
  | CreateSubmission
  | SetAnswers
  | SetForm
  | SetUserResponse
  | SetFields
  | SubmissionsFetchError
  | FetchSubmission
  | UpdateByUserRes
  | UpdateBySelectedOption
  | SetSelectedOption
  | FetchSubmissionFailure
  | ResetResponses
  | SetCurrentField;

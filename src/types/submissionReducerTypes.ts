import { Answer, Submission } from "./responseTypes";

export type CreateSubmission = {
  type: "CREATE_SUBMISSION";
  submission: Submission;
  currentField: number;
};
type SubmissionsFetchSuccess = {
  type: "SUBMISSIONS_FETCH_SUCCESS";
  submissions: Answer[];
};
type SetUserResponse = {
  type: "SET_USER_RESPONSE";
  userRes: string | string[];
};
type SetCurrentField = {
  type: "SET_CURRENT_FIELD";
  currentField: number;
};

type SetFields = {
    type: "SET_FIELDS";
    currentField: number;
    userRes: string | string[];
}
export type SubmissionAction =
  | SubmissionsFetchSuccess | CreateSubmission
  | SetUserResponse | SetFields 
  | SetCurrentField;

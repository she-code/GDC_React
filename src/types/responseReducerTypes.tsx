import { formData } from "./formTypes";

type AddResponse = {
  type: "ADD_RESPONSE";
  question: string;
  kind: string;
  response: string | string[];
  questionId: number;
  id: number;
  state: formData;

  currentField: number;
};
type UpdateResponse = {
  type: "UPDATE_RESPONSE";
  questionId: number;
  response: string | string[];
  question: string;
  updateUserResCB: () => void;
  updateSelectedCB: () => void;
  state: formData;
  currentField: number;
};
type UpdateByUserRes = {
  type: "UPDATE_BY_USER_RES";
  state: formData;
  // updateUserResCB: () => void;
  currentField: number;
  userRes: string | string[];
};
type UpdateBySelectedOption = {
  type: "UPDATE_BY_SELECTED";
  state: formData;
  currentField: number;
  selectedOptions: string[];
};

type SetCurrentField = {
  type: "SET_CURRENT_FIELD";
  currentField: number;
};
type SetUserResponse = {
  type: "SET_USER_RESPONSE";
  userRes: string | string[];
};
type SetSelectedResponse = {
  type: "SET_SELECTED_RESPONSE";
  selectedOptions: string[];
};
export type ResponeActions =
  | AddResponse
  | UpdateResponse
  | UpdateByUserRes
  | UpdateBySelectedOption
  | SetCurrentField
  | SetUserResponse
  | SetSelectedResponse;

import { formData } from "./formTypes";

type AddResponse = {
  type: "ADD_RESPONSE";
  question: string;
  updateUserResCB: () => void;
  updateSelectedCB: () => void;
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
type SetUserRes = {
  type: "SET_USER_RES";
  updateUserResCB: () => void;
};
type SetSelectedOption = {
  type: "SET_SELECTED";
  updateSelectedCB: () => void;
};
type SetCurrentField = {
  type: "SET_CURRENT_FIELD";
  currentField: number;
};
export type ResponeActions =
  | AddResponse
  | UpdateResponse
  | SetUserRes
  | UpdateByUserRes
  | UpdateBySelectedOption
  | SetCurrentField
  | SetSelectedOption;

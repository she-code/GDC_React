type AddResponse = {
  type: "ADD_RESPONSE";
  question: string;
  updateUserResCB: () => void;
  updateSelectedCB: () => void;
  response: string;
};
type UpdateResponse = {
  type: "UPDATE_RESPONSE";
  questionId: number;
  response: string | string[];
};
export type ResponeActions = AddResponse | UpdateResponse;

import { responseType } from "../types/responseTypes";

export const getNewResponse: (
  question: string,
  response: string | string[],
  questionId: number,
  kind: string
) => responseType = (question, response, questionId, kind) => {
  return {
    question: question,
    questionId: questionId,
    response:
      kind === "dropdown" ? (response as string[]) : (response as string),
  };
};

import { responseType } from "../types/responseTypes";

export const getNewResponse: (
  question: string,
  response: string | string[],
  questionId: number
) => responseType = (question, response, questionId) => {
  return {
    question: question,
    questionId: questionId,
    response: response,
  };
};

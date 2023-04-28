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

//   }
//     ...responseState,
//     responses: responseState.responses?.map((res) => {
//       if (res.questionId === action.id) {
//         action.updateUserResCB();
//         if (
//           action.state.formFields[action.currentField]?.kind === "dropdown"
//         ) {
//           action.updateSelectedCB();
//         }

//         return responseState;
//       }
//       return {
//         ...responseState,
//         responses: [
//           ...responseState.responses,
//           {
//             question: action.label,
//             response: action.response,
//             questionId: action.id,
//           },
//         ],
//       };
//       // action.updateUserResCB();
//       // action.updateSelectedCB();
//     }),
//   };
// }

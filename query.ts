import { Queries } from "./types";

export const generateUserPrompt = (queries: Queries): string => {
  let userPrompt = `
    Format all output as JSON with the following properties:
      answer: string

    Give advice on how to best care for a plant given the following questions and answers. 
    Don't ask for clarification, just provide an answer to the best of your ability given the following info.

  `;
  Object.values(queries).forEach((query) => {
    userPrompt += `${query.q}: ${query.ans}\n`;
  });

  return userPrompt;
};

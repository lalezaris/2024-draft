import responses from "@/constants/responses";

import { CountryResult, FormResult, OverUnder } from "@/types";

export const getCorrectGuesses = (countryResults: CountryResult[]) => {
  const answersMap = new Map<string, FormResult>();
  responses.forEach((response) => {
    let correctAnswers = 0;
    let totalCorrectMedals = 0;
    countryResults.forEach((country) => {
      const guess = response[country.id];
      const current =
        country.gold < country.line ? OverUnder.UNDER : OverUnder.OVER;
      if (guess === current) {
        correctAnswers++;
        totalCorrectMedals += country.gold;
      }
    });
    answersMap.set(response.email, {
      correctAnswers: correctAnswers,
      totalCorrectMedals: totalCorrectMedals,
    });
  });
  return answersMap;
};

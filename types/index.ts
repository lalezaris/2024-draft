export type CountryResult = {
  name: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  line: number;
  id: CountryCodes;
};

export enum CountryCodes {
  FRA = "fra",
  GBR = "gbr",
  BEL = "bel",
  NED = "ned",
  AUS = "aus",
  ITA = "ita",
  GER = "ger",
  CAN = "can",
  ESP = "esp",
  SWE = "swe",
  DEN = "den",
  IRL = "irl",
  USA = "usa",
  CHN = "chn",
}

type CountryGuess = {
  [key in CountryCodes]: OverUnder;
};

export type FormResponse = CountryGuess & {
  name: string;
  email: string;
  standing: number;
};

export enum OverUnder {
  OVER = "Over",
  UNDER = "Under",
}

export type FormResult = {
  correctAnswers: number;
  totalCorrectMedals: number;
};

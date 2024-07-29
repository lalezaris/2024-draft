import odds from "@/constants/odds.js";
import { CountryCodes, CountryResult } from "@/types";

const ENDPOINT = "https://olympics.com/en/paris-2024/medals";

export const fetchMedals = async () => {
  const medalList: CountryResult[] = [];

  const response = await fetch(ENDPOINT);
  const body = await response.text();
  const html = document.createElement("html");

  html.innerHTML = body;

  const rows = html.querySelectorAll("[data-testid=noc-row");

  rows.forEach((row) => {
    const id = row
      .querySelector("div")
      ?.querySelectorAll("span")[1]
      .innerText.toLowerCase();
    const name = row
      .querySelector("div")
      ?.querySelectorAll("span")[2].innerText;
    const medals = row.querySelectorAll("span.emotion-srm-81g9w1");
    const goldMedalCount = medals[0].innerHTML;
    const silverMedalCount = medals[1].innerHTML;
    const bronzeMedalCount = medals[2].innerHTML;
    const totalMedalCount =
      Number(goldMedalCount) +
      Number(silverMedalCount) +
      Number(bronzeMedalCount);

    const countryOption = odds.find(
      (odd) => odd.id.trim().toLowerCase() === id?.trim().toLowerCase()
    );

    if (countryOption && name && id) {
      medalList.push({
        id: id as CountryCodes,
        name: name,
        gold: Number(goldMedalCount),
        silver: Number(silverMedalCount),
        bronze: Number(bronzeMedalCount),
        total: totalMedalCount,
        line: countryOption.line,
      });
    }
  });

  return medalList;
};

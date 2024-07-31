import odds from "@/constants/odds.js";
import { CountryCodes, CountryResult } from "@/types";

const ENDPOINT =
  "https://en.wikipedia.org/wiki/2024_Summer_Olympics_medal_table?origin=*";

// const API = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=revisions&titles=Pet_door&formatversion=2&rvprop=content&rvslots=*'

export const fetchMedals = async () => {
  const medalList: CountryResult[] = [];

  const url =
    "https://en.wikipedia.org/w/api.php?" +
    new URLSearchParams({
      origin: "*",
      action: "parse",
      // prop: "wikitext",
      page: "2024_Summer_Olympics_medal_table",
      format: "json",
    });
  const response = await fetch(url);
  const json = await response.json();
  console.log("response", json.parse.text["*"]);
  // const body = await response.text();
  const html = document.createElement("html");

  html.innerHTML = json.parse.text["*"];

  const rows = html.querySelectorAll("table.wikitable > tbody > tr");

  console.log("wiki rows", rows);
  rows.forEach((row) => {
    console.log(" inner row", row);
    // const id = row
    //   .querySelector("div")
    //   ?.querySelectorAll("span")[1]
    //   .innerText.toLowerCase();
    const name = row.querySelector("a")?.textContent;
    const medals = row.querySelectorAll("td");
    let goldMedalCount, silverMedalCount, bronzeMedalCount;
    if (medals.length === 5) {
      goldMedalCount = medals[1].innerHTML;
      silverMedalCount = medals[2].innerHTML;
      bronzeMedalCount = medals[3].innerHTML;
    } else if (medals.length === 4) {
      goldMedalCount = medals[0].innerHTML;
      silverMedalCount = medals[1].innerHTML;
      bronzeMedalCount = medals[2].innerHTML;
    }
    const totalMedalCount =
      Number(goldMedalCount) +
      Number(silverMedalCount) +
      Number(bronzeMedalCount);

    console.log("fetchMedals medals page", name, medals.length);

    console.log("fetchMedals api", name);
    const countryOption = odds.find(
      (odd) => odd.name.trim().toLowerCase() === name?.trim().toLowerCase()
    );

    // console.log("countryOption", name, countryOption);
    const id = "1";
    if (countryOption && name && id) {
      console.log("countryOption", name, goldMedalCount);
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

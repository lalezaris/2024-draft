import { fetchMedals } from "@/api/fetchMedals";
import CountryResults from "@/components/CountryResults";
import { DraftOrder } from "@/components/DraftOrder";
import odds from "@/constants/odds.js";
import { CountryResult } from "@/types";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function Index() {
  const [countryResults, setCountryResults] = useState<CountryResult[]>();

  const fetchMedalsPage = async () => {
    try {
      const medalList = await fetchMedals();
      if (medalList.length !== odds.length) {
        odds.forEach((odd) => {
          if (!medalList.find((country) => country.id === odd.id)) {
            medalList.push({
              id: odd.id,
              name: odd.olyName,
              gold: 0,
              silver: 0,
              bronze: 0,
              total: 0,
              line: odd.line,
            });
          }
        });
      }
      console.log("medalList", medalList);

      setCountryResults(medalList);
    } catch (e) {}
  };

  useEffect(() => {
    fetchMedalsPage();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        gap: 32,
        alignItems: "center",
      }}
    >
      <DraftOrder countryResults={countryResults} />
      <CountryResults countryResults={countryResults} />
      {/* <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Gold Medals</th>
            <th>Line</th>
            <th>Current Result</th>
          </tr>
        </thead>
        <tbody>
          {countryResults ? (
            countryResults
              .sort((a, b) => {
                if (a.gold !== b.gold) {
                  return b.gold - a.gold;
                } else {
                  return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
                }
              })
              .map((odd) => {
                return (
                  <tr key={odd.name}>
                    <td>
                      {odd.name} ({odd.id})
                    </td>
                    <td>{odd.gold || 0}</td>
                    <td>{odd.line}</td>
                    <td>{odd.gold < odd.line ? "UNDER" : "OVER"}</td>
                  </tr>
                );
              })
          ) : (
            <tr>
              <td>loading...</td>
            </tr>
          )}
        </tbody>
      </table> */}
    </View>
  );
}

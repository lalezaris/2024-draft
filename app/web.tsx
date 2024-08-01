import { fetchMedals } from "@/api/fetchMedals";
import { DraftOrder } from "@/components/DraftOrder";
import odds from "@/constants/odds.js";
import { CountryResult } from "@/types";
import { useEffect, useState } from "react";
import { ActivityIndicator, useWindowDimensions } from "react-native";

export default function Web() {
  const [countryResults, setCountryResults] = useState<CountryResult[]>();

  const fetchMedalsPage = async () => {
    try {
      const medalList = await fetchMedals();
      if (medalList.length !== odds.length) {
        odds.forEach((odd) => {
          if (
            !medalList.find((country) => {
              console.log("fetchMedals, odd, country", odd.name, odd, country);
              return (
                country.name.trim().toLowerCase() ===
                odd.name.trim().toLowerCase()
              );
            })
          ) {
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
  const { width } = useWindowDimensions();

  return !!countryResults ? (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <DraftOrder countryResults={countryResults} />

      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ padding: "1rem", borderBottom: "2px solid black" }}>
              Country
            </th>
            <th style={{ padding: "1rem", borderBottom: "2px solid black" }}>
              Gold Medals
            </th>
            <th style={{ padding: "1rem", borderBottom: "2px solid black" }}>
              Line
            </th>
            <th style={{ padding: "1rem", borderBottom: "2px solid black" }}>
              Current Result
            </th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
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
                    <td
                      style={{ padding: "0.125rem .5rem", textAlign: "left" }}
                    >
                      {width > 700 ? odd.name : odd.id.toUpperCase()}
                    </td>
                    <td style={{ padding: "0.125rem .5rem" }}>
                      {odd.gold || 0}
                    </td>
                    <td style={{ padding: "0.125rem .5rem" }}>{odd.line}</td>
                    <td style={{ padding: "0.125rem .5rem" }}>
                      {odd.gold < odd.line ? "UNDER" : "OVER"}
                    </td>
                  </tr>
                );
              })
          ) : (
            <tr>
              <td>loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  ) : (
    <ActivityIndicator style={{ margin: "auto" }} size="large" />
  );
}

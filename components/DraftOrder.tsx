import responses from "@/constants/responses";
import {
  CountryCodes,
  CountryResult,
  FormResponse,
  FormResult,
  OverUnder,
} from "@/types";
import { getCorrectGuesses } from "@/utils/getCorrectGuesses";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { styles } from "./styles";

const ListHeader = () => (
  <View style={styles.item}>
    <View style={{ width: "5%", justifyContent: "flex-end" }}>
      <Text style={styles.header}>#</Text>
    </View>
    <View style={{ width: "25%", justifyContent: "flex-end" }}>
      <Text style={styles.header}>Name</Text>
    </View>
    <View style={{ width: "20%", justifyContent: "flex-end" }}>
      <Text style={styles.header}>Correct Guesses</Text>
    </View>
    <View style={{ width: "15%", justifyContent: "flex-end" }}>
      <Text style={styles.header}>Total Medals</Text>
    </View>
    <View style={{ width: "15%", justifyContent: "flex-end" }}>
      <Text style={styles.header}>2023 Finish</Text>
    </View>
  </View>
);

type DraftOrderItemProps = {
  item: FormResponse;
  result: Map<string, FormResult>;
  index: number;
};

const DraftOrderItem = ({ result, item, index }: DraftOrderItemProps) => {
  return (
    <View style={styles.item}>
      <View style={{ width: "5%" }}>
        <Text>{index + 1}</Text>
      </View>
      <View style={{ width: "25%" }}>
        <Text>{item.name}</Text>
      </View>
      <View style={{ width: "20%" }}>
        <Text>{result.get(item.email)?.correctAnswers}</Text>
      </View>
      <View style={{ width: "15%" }}>
        <Text>{result.get(item.email)?.totalCorrectMedals}</Text>
      </View>
      <View style={{ width: "15%" }}>
        <Text>{item.standing}</Text>
      </View>
    </View>
  );
};

type DraftOrderProps = {
  countryResults?: CountryResult[];
};

export const DraftOrder = ({ countryResults }: DraftOrderProps) => {
  const [formResult, setFormResult] = useState(new Map<string, FormResult>());
  const [sortedResponses, setSortedResponses] = useState(responses);

  useEffect(() => {
    if (countryResults) {
      console.log("countryResults", countryResults);
      const answersMap = getCorrectGuesses(countryResults);
      const sorted = responses.sort((a, b) => {
        const aResult = answersMap.get(a.email);
        const bResult = answersMap.get(b.email);

        if (bResult && aResult) {
          if (aResult.correctAnswers !== bResult.correctAnswers) {
            return bResult?.correctAnswers - aResult?.correctAnswers;
          } else if (
            aResult.totalCorrectMedals !== bResult.totalCorrectMedals
          ) {
            return bResult.totalCorrectMedals - aResult.totalCorrectMedals;
          }
        }
        return b.standing - a.standing;
      });
      setSortedResponses(sorted);
      setFormResult(answersMap);
    }
  }, [countryResults]);

  if (!sortedResponses) {
    return false;
  }

  const [toggleRow, setToggleRow] = useState(-1);
  return (
    <div style={{ width: "100%", maxWidth: "850px", margin: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginBottom: 32 }}
      >
        <thead>
          <tr>
            <th style={{ padding: "1rem", borderBottom: "2px solid black" }}>
              #
            </th>
            <th style={{ padding: "1rem", borderBottom: "2px solid black" }}>
              Name
            </th>
            <th style={{ padding: "1rem", borderBottom: "2px solid black" }}>
              Correct
              <br />
              Guesses
            </th>
            <th style={{ padding: "1rem", borderBottom: "2px solid black" }}>
              Total
              <br />
              Medals
            </th>
            <th style={{ padding: "1rem", borderBottom: "2px solid black" }}>
              2023
              <br />
              Finish
            </th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {sortedResponses.map((response, index) => {
            const result = formResult.get(response.email);
            return (
              <>
                <tr
                  key={index}
                  style={{ borderBottom: "1px solid gray", cursor: "pointer" }}
                  onClick={() => {
                    toggleRow === index
                      ? setToggleRow(-1)
                      : setToggleRow(index);
                  }}
                >
                  <td style={{ padding: ".5rem", textAlign: "left" }}>
                    {index + 1}
                  </td>
                  <td
                    style={{
                      padding: ".5rem",
                      textAlign: "left",
                      color: "darkblue",
                      textDecorationLine: "underline",
                    }}
                  >
                    {response.name}
                  </td>
                  <td style={{ padding: ".5rem" }}>{result?.correctAnswers}</td>
                  <td style={{ padding: ".5rem" }}>
                    {result?.totalCorrectMedals}
                  </td>
                  <td style={{ padding: ".5rem" }}>{response.standing}</td>
                </tr>
                {toggleRow === index && (
                  <tr>
                    <td colSpan={5}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          columnGap: ".5rem",
                          rowGap: ".125rem",
                          border: "1px solid black",
                          backgroundColor: "lightgray",
                        }}
                      >
                        {Object.keys(CountryCodes)
                          .sort()
                          .map((code) => {
                            const answer =
                              response[code.toLowerCase() as CountryCodes];
                            const country = countryResults?.find(
                              (country) =>
                                country.id.toLowerCase() === code.toLowerCase()
                            );
                            const result =
                              country?.gold > country?.line
                                ? OverUnder.OVER
                                : OverUnder.UNDER;

                            return (
                              <span>
                                {code.toUpperCase()}:{" "}
                                <span
                                  style={{
                                    fontFamily: "sans-serif",
                                    fontWeight: "bold",
                                    color: `${
                                      answer === result ? "green" : "red"
                                    }`,
                                  }}
                                >
                                  {answer.slice(0, 1)}
                                </span>
                              </span>
                            );
                          })}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  return (
    <View>
      <FlatList
        data={sortedResponses}
        renderItem={(props) => (
          <DraftOrderItem result={formResult} {...props} />
        )}
        ListHeaderComponent={ListHeader}
      />
    </View>
  );
};

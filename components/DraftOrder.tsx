import responses from "@/constants/responses";
import { CountryResult, FormResponse, FormResult } from "@/types";
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

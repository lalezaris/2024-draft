import { CountryResult, OverUnder } from "@/types";
import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { styles } from "./styles";

const CountryHeader = () => (
  <View style={styles.item}>
    <View style={{ width: "40%", justifyContent: "flex-end" }}>
      <Text style={styles.header}>Country</Text>
    </View>
    <View style={{ width: "15%" }}>
      <Text style={styles.header}>Gold Medals</Text>
    </View>
    <View style={{ width: "15%", justifyContent: "flex-end" }}>
      <Text style={styles.header}>Line</Text>
    </View>
    <View style={{ width: "15%" }}>
      <Text style={styles.header}>Current Result</Text>
    </View>
  </View>
);

type CountryItemProps = {
  item: CountryResult;
};

const CountryItem = ({ item }: CountryItemProps) => (
  <View style={styles.item}>
    <View style={{ width: "40%", flexGrow: 1, flexWrap: "wrap" }}>
      <Text style={styles.header}>{item.name}</Text>
    </View>
    <View style={{ width: "15%" }}>
      <Text>{item.gold}</Text>
    </View>
    <View style={{ width: "15%" }}>
      <Text>{item.line}</Text>
    </View>
    <View style={{ width: "15%" }}>
      <Text>{item.gold < item.line ? OverUnder.UNDER : OverUnder.OVER}</Text>
    </View>
  </View>
);

type CountryResultsProps = {
  countryResults?: CountryResult[];
};

const CountryResults = ({ countryResults }: CountryResultsProps) => {
  return (
    <FlatList
      style={{ width: "90%", maxWidth: 600 }}
      data={countryResults}
      renderItem={CountryItem}
      ListHeaderComponent={CountryHeader}
    />
  );
};

export default CountryResults;

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getParqueaderos } from "../../src/services/api";

export default function Home() {
  interface Parqueadero {
    id: number;
    nombre: string;
    disponibles: number;
  }

  const [data, setData] = useState<Parqueadero[]>([]);

  useEffect(() => {
    getParqueaderos().then(setData);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bienvenido David Claudio</ThemedText>
      </ThemedView>
      <View>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text style={styles.itemText}>
              {item.nombre} - Disponibles: {item.disponibles}
            </Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff", // si estás en modo oscuro
    padding: 16,
  },
  titleContainer: {
    bottom: 0,
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ffff", // si estás en modo oscuro
  },
  itemText: {
    color: "red",
    marginBottom: 10,
  },
});

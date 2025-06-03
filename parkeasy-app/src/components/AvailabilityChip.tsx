import { Text } from "react-native";

type Props = { free: number; total: number };

export default function AvailabilityChip({ free, total }: Props) {
  if (total <= 0) return null;

  const percentage = Math.round((free / total) * 100);
  const color = percentage > 0 ? "#16A34A" /* verde */ : "#DC2626"; /* rojo */

  return (
    <Text
      accessibilityRole="status"
      style={{
        backgroundColor: color,
        color: "white",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 12,
      }}
    >
      {percentage}% libre
    </Text>
  );
}

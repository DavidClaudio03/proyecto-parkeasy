import { render } from "@testing-library/react-native";
import AvailabilityChip from "../AvailabilityChip";

describe("AvailabilityChip (RN)", () => {
  it("muestra “70% libre” en verde cuando hay 7 de 10", () => {
    const { getByRole } = render(<AvailabilityChip free={7} total={10} />);
    const chip = getByRole("status");
    expect(chip).toHaveTextContent("70% libre");
    expect(chip.props.style.backgroundColor).toBe("#16A34A");
  });

  it("no renderiza nada si total ≤ 0", () => {
    const { toJSON } = render(<AvailabilityChip free={0} total={0} />);
    expect(toJSON()).toBeNull();
  });
});

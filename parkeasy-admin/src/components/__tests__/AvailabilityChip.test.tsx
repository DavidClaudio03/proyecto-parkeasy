import { render, screen } from "@testing-library/react";
import AvailabilityChip from "../AvailabilityChip";

describe("AvailabilityChip", () => {
  it("muestra “70% libre” en verde cuando hay 7 de 10 espacios", () => {
    render(<AvailabilityChip free={7} total={10} />);
    const chip = screen.getByRole("status");
    expect(chip).toHaveTextContent("70% libre");
    expect(chip).toHaveClass("bg-green-500");
  });

  it("muestra “0% libre” en rojo cuando no hay espacios libres", () => {
    render(<AvailabilityChip free={0} total={10} />);
    const chip = screen.getByRole("status");
    expect(chip).toHaveTextContent("0% libre");
    expect(chip).toHaveClass("bg-red-500");
  });

  it("no renderiza nada si total ≤ 0 (caso borde)", () => {
    const { container } = render(<AvailabilityChip free={0} total={0} />);
    expect(container).toBeEmptyDOMElement();
  });
});

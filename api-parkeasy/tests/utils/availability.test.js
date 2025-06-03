const { getAvailabilityPercentage } = require("../../src/utils/availability");

describe("getAvailabilityPercentage", () => {
  test("devuelve 70 % cuando hay 10 espacios y 3 ocupados", () => {
    expect(getAvailabilityPercentage(10, 3)).toBe(70);
  });

  test("devuelve 0 % si el total es 0 (caso borde)", () => {
    expect(getAvailabilityPercentage(0, 0)).toBe(0);
  });
});

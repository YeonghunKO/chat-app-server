function addTwo(a: number, b: number) {
  return a + b;
}

describe("test", () => {
  it("add two", () => {
    const result = addTwo(1, 2);

    expect(result).toBe(3);
  });
});

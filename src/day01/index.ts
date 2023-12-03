import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const regex = new RegExp(/\d/, "g");

  return input.reduce((acc, item) => {
    const digits = item.match(regex);
    if (!digits?.length) {
      return acc;
    }
    const value = parseInt(`${digits.at(0)}${digits.at(-1)}`, 10);
    return acc + value;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const numbersMap = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };
  const regex = new RegExp(
    `(?=(${Object.keys(numbersMap).join("|")}|\\d))`,
    "g",
  );

  return input.reduce((acc, item, row) => {
    const digitsAndNumbers = Array.from(
      item.matchAll(regex),
      ([_, num]) => num,
    );
    if (!digitsAndNumbers?.length) {
      return acc;
    }
    const digits = digitsAndNumbers.map((d) => numbersMap[d] ?? d);
    const value = parseInt(`${digits.at(0)}${digits.at(-1)}`, 10);
    return acc + value;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

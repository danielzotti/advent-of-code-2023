import run from "aocrunner";

interface RowMatches {
  row: number;
  numbers: RowMatch[];
  symbols: RowMatch[];
}

interface RowMatch {
  value: string;
  startCol: number;
  endCol: number;
}

const parseInput = (rawInput: string) => rawInput.split("\n");

const mapRowMatches = ({
  input,
  numberRegex,
  symbolRegex,
}: {
  input: string[];
  numberRegex: RegExp;
  symbolRegex: RegExp;
}) => {
  return input.reduce((arr: RowMatches[], row, rowNumber) => {
    const numberMatches = row.matchAll(numberRegex);
    const symbolMatches = row.matchAll(symbolRegex);
    const mapMatches = (match: RegExpMatchArray) => {
      const value = match[0];
      return {
        value,
        startCol: match?.index,
        endCol: (match?.index ?? 0) + value.length,
      } as RowMatch;
    };

    return [
      ...arr,
      {
        row: rowNumber,
        numbers: [...numberMatches].map(mapMatches),
        symbols: [...symbolMatches].map(mapMatches),
      },
    ];
  }, []);
};

const hasAdjacentTargetInOtherRow = (
  current: RowMatch,
  targetList: RowMatch[],
) =>
  !!targetList?.some(
    // (t) => t.startCol >= current.startCol - 1 && t.endCol <= current.endCol + 1,
    (t) => t.endCol >= current.startCol && t.startCol <= current.endCol,
  );

const hasAdjacentTargetInCurrentRow = (
  current: RowMatch,
  targetList: RowMatch[],
) =>
  !!targetList?.some(
    (t) => t.endCol === current.startCol || t.startCol === current.endCol,
  );

const getAdjacentTargetValuesInOtherRow = (
  current: RowMatch,
  targetList: RowMatch[],
) =>
  targetList
    ?.filter(
      (t) => t.endCol >= current.startCol && t.startCol <= current.endCol,
    )
    .map((t) => parseInt(t.value, 10));

const getAdjacentTargetValuesInCurrentRow = (
  current: RowMatch,
  targetList: RowMatch[],
) =>
  targetList
    ?.filter(
      (t) => t.endCol === current.startCol || t.startCol === current.endCol,
    )
    .map((t) => parseInt(t.value, 10));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput); //.slice(0, 3);
  const numberRegex = /\d+/g;
  const symbolRegex = /[^\d.\s]/g;

  const rowMatches = mapRowMatches({ input, numberRegex, symbolRegex });

  return rowMatches.reduce(
    (total, values) =>
      total +
      values.numbers.reduce((rowTotal, number) => {
        // prev row
        if (
          !!rowMatches[values.row - 1] &&
          hasAdjacentTargetInOtherRow(
            number,
            rowMatches[values.row - 1]?.symbols,
          )
        ) {
          rowTotal += parseInt(number.value, 10);
        }

        // next row
        if (
          !!rowMatches[values.row + 1] &&
          hasAdjacentTargetInOtherRow(
            number,
            rowMatches[values.row + 1]?.symbols,
          )
        ) {
          rowTotal += parseInt(number.value, 10);
        }

        // current row
        if (hasAdjacentTargetInCurrentRow(number, values.symbols)) {
          rowTotal += parseInt(number.value, 10);
        }
        return rowTotal;
      }, 0),
    0,
  );
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const numberRegex = /\d+/g;
  const symbolRegex = /\*/g;

  const rowMatches = mapRowMatches({ input, numberRegex, symbolRegex });

  return rowMatches.reduce(
    (total, values) =>
      total +
      values.symbols.reduce((rowTotal, symbol) => {
        const prevRowValues = getAdjacentTargetValuesInOtherRow(
          symbol,
          rowMatches[values.row - 1].numbers,
        );

        const currentRowValues = getAdjacentTargetValuesInCurrentRow(
          symbol,
          values.numbers,
        );
        const nextRowValues = getAdjacentTargetValuesInOtherRow(
          symbol,
          rowMatches[values.row + 1].numbers,
        );

        const numbers = [prevRowValues, currentRowValues, nextRowValues].flat();
        const hasTwoAdjacentNumbers = numbers.filter((f) => !!f).length === 2;

        return hasTwoAdjacentNumbers
          ? rowTotal + numbers.reduce((mul, item) => mul * item)
          : rowTotal;
      }, 0),
    0,
  );
};

run({
  part1: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

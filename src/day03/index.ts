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

const hasAdjacentSymbolInOtherRow = (n: RowMatch, sList: RowMatch[]) =>
  sList?.some((s) => s.startCol >= n.startCol - 1 && s.endCol <= n.endCol + 1);

const hasAdjacentSymbolInCurrentRow = (n: RowMatch, sList: RowMatch[]) =>
  sList?.some((s) => s.endCol === n.startCol || s.startCol === n.endCol);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput); //.slice(0, 3);
  const numberRegex = /\d+/g;
  const symbolRegex = /[^\d.\s]/g;

  const rowMatches = input.reduce((arr, row, rowNumber) => {
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
  }, [] as RowMatches[]);

  return rowMatches.reduce(
    (total, values) =>
      total +
      values.numbers.reduce((rowTotal, number) => {
        // prev row
        if (
          !!rowMatches[values.row - 1] &&
          hasAdjacentSymbolInOtherRow(
            number,
            rowMatches[values.row - 1]?.symbols,
          )
        ) {
          rowTotal += parseInt(number.value, 10);
        }

        // next row
        if (
          !!rowMatches[values.row + 1] &&
          hasAdjacentSymbolInOtherRow(
            number,
            rowMatches[values.row + 1]?.symbols,
          )
        ) {
          rowTotal += parseInt(number.value, 10);
        }

        // current row
        if (hasAdjacentSymbolInCurrentRow(number, values.symbols)) {
          rowTotal += parseInt(number.value, 10);
        }
        return rowTotal;
      }, 0),
    0,
  );
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
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
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

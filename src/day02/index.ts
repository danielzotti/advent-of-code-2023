import run from "aocrunner";

type ColorMap = Record<"red" | "green" | "blue", number>;

const parseInput = (rawInput: string) => rawInput.split("\n");

const mapInputs = (
  input: string[],
): { gameId: number; playMapList: ColorMap[] }[] =>
  input.map((item) => {
    const [gameText, playsText] = item.split(": ");
    const [gameWord, gameIdText] = gameText.split(" ");
    const gameId = +gameIdText;
    const plays = playsText.split("; ");
    const playMapList: ColorMap[] = plays.map((p) => {
      const sets = p.split(", ");
      return sets.reduce((obj, set) => {
        const [count, color] = set.split(" ");
        return {
          ...obj,
          [color]: +count,
        };
      }, {} as ColorMap);
    });
    return {
      gameId,
      playMapList,
    };
  });

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const maxMap = {
    red: 12,
    green: 13,
    blue: 14,
  };

  return mapInputs(input)
    .filter(({ gameId, playMapList }) => {
      const isImpossible = playMapList.some((play) =>
        Object.entries(play).some(([color, count]) => count > maxMap[color]),
      );
      return !isImpossible;
    })
    .filter((el) => !!el)
    .reduce((acc, el) => acc + el.gameId, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return mapInputs(input)
    .map(({ gameId, playMapList }) => {
      return playMapList.reduce(
        (maxObj, { red, green, blue }) => {
          return {
            red: red > maxObj["red"] ? red : maxObj["red"],
            green: green > maxObj["green"] ? green : maxObj["green"],
            blue: blue > maxObj["blue"] ? blue : maxObj["blue"],
          };
        },
        {
          red: 1,
          blue: 1,
          green: 1,
        } as ColorMap,
      );
    })
    .reduce(
      (sum: number, el: ColorMap) =>
        (sum +
          Object.values(el).reduce((acc, item) => acc * item, 1)) as number,
      0,
    );
};

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

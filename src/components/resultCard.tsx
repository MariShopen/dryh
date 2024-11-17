import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ResutlCardProps = {
  rolls: {
    discipline: number[];
    exhaustion: number[];
    madness: number[];
    pain: number[];
  };
};

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

const ResultCard = ({ rolls }: ResutlCardProps) => {
  const playerSuccesses = [
    ...rolls.discipline,
    ...rolls.exhaustion,
    ...rolls.madness,
  ].filter((die) => die <= 3).length;

  const masterSuccesses = rolls.pain.filter((die) => die <= 3).length;

  const calculateDominant = (): string => {
    const entries = Object.entries(rolls) as Entries<typeof rolls>;

    entries.sort((a, b) => {
      const [keyA, rollsA] = a;
      const [keyB, rollsB] = b;

      const maxA = Math.max(...rollsA, 0);
      const maxB = Math.max(...rollsB, 0);

      if (maxA !== maxB) return maxB - maxA;

      const countA = rollsA.filter((roll) => roll === maxA).length;
      const countB = rollsB.filter((roll) => roll === maxB).length;

      if (countA !== countB) return countB - countA;

      const sortedA = rollsA.sort((x, y) => y - x);
      const sortedB = rollsB.sort((x, y) => y - x);

      for (let i = 0; i < Math.max(sortedA.length, sortedB.length); i++) {
        if (sortedA[i] !== sortedB[i])
          return (sortedB[i] || 0) - (sortedA[i] || 0);
      }

      const hierarchy = ["discipline", "madness", "exhaustion", "pain"];
      return hierarchy.indexOf(keyA) - hierarchy.indexOf(keyB);
    });

    return entries[0][0];
  };

  const dominant = calculateDominant();

  return (
    <Card className="bg-muted">
      <CardHeader>
        <CardTitle className="text-xl">Результаты</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <div>Успехи Игрока: {playerSuccesses}</div>
          <div>Успехи Мастера: {masterSuccesses}</div>
        </div>
        <div>
          <strong>Доминанта:</strong> {dominant}
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Значения кубиков:</h4>
          {Object.entries(rolls).map(([key, rolls]) => (
            <div key={key} className="flex items-center space-x-2">
              <span className="font-medium capitalize">{key}:</span>
              <div className="flex flex-wrap gap-1">
                {(rolls as number[]).map((roll, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-semibold ${
                      roll <= 3
                        ? "bg-orange-700 text-white"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {roll}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dice1Icon as Dice } from "lucide-react";

type DiceType = "Discipline" | "Exhaustion" | "Madness" | "Pain";

interface DiceRolls {
  [key: string]: number[];
}

interface Results {
  successes: number;
  dominant: DiceType | "";
  rolls: DiceRolls;
}

export default function Component() {
  const [discipline, setDiscipline] = useState(0);
  const [exhaustion, setExhaustion] = useState(0);
  const [madness, setMadness] = useState(0);
  const [pain, setPain] = useState(0);
  const [results, setResults] = useState<Results>({
    successes: 0,
    dominant: "",
    rolls: {},
  });

  const rollDice = (count: number): number[] => {
    return Array.from(
      { length: count },
      () => Math.floor(Math.random() * 6) + 1
    );
  };

  const calculate = () => {
    const rolls: DiceRolls = {
      Discipline: rollDice(discipline),
      Exhaustion: rollDice(exhaustion),
      Madness: rollDice(madness),
      Pain: rollDice(pain),
    };

    const successes = Object.values(rolls)
      .flat()
      .filter((roll) => roll > 3).length;
    const dominantPool = Object.entries(rolls).reduce((a, b) =>
      a[1].length > b[1].length ? a : b
    )[0] as DiceType;

    setResults({ successes, dominant: dominantPool, rolls });
  };

  const diceInputs: [
    DiceType,
    number,
    React.Dispatch<React.SetStateAction<number>>
  ][] = [
    ["Discipline", discipline, setDiscipline],
    ["Exhaustion", exhaustion, setExhaustion],
    ["Madness", madness, setMadness],
    ["Pain", pain, setPain],
  ];

  return (
    <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Don't Rest Your Head - Dice Roller
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {diceInputs.map(([type, value, setter]) => (
                <div key={type} className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor={type.toLowerCase()}>{type} Dice</Label>
                  <Input
                    id={type.toLowerCase()}
                    type="number"
                    value={value}
                    onChange={(e) => setter(Math.max(0, +e.target.value))}
                    min={0}
                  />
                </div>
              ))}
            </div>
            <Card className="bg-muted">
              <CardHeader>
                <CardTitle className="text-xl">Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Successes:</strong> {results.successes}
                </p>
                <p>
                  <strong>Dominant Pool:</strong> {results.dominant}
                </p>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Dice Rolls</h4>
                  {Object.entries(results.rolls).map(([type, rolls]) => (
                    <div key={type} className="flex items-center space-x-2">
                      <span className="font-medium">{type}:</span>
                      <div className="flex flex-wrap gap-1">
                        {rolls.map((roll, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-semibold"
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
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={calculate} size="lg" className="w-full md:w-auto">
            <Dice className="mr-2 h-5 w-5" />
            Roll Dice
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

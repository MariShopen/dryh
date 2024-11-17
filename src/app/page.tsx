"use client";
import React, { useState } from "react";
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

const DiceRollCalculator = () => {
  const [discipline, setDiscipline] = useState(0);
  const [madness, setMadness] = useState(0);
  const [exhaustion, setExhaustion] = useState(0);
  const [pain, setPain] = useState(0);
  const [results, setResults] = useState({ successes: 0, dominant: "" });
  const [intermediateResults, setIntermediateResults] = useState({});

  const rollDice = (numDice: number) =>
    Array.from({ length: numDice }, () => Math.ceil(Math.random() * 6)).sort(
      (a, b) => b - a
    );

  const calculateDominant = (allRolls: { [key: string]: number[] }) => {
    const entries = Object.entries(allRolls);

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

  const calculate = () => {
    const disciplineRolls = rollDice(discipline);
    const madnessRolls = rollDice(madness);
    const exhaustionRolls = rollDice(exhaustion);
    const painRolls = rollDice(pain);

    const allRolls = {
      discipline: disciplineRolls,
      madness: madnessRolls,
      exhaustion: exhaustionRolls,
      pain: painRolls,
    };

    setIntermediateResults(allRolls);

    const successes = Object.values(allRolls)
      .flat()
      .filter((die) => die <= 3).length;

    const dominant = calculateDominant(allRolls);

    setResults({ successes, dominant });
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Don&apos;t Rest Your Head - Dice Roller
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                {
                  label: "Дисциплина",
                  value: discipline,
                  setter: setDiscipline,
                },
                { label: "Безумие", value: madness, setter: setMadness },
                {
                  label: "Истощение",
                  value: exhaustion,
                  setter: setExhaustion,
                },
                { label: "Боль", value: pain, setter: setPain },
              ].map(({ label, value, setter }) => (
                <div
                  key={label}
                  className="grid grid-cols-2 items-center gap-4"
                >
                  <Label htmlFor={label.toLowerCase().replace(" ", "-")}>
                    {label}
                  </Label>
                  <Input
                    id={label.toLowerCase().replace(" ", "-")}
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
                <CardTitle className="text-xl">Результаты</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Успехи:</strong> {results.successes}
                </p>
                <p>
                  <strong>Доминанта:</strong> {results.dominant}
                </p>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Значения кубиков:</h4>
                  {Object.entries(intermediateResults).map(([key, rolls]) => (
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
};

export default DiceRollCalculator;

"use client";
import React, { useEffect, useState } from "react";
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
import ResultCard from "@/components/resultCard";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

interface IMsgDataTypes {
  discipline: number[];
  exhaustion: number[];
  madness: number[];
  pain: number[];
}

const DiceRollCalculator = () => {
  const [discipline, setDiscipline] = useState<number>(0);
  const [exhaustion, setExhaustion] = useState<number>(0);
  const [madness, setMadness] = useState<number>(0);
  const [pain, setPain] = useState<number>(0);

  const [chat, setChat] = useState<IMsgDataTypes[]>([]);

  useEffect(() => {
    socket.on("receive_msg", (data: IMsgDataTypes) => {
      setChat((pre) => [...pre, data]);
    });

    return () => {
      socket.off("receive_msg");
    };
  }, []);

  const rollDice = (numDice: number) =>
    Array.from({ length: numDice }, () => Math.ceil(Math.random() * 6)).sort(
      (a, b) => b - a
    );

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

    socket.emit("send_msg", allRolls);
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex items-top justify-center">
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
              ].map(({ label, setter }) => (
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
                    onChange={(e) => setter(Math.max(0, +e.target.value))}
                  />
                </div>
              ))}
              <div className="flex justify-center">
                <Button
                  onClick={calculate}
                  size="lg"
                  className="w-full md:w-auto mt-6"
                >
                  <Dice className="mr-2 h-5 w-5" />
                  Roll Dice
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {chat
                .slice()
                .reverse()
                .map((rolls, i) => (
                  <ResultCard key={i} rolls={rolls} />
                ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center"></CardFooter>
      </Card>
    </div>
  );
};

export default DiceRollCalculator;

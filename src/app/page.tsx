"use client";
import React, { useState } from "react";

const DiceRollCalculator = () => {
  const [discipline, setDiscipline] = useState(0);
  const [exhaustion, setExhaustion] = useState(0);
  const [madness, setMadness] = useState(0);
  const [pain, setPain] = useState(0);
  const [results, setResults] = useState({ successes: 0, dominant: "" });
  const [intermediateResults, setIntermediateResults] = useState({});

  const rollDice = (numDice: any) =>
    Array.from({ length: numDice }, () => Math.ceil(Math.random() * 6));

  const calculate = () => {
    const disciplineRolls = rollDice(discipline);
    const exhaustionRolls = rollDice(exhaustion);
    const madnessRolls = rollDice(madness);
    const painRolls = rollDice(pain);

    const allRolls = {
      discipline: disciplineRolls,
      exhaustion: exhaustionRolls,
      madness: madnessRolls,
      pain: painRolls,
    };

    setIntermediateResults(allRolls);

    const successes = Object.values(allRolls)
      .flat()
      .filter((die) => die <= 3).length;

    const strengths = Object.entries(allRolls).map(([key, rolls]) => ({
      type: key,
      max: Math.max(...rolls, 0),
    }));

    strengths.sort((a, b) => b.max - a.max);
    const dominant = strengths[0].type;

    setResults({ successes, dominant });
  };

  return (
    <div>
      <h1>Don't Rest Your Head - Dice Roller</h1>
      <div>
        <label>
          Discipline Dice:
          <input
            type="number"
            value={discipline}
            onChange={(e) => setDiscipline(+e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Exhaustion Dice:
          <input
            type="number"
            value={exhaustion}
            onChange={(e) => setExhaustion(+e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Madness Dice:
          <input
            type="number"
            value={madness}
            onChange={(e) => setMadness(+e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Pain Dice:
          <input
            type="number"
            value={pain}
            onChange={(e) => setPain(+e.target.value)}
          />
        </label>
      </div>
      <button onClick={calculate}>Roll Dice</button>
      <h2>Results</h2>
      <p>Successes: {results.successes}</p>
      <p>Dominant Pool: {results.dominant}</p>
      <h2>Intermediate Results</h2>
      <div>
        {Object.entries<number[]>(intermediateResults).map(([key, rolls]) => (
          <div key={key}>
            <strong>{key} Rolls:</strong> {rolls.join(", ")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiceRollCalculator;

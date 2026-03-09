import { Advantage, roll } from "d20attack.js";
import NumberSpinner from "../../../components/NumberSpinner";
import { useCallback, useState } from "react";
import { LabeledCheckbox } from "../../../components/Checkbox";
import { BarChart } from "../../../components/BarChart";
import { Button, FormLabel, TextField } from "@mui/material";

interface MonkBattleMaster {
  attacks: number;
  hit: number;
  dexDC: number;
  wisDC: number;
}

interface Target {
  ac: number;
  saves: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  immunities: {
    poisoned: boolean;
    prone: boolean;
    grappled: boolean;
    stunned: boolean;
    frightened: boolean;
    disarmed: boolean;
  };
}

function SaveSpinner(props: { label?: string; value: number; onChange: (value: number) => void }) {
  return <NumberSpinner min={-15} max={15} default={0} {...props} symbol />;
}

function simulateMonkBattleMaster(monk: MonkBattleMaster, target: Target) {
  let prone = false;
  let grappled = false;
  let stunned = false;
  let frightened = false;
  let disarmed = false;
  let poisoned = false;

  let superiorityDice = 4;
  let stunAttempted = false;
  let nextAttackAdvantage = false;

  for (let _ = 0; _ < monk.attacks; _++) {
    // Check if we hit
    const advantage =
      prone || grappled || stunned || nextAttackAdvantage ? Advantage.Advantage : Advantage.Normal;
    nextAttackAdvantage = false;
    const result = roll(`1d20`, advantage);
    if (result !== 20 && result + monk.hit < target.ac) {
      continue;
    }

    // At this point, a hit is confirmed
    // First, apply hill's tumble. This is guaranteed to happen
    if (!target.immunities.prone) {
      prone = true;
    }

    // Second, apply hand of harm for poisoned. This is guaranteed to happen
    if (!target.immunities.poisoned) {
      poisoned = true;
    }

    // If the stun attempt hasn't been done yet, try to stun
    if (!stunAttempted) {
      stunAttempted = true;
      // Constitution saving throw, against wisdom dc
      if (roll("1d20") + target.saves.con < monk.wisDC) {
        if (!target.immunities.stunned) {
          stunned = true;
        }
      } else {
        nextAttackAdvantage = true;
      }
    }

    // Use a combat maneuver, if available
    if (superiorityDice > 0) {
      superiorityDice--;
      // Attempt to frighten first
      if (!frightened && !target.immunities.frightened) {
        // Wisdom saving throw, against dexterity dc
        if (roll("1d20") + target.saves.wis < monk.dexDC) {
          frightened = true;
        }
      }
      // If already frightened (or immune), attempt to disarm
      else if (!disarmed && !target.immunities.disarmed) {
        // If target is stunned, they automatically fail
        if (stunned) {
          disarmed = true;
        } else {
          // Strength saving throw, against dexterity dc
          if (roll(`1d20+${target.saves.str}`) < monk.dexDC) {
            disarmed = true;
          }
        }
      }
    }

    // Finally, attempt to grapple the creature. All unarmed strike attempts will
    // be grapple attempts, and the first grapple attempt will always deal damage
    // in order to trigger poisoned and prone.
    if (!target.immunities.grappled) {
      // If stunned, both strength and dexterity saves fail and the target is grappled
      if (stunned) {
        grappled = true;
      } else {
        // Strength or dexterity saving throw, against dexterity dc
        const saveMod = Math.max(target.saves.str, target.saves.dex);
        if (roll("1d20") + saveMod < monk.dexDC) {
          grappled = true;
        }
      }
    }
  }

  return { poisoned, prone, grappled, stunned, frightened, disarmed };
}

function MonkBattleMasterGraph(props: { monk: MonkBattleMaster; target: Target }) {
  const [name, setName] = useState("");
  const [simulations, setSimulations] = useState(100_000);
  const [entries, setEntries] = useState<[string, number][]>([]);

  const simulate = useCallback(() => {
    let prone = 0;
    let stunned = 0;
    let poisoned = 0;
    let grappled = 0;
    let disarmed = 0;
    let frightened = 0;

    for (let i = 0; i < simulations; i++) {
      const simulation = simulateMonkBattleMaster(props.monk, props.target);
      if (simulation.prone) prone++;
      if (simulation.stunned) stunned++;
      if (simulation.poisoned) poisoned++;
      if (simulation.grappled) grappled++;
      if (simulation.disarmed) disarmed++;
      if (simulation.frightened) frightened++;
    }

    setEntries([
      ["Poisoned", poisoned / simulations],
      ["Prone", prone / simulations],
      ["Stunned", stunned / simulations],
      ["Frightened", frightened / simulations],
      ["Grappled", grappled / simulations],
      ["Disarmed", disarmed / simulations],
    ]);
  }, [simulations, setEntries, props]);

  const title = `Level 9 monk battle master vs. ${name} (${simulations.toLocaleString("de-DE")} simulations)`;
  const xtitle = "Condition";
  const ytitle = "Chance to inflict";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <NumberSpinner
          label={"Simulations"}
          min={1}
          max={1_000_000}
          value={simulations}
          default={100_000}
          onChange={setSimulations}
        />
        <TextField
          value={name}
          onChange={(evt) => setName(evt.target.value)}
          size="small"
          placeholder="Name..."
        />
        <Button onClick={simulate} variant="contained">
          Simulate
        </Button>
      </div>
      <br />
      <BarChart title={title} xtitle={xtitle} ytitle={ytitle} entries={entries} maxy={1.0} />
    </div>
  );
}

export function Blog_2026_ConditionBuilds() {
  // Player stats
  const [attacks, setAttacks] = useState(4);
  const [hit, setHit] = useState(+8);
  const [dexDC, setDexDC] = useState(16);
  const [wisDC, setWisDC] = useState(14);

  // Target stats
  const [str, setSTR] = useState(0);
  const [dex, setDEX] = useState(0);
  const [con, setCON] = useState(0);
  const [int, setINT] = useState(0);
  const [wis, setWIS] = useState(0);
  const [cha, setCHA] = useState(0);
  const [ac, setAC] = useState(10);

  // Immunities
  const [immuneToPoisoned, setImmuneToPoisoned] = useState(false);
  const [immuneToGrappled, setImmuneToGrappled] = useState(false);
  const [immuneToStunned, setImmuneToStunned] = useState(false);
  const [immuneToFrightened, setImmuneToFrightened] = useState(false);
  const [immuneToDisarmed, setImmuneToDisarmed] = useState(false);
  const [immuneToProne, setImmuneToProne] = useState(false);

  const target: Target = {
    ac,
    saves: {
      str,
      dex,
      con,
      int,
      wis,
      cha,
    },
    immunities: {
      poisoned: immuneToPoisoned,
      prone: immuneToProne,
      grappled: immuneToGrappled,
      stunned: immuneToStunned,
      frightened: immuneToFrightened,
      disarmed: immuneToDisarmed,
    },
  };

  const monk: MonkBattleMaster = {
    attacks,
    hit,
    dexDC,
    wisDC,
  };

  return (
    <div style={{ maxWidth: "1200px", textAlign: "justify" }}>
      <title>Conditions</title>
      {/* Player configuration */}
      <h2>Configuration</h2>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-start" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto",
            rowGap: "4px",
            columnGap: "16px",
            alignItems: "center",
          }}
        >
          <h2 style={{ gridColumn: 2 }}>Player</h2>
          <FormLabel>Attacks</FormLabel>
          <NumberSpinner min={1} max={5} default={2} value={attacks} onChange={setAttacks} />
          <FormLabel>Hit</FormLabel>
          <NumberSpinner min={0} max={15} default={8} value={hit} onChange={setHit} symbol />
          <FormLabel>Dexterity DC</FormLabel>
          <NumberSpinner min={8} max={30} default={16} value={dexDC} onChange={setDexDC} />
          <FormLabel>Wisdom DC</FormLabel>
          <NumberSpinner min={8} max={30} default={14} value={wisDC} onChange={setWisDC} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto",
            rowGap: "4px",
            columnGap: "16px",
            alignItems: "center",
          }}
        >
          <h2 style={{ gridColumn: 2 }}>Target</h2>
          <FormLabel>Armor class</FormLabel>
          <NumberSpinner min={10} max={30} default={10} value={ac} onChange={setAC} />
          <FormLabel>Strength</FormLabel>
          <SaveSpinner value={str} onChange={setSTR} />
          <FormLabel>Dexterity</FormLabel>
          <SaveSpinner value={dex} onChange={setDEX} />
          <FormLabel>Constitution</FormLabel>
          <SaveSpinner value={con} onChange={setCON} />
          <FormLabel>Intelligence</FormLabel>
          <SaveSpinner value={int} onChange={setINT} />
          <FormLabel>Wisdom</FormLabel>
          <SaveSpinner value={wis} onChange={setWIS} />
          <FormLabel>Charisma</FormLabel>
          <SaveSpinner value={cha} onChange={setCHA} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2 style={{ gridColumn: 2 }}>Immunities</h2>
          <LabeledCheckbox
            value={immuneToPoisoned}
            onChange={setImmuneToPoisoned}
            label="Immune to poison"
          />
          <LabeledCheckbox
            value={immuneToGrappled}
            onChange={setImmuneToGrappled}
            label="Immune to grappled"
          />
          <LabeledCheckbox
            value={immuneToStunned}
            onChange={setImmuneToStunned}
            label="Immune to stunned"
          />
          <LabeledCheckbox
            value={immuneToFrightened}
            onChange={setImmuneToFrightened}
            label="Immune to frightened"
          />
          <LabeledCheckbox
            value={immuneToDisarmed}
            onChange={setImmuneToDisarmed}
            label="Immune to disarmed"
          />
          <LabeledCheckbox
            value={immuneToProne}
            onChange={setImmuneToProne}
            label="Immune to prone"
          />
        </div>
      </div>
      <br />
      <div style={{ display: "block", width: "1150px" }}>
        <MonkBattleMasterGraph monk={monk} target={target} />
      </div>
    </div>
  );
}

import { useState, type JSX } from "react";
import {
  Advantage,
  Attack,
  BaseTarget,
  Damage,
  DamageType,
  Proficiency,
  Spells,
  Target,
} from "d20attack.js";
import { LineChart } from "../../../components/LineChart";
import {
  Card,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import NumberSpinner from "../../../components/NumberSpinner";
import {
  BaselineAttackChart,
  TargetAttackChart,
} from "../../../components/AttackChart";
import { Link } from "react-router";
import { applyAdvantageToHitChance } from "../../../calc/hit";
import { Collapsable } from "../../../components/Collapsable";

// Pre-calculated data, to make lookup easier
const Data = {
  SneakAttack: [
    0, // Level 0
    1, // Level 1
    1, // Level 2
    2, // Level 3
    2, // Level 4
    3, // Level 5
    3, // Level 6
    4, // Level 7
    4, // Level 8
    5, // Level 9
    5, // Level 10
    6, // Level 11
    6, // Level 12
    7, // Level 13
    7, // Level 14
    8, // Level 15
    8, // Level 16
    9, // Level 17
    9, // Level 18
    10, // Level 19
    10, // Level 20
  ],
  TrueStrike: [
    0, // Level 0
    0, // Level 1
    0, // Level 2
    0, // Level 3
    0, // Level 4
    1, // Level 5
    1, // Level 6
    1, // Level 7
    1, // Level 8
    1, // Level 9
    1, // Level 10
    2, // Level 11
    2, // Level 12
    2, // Level 13
    2, // Level 14
    2, // Level 15
    2, // Level 16
    3, // Level 17
    3, // Level 18
    3, // Level 19
    3, // Level 20
  ],
  AbilityScore: [
    3, // Level 0, 0 feats
    3, // Level 1, 0 feats
    3, // Level 2, 0 feats
    3, // Level 3, 0 feats
    4, // Level 4, 1 feat
    4, // Level 5, 1 feat
    4, // Level 6, 1 feat
    4, // Level 7, 1 feat
    5, // Level 8, 2 feats
    5, // Level 9, 2 feats
    5, // Level 10, 2 feats
    5, // Level 11, 2 feats
    5, // Level 12, _ feats
    5, // Level 13, _ feats
    5, // Level 14, _ feats
    5, // Level 15, _ feats
    5, // Level 16, _ feats
    5, // Level 17, _ feats
    5, // Level 18, _ feats
    5, // Level 19, _ feats
    5, // Level 20, _ feats
  ],
  SorceryPoints: function (spellLevel: number): number {
    if (spellLevel < 1) return 0;
    if (spellLevel > 9) return 9;
    return spellLevel;
  },
  AdvantageName: function (advantage: Advantage): string {
    switch (advantage) {
      case Advantage.Normal:
        return "no advantage";
      case Advantage.Advantage:
        return "advantage";
      case Advantage.Disadvantage:
        return "disadvantage";
      case Advantage.ElvenAccuracy:
        return "elven accuracy advantage";
    }
  },
};

interface TrueStrikeRogueProgression {
  level: number;
  class: string;
  notes: string | undefined;
  // Damage numbers
  hit: number;
  weapon: string;
  abilityScore: number;
  sneakAttack: number;
  trueStrike: number;
  advantage: Advantage;
  // Raw hit chance numbers, in percent. Note, hitPercent should NOT include critPercent
  hitPercent: number;
  critPercent: number;
}

abstract class TrueStrikeRogue {
  public abstract readonly name: string;
  public abstract readonly description: string;

  public abstract progression(level: number): TrueStrikeRogueProgression;
  public abstract rogueLevel(level: number): number;
  public abstract sorcererLevel(level: number): number;

  public advantage(level: number): Advantage {
    return this.progression(level).advantage;
  }

  public sorceryPoints(level: number): number {
    const rogueLevel = this.rogueLevel(level);
    const sorcererLevel = this.sorcererLevel(level);
    const casterLevel = Math.floor(rogueLevel / 3) + sorcererLevel;
    const slots = Spells.slots(casterLevel);

    let points = sorcererLevel;
    for (const [slot, amount] of slots.entries())
      points += Data.SorceryPoints(slot) * amount;

    return points;
  }

  public attack(level: number): Attack {
    const progression = this.progression(level);

    const weapon = `${progression.weapon} + ${progression.abilityScore}`;
    const sneakAttack = `${progression.sneakAttack}d6`;
    const trueStrike = `${progression.trueStrike}d6`;

    return new Attack({
      hit: progression.hit,
      damages: [
        new Damage(weapon, DamageType.Piercing),
        new Damage(sneakAttack, DamageType.Piercing),
        new Damage(trueStrike, DamageType.Radiant),
      ],
    });
  }

  protected baselineMeanDamage(level: number): number {
    const progression = this.progression(level);
    const attack = this.attack(level);

    const { hit, crit, miss } = applyAdvantageToHitChance(
      progression.advantage,
      1 - progression.hitPercent - progression.critPercent,
      progression.hitPercent,
      progression.critPercent,
    );

    const missDamage = attack.missDamages
      .map((damage) => damage.distribution().mean())
      .reduce((a, b) => a + b, 0);
    const hitDamage = attack.damages
      .map((damage) => damage.distribution().mean())
      .reduce((a, b) => a + b, 0);
    const critDamage = attack.critDamages
      .map((damage) => damage.distribution().mean())
      .reduce((a, b) => a + b, 0);

    return missDamage * miss + hitDamage * hit + critDamage * crit;
  }

  public baselineLineChart(): JSX.Element {
    const title = `Damage of a single attack of ${this.name.toLocaleLowerCase()} with a base 65% hit chance, with a source of advantage`;
    const entries: [number, number][] = [];

    for (let level = 1; level <= 20; level++) {
      const damage = this.baselineMeanDamage(level);
      entries.push([level, damage]);
    }

    return LineChart({
      title,
      entries,
      xtitle: "Level",
      ytitle: "Average damage per attack",
    });
  }

  public baselineAttackChart(level: number): JSX.Element {
    const title = `Breakdown of a single attack of a level ${level} ${this.name.toLocaleLowerCase()} with a base 65% hit chance, with a source of advantage`;
    const attack = this.attack(level);
    const advantage = this.advantage(level);
    const progression = this.progression(level);

    return BaselineAttackChart({
      title,
      attack,
      advantage,
      baseHitChance: progression.hitPercent,
      baseCritChance: progression.critPercent,
    });
  }

  public targetLineChart(target: Target): JSX.Element {
    const title = `Damage of a single attack of ${this.name.toLocaleLowerCase()} vs. AC ${target.ac}, with a source of advantage`;
    const entries: [number, number][] = [];

    for (let level = 1; level <= 20; level++) {
      const advantage = this.advantage(level);
      const attack = this.attack(level).mean(target, advantage);
      entries.push([level, attack.mean]);
    }

    return LineChart({
      title,
      entries,
      xtitle: "Level",
      ytitle: "Average damage per attack",
    });
  }

  public attackChart(level: number, target: Target): JSX.Element {
    const title = `Breakdown of a single attack of a level ${level} ${this.name.toLocaleLowerCase()} vs. AC ${target.ac}, with a source of advantage`;
    const attack = this.attack(level);
    const advantage = this.advantage(level);

    return TargetAttackChart({ title, attack, advantage, target });
  }

  public progressionTable(): JSX.Element {
    const rows = [];

    for (let level = 1; level <= 20; level++) {
      const progression = this.progression(level);
      const advantages: Partial<Record<Advantage, string>> = {};
      advantages[Advantage.Normal] = "Normal";
      advantages[Advantage.Advantage] = "Advantage";
      advantages[Advantage.Disadvantage] = "Disadvantage";
      advantages[Advantage.ElvenAccuracy] = "Elven Accuracy";

      rows.push(
        <TableRow key={`progression-level-${level}`}>
          <TableCell align="center">{progression.level}</TableCell>
          <TableCell align="center">{progression.class}</TableCell>
          <TableCell align="center">+{progression.hit}</TableCell>
          <TableCell align="center">
            {progression.weapon}+{progression.abilityScore}
          </TableCell>
          <TableCell align="center">{progression.sneakAttack}d6</TableCell>
          <TableCell align="center">{progression.trueStrike}d6</TableCell>
          <TableCell align="center">
            {advantages[progression.advantage]}
          </TableCell>
          <TableCell>{progression.notes}</TableCell>
        </TableRow>,
      );
    }

    return (
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Level</TableCell>
              <TableCell align="center">Class</TableCell>
              <TableCell align="center">Hit</TableCell>
              <TableCell align="center">Weapon</TableCell>
              <TableCell align="center">Sneak Attack</TableCell>
              <TableCell align="center">True Strike</TableCell>
              <TableCell align="center">Advantage</TableCell>
              <TableCell align="center">Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
    );
  }

  public sorceryPointsChart(): JSX.Element {
    const title = `${this.name} sorcery points per long rest`;
    const entries: [number, number][] = [];

    for (let level = 1; level <= 20; level++) {
      const points = this.sorceryPoints(level);
      entries.push([level, points]);
    }

    return LineChart({
      title,
      entries,
      xtitle: "Level",
      ytitle: "Maximum sorcery points",
    });
  }

  public quickenedCastChart(): JSX.Element {
    const title = `${this.name} number of quickened casts per long rest`;
    const entries: [number, number][] = [];

    for (let level = 1; level <= 20; level++) {
      const points = this.sorceryPoints(level);
      entries.push([level, Math.floor(points / 2)]);
    }

    return LineChart({
      title,
      entries,
      xtitle: "Level",
      ytitle: "Quickened cast count",
    });
  }
}

class BaseTrueStrikeRogue extends TrueStrikeRogue {
  public readonly name: string = "Base true strike rogue";
  public readonly description: string =
    "The base true strike build, with two levels in sorcerer and the remaining levels into arcane trickster rogue.";

  public sorcererLevel(level: number): number {
    return Math.min(level, 2);
  }

  public rogueLevel(level: number): number {
    return Math.max(level - 2, 0);
  }

  public progression(level: number): TrueStrikeRogueProgression {
    const rogueLevel = this.rogueLevel(level);
    const proficiency = Proficiency.get(level);
    const abilityScore = Data.AbilityScore[rogueLevel];

    const className = level <= 2 ? "Sorcerer" : "Rogue";
    const hit = proficiency + abilityScore;
    const weapon = "1d6"; // Short bow
    const sneakAttack = Data.SneakAttack[rogueLevel];
    const trueStrike = Data.TrueStrike[level];
    const advantage = Advantage.Advantage;

    // Total hit chance of 0.65
    const hitPercent = 0.6;
    const critPercent = 0.05;

    let notes = "";

    if (level === 1) notes = "Innate sorcery";
    if (level === 2) notes = "Quickened spell";
    if (level === 5) notes = "Arcane Trickster subclass";
    if (level === 6) notes = "Ability Score Improvement";
    if (level === 10) notes = "Ability Score Improvement";

    return {
      level,
      class: className,
      hit,
      weapon,
      abilityScore,
      sneakAttack,
      trueStrike,
      advantage,
      notes,
      hitPercent,
      critPercent,
    };
  }
}

class ElvenAccuracyTrueStrikeRogue extends BaseTrueStrikeRogue {
  public readonly name = "Elven accuracy variant";
  public readonly description =
    "An optimization of the base build, where elven accuracy is taken at level six.";

  public progression(level: number): TrueStrikeRogueProgression {
    const progression = super.progression(level);
    if (level == 6) progression.notes = "Elven Accuracy feat";
    if (level >= 6) progression.advantage = Advantage.ElvenAccuracy;

    return progression;
  }
}

class FighterDipTrueStrikeRogue extends TrueStrikeRogue {
  public readonly name: string = "Fighter dip variant";
  public readonly description: string =
    "An optimization of the base build, a fighter dip is taken at level three for longbow (or heavy crossbow) proficiency, medium armor proficiency, and the archery fighting style.";

  public sorcererLevel(level: number): number {
    return Math.min(level, 2);
  }

  public rogueLevel(level: number): number {
    return Math.max(level - 3, 0);
  }

  public progression(level: number): TrueStrikeRogueProgression {
    const rogueLevel = this.rogueLevel(level);
    const proficiency = Proficiency.get(level);
    const abilityScore = Data.AbilityScore[rogueLevel];

    const className =
      level <= 2 ? "Sorcerer" : level === 3 ? "Fighter" : "Rogue";

    let hit = proficiency + abilityScore;
    let weapon = "1d6"; // Short bow

    // Total hit chance of 0.65
    let hitPercent = 0.6;
    const critPercent = 0.05;

    if (level >= 3) {
      weapon = "1d8"; // Longbow
      // The archery fighting style gives a +2, which raises the hit chance from 65% to 75% for
      // the baselines
      hit += 2;
      hitPercent += 0.1;
    }

    const sneakAttack = Data.SneakAttack[rogueLevel];
    const trueStrike = Data.TrueStrike[level];
    const advantage = Advantage.Advantage;

    let notes = "";

    if (level === 1) notes = "Innate sorcery";
    if (level === 2) notes = "Quickened spell";
    if (level === 3) notes = "Archery fighting style, longbow proficiency";
    if (level === 6) notes = "Arcane Trickster subclass";
    if (level === 7) notes = "Ability Score Improvement";
    if (level === 11) notes = "Ability Score Improvement";

    return {
      level,
      class: className,
      hit,
      weapon,
      abilityScore,
      sneakAttack,
      trueStrike,
      advantage,
      notes,
      hitPercent,
      critPercent,
    };
  }
}

class ElvenAccuracyFighterDipTrueStrikeRogue extends FighterDipTrueStrikeRogue {
  public readonly name = "Elven accuracy and fighter dip variant";
  public readonly description =
    "A combination of the elven accuracy feat and the fighter dip.";

  public progression(level: number): TrueStrikeRogueProgression {
    const progression = super.progression(level);

    if (level == 7) progression.notes = "Elven Accuracy feat";
    if (level >= 7) progression.advantage = Advantage.ElvenAccuracy;

    return progression;
  }
}

export function Blog_2026_TrueStrikeRogue() {
  const [builds] = useState([
    new BaseTrueStrikeRogue(),
    new ElvenAccuracyTrueStrikeRogue(),
    new FighterDipTrueStrikeRogue(),
    new ElvenAccuracyFighterDipTrueStrikeRogue(),
  ]);
  const [selected, setSelected] = useState(builds[0].name);
  const [ac, setAC] = useState(10);
  const [level, setLevel] = useState(3);

  const build = builds.find((build) => build.name === selected)!;
  const target = new BaseTarget(ac);

  return (
    <div style={{ maxWidth: "1200px", textAlign: "justify" }}>
      <div>
        <h1>True Strike Rogue - Graphs</h1>
        <p>
          This page contains the graphs and calculations used for the true
          strike rogue article I wrote. Four separate builds are analyzed:
        </p>
        <ul>
          <li>
            The base true strike rogue build, with two levels into sorcerer and
            the rest into rogue.
          </li>
          <li>
            The base build, but with the elven accuracy feat taken at character
            level six.
          </li>
          <li>
            The base build, but with a fighter dip at character level three for
            the archery fighting style and longbow proficiency.
          </li>
          <li>
            The base build, but with both a fighter dip taken at character level
            three and elven accuracy taken at character level six.
          </li>
        </ul>
        <p>
          Several graphs are calculated for each build. The first graph shows
          the evolution of the damage per attack against a configurable armor
          class. The second graph shows the breakdown of the damage at a
          specific level, showing the miss, hit, and critical hit odds. The
          charts are made using{" "}
          <Link to={"https://www.chartjs.org/"}>Chart.js</Link>, and can be
          saved. Importantly, all graphs calculated assume that{" "}
          <b style={{ textDecoration: "underline" }}>
            a source of advantage, such as innate sorcery, is active
          </b>
          .
        </p>
        <p>
          Additionally, a progression table is shared for each build. These
          contain the values used for the calculations at each level, with some
          additional explanations. These tables show basic outlines, and can be
          optimized even further (e.g. the fighter dip taking great weapon
          master at character level 15 for even more damage with the longbow).
          These tables also assume no magic items.
        </p>
        <p>
          Finally, a chart with the amount of sorcery points is given per level.
          This chart assumes that all spell slots the rogue has will be
          converted to sorcery points.
        </p>
      </div>
      <h2>Config</h2>
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <RadioGroup
          row
          value={selected}
          onChange={(_, value) => setSelected(value)}
        >
          {builds.map((build) => (
            <FormControlLabel
              key={`radio-button-${build.name}`}
              label={build.name}
              value={build.name}
              control={<Radio />}
            />
          ))}
        </RadioGroup>
      </div>
      <br />
      <div style={{ display: "flex", justifyContent: "center", gap: "64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <FormLabel>Armor class</FormLabel>
          <NumberSpinner
            size="small"
            min={10}
            max={30}
            value={ac}
            onValueChange={(ac) => setAC(ac || 10)}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <FormLabel>Level</FormLabel>
          <NumberSpinner
            size="small"
            min={1}
            max={20}
            value={level}
            onValueChange={(level) => setLevel(level || 1)}
          />
        </div>
      </div>
      <h2>Graphs</h2>
      <p>
        As a reminder, for the graphs it is assumed that the rogue has advantage
        on all of its attacks. The sections are collapsable to make interactions
        with the input above easier.
      </p>
      <Collapsable label="Damage of a single attack assuming a base 65% hit chance.">
        <p>
          Note: for the fighter dip, the base hit chance is increased at
          character level three to 75% because of the archery fighting style.
        </p>
        <div style={{ display: "block", width: "1150px" }}>
          {build.baselineLineChart()}
        </div>
        <div style={{ display: "block", width: "1150px" }}>
          {build.baselineAttackChart(level)}
        </div>
      </Collapsable>
      <br />

      <Collapsable label="Damage of a single attack against a specific target">
        <div style={{ display: "block", width: "1150px" }}>
          {build.targetLineChart(target)}
        </div>
        <div style={{ display: "block", width: "1150px" }}>
          {build.attackChart(level, target)}
        </div>
      </Collapsable>
      <br />

      <Collapsable label="Progression table">
        <div style={{ display: "block", width: "1000px" }}>
          {build.progressionTable()}
        </div>
      </Collapsable>
      <br />

      <Collapsable label="Sorcery points">
        <div style={{ display: "block", width: "1000px" }}>
          {build.sorceryPointsChart()}
        </div>
        <div style={{ display: "block", width: "1000px" }}>
          {build.quickenedCastChart()}
        </div>
      </Collapsable>
      <br />
    </div>
  );
}

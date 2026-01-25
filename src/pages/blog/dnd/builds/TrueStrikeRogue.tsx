import { BlogPage } from "../../../../components/BlogPage";
import { AttackChart } from "../../../../components/AttackChart";
import NumberSpinner from "../../../../components/NumberSpinner";

import { useState } from "react";
import { TextField } from "@mui/material";
import {
  Advantage,
  Attack,
  BaseTarget,
  Damage,
  DamageType,
  Proficiency,
} from "d20attack.js";
import { LineChart } from "../../../../components/LineChart";
import { Link } from "react-router";

// Pre-calculated data, to improve performance
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
};

function BaseDamageChart() {
  const [level, setLevel] = useState(3);
  const [ac, setAC] = useState(14);

  const ability = Data.AbilityScore[level - 2];
  const trueStrike = Data.TrueStrike[level];
  const sneak = Data.SneakAttack[level - 2];

  const title = `True strike rogue damage per attack at level ${level} vs. AC ${ac}`;

  const damage = new Damage(
    `1d6 + ${ability} + ${sneak}d6 + ${trueStrike}d6`,
    DamageType.Piercing,
  );

  const hit = Proficiency.get(level) + ability;
  const attack = new Attack({ hit: hit, damages: [damage] });
  const target = new BaseTarget(ac);
  const advantage = Advantage.Advantage;

  return (
    <div
      style={{
        border: "solid 2px rgba(255, 255, 255, 0.2)",
        padding: "4px",
        borderRadius: "8px",
      }}
    >
      <AttackChart
        title={title}
        attack={attack}
        target={target}
        advantage={advantage}
      />
      <hr style={{ color: "rgba(255, 255, 255, 0.2)" }} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "120px auto",
          alignItems: "center",
        }}
      >
        <label>Level</label>
        <NumberSpinner
          min={3}
          max={20}
          value={level}
          onValueChange={(value) => setLevel(value ?? 3)}
          size="small"
        />
        <label>AC</label>
        <NumberSpinner
          min={10}
          max={30}
          value={ac}
          onValueChange={(value) => setAC(value ?? 10)}
          size="small"
        />
        <label>Hit</label>
        <TextField
          value={`+${hit}`}
          disabled
          size="small"
          inputProps={{
            style: { textAlign: "center" },
          }}
        />
        <label>Shortbow</label>
        <TextField
          value={`1d6+${ability}`}
          disabled
          size="small"
          inputProps={{
            style: { textAlign: "center" },
          }}
        />
        <label>True Strike</label>
        <TextField
          value={`${trueStrike}d6`}
          disabled
          size="small"
          inputProps={{
            style: { textAlign: "center" },
          }}
        />
        <label>Sneak Attack</label>
        <TextField
          value={`${sneak}d6`}
          disabled
          size="small"
          inputProps={{
            style: { textAlign: "center" },
          }}
        />
        <label>Advantage</label>
        <TextField
          value={`Advantage`}
          disabled
          size="small"
          inputProps={{
            style: { textAlign: "center" },
          }}
        />
      </div>
    </div>
  );
}

function sorceryPoints(
  level1slots: number,
  level2slots: number,
  level3slots: number,
  level4slots: number,
): number {
  return (
    2 + // two base from level two sorcerer
    level1slots * 2 +
    level2slots * 3 +
    level3slots * 5 +
    level4slots * 6
  );
}

function SorceryPointsGraph() {
  const slots: [number, number][] = [
    [3, sorceryPoints(3, 0, 0, 0)],
    [4, sorceryPoints(3, 0, 0, 0)],
    [5, sorceryPoints(4, 2, 0, 0)],
    [6, sorceryPoints(4, 2, 0, 0)],
    [7, sorceryPoints(4, 2, 0, 0)],
    [8, sorceryPoints(4, 3, 0, 0)],
    [9, sorceryPoints(4, 3, 0, 0)],
    [10, sorceryPoints(4, 3, 0, 0)],
    [11, sorceryPoints(4, 3, 2, 0)],
    [12, sorceryPoints(4, 3, 2, 0)],
    [13, sorceryPoints(4, 3, 2, 0)],
    [14, sorceryPoints(4, 3, 3, 0)],
    [15, sorceryPoints(4, 3, 3, 0)],
    [16, sorceryPoints(4, 3, 3, 0)],
    [17, sorceryPoints(4, 3, 3, 1)],
    [18, sorceryPoints(4, 3, 3, 1)],
    [19, sorceryPoints(4, 3, 3, 1)],
    [20, sorceryPoints(4, 3, 3, 2)],
  ];

  return (
    <div
      style={{
        border: "solid 2px rgba(255, 255, 255, 0.2)",
        padding: "4px",
        borderRadius: "8px",
      }}
    >
      <LineChart
        title="True Strike rogue sorcery points per level"
        entries={slots}
        xtitle="Level"
        ytitle="Sorcery points"
      />
    </div>
  );
}

export function Blog_DND_Builds_TrueStrikeRogue() {
  const uploaded = new Date(2026, 0, 25);
  const updated = new Date(2026, 0, 25);

  return (
    <BlogPage title="True Strike Rogue" uploaded={uploaded} updated={updated}>
      <p>
        In this post I wish to introduce the True Strike rogue, a
        charisma-focused rogue that attacks with the newly changed True Strike
        cantrip. The build is low-investment, and it can still serve its purpose
        as the standard rogue of the party without much issue.
      </p>
      <p>
        The goal of the build in combat is to active sneak attack multiple times
        per round. This allows the rogue to deal large amounts of damage,
        outclassing other optimized DPR-focused builds at multiple tiers of
        play. It does so by casting True Strike, once as an action and once as a
        bonus action, with advantage on different creatures' turns, activating
        the rogue's sneak damage twice per round.
      </p>
      {/* Overview */}
      <h2>Overview</h2>
      <p>
        Typically, a rogue is only able to activate its sneak attack once per
        round, namely through the one attack it performs on its own turn. It
        could trigger this sneak attack multiple times on different turns, but
        this is difficult to set-up.
      </p>
      <ul>
        <li>
          Rogues have no reliable way of attacking creatures on different turns.
          While theoretically they could provoke opportunity attacks, this would
          require them to be in melee range of an enemy and would require the
          enemy to run away from the rogue. This situation is both undesirable
          and unlikely, as rogues typically have low defenses and would deal a
          large amount of damage with said opportunity attack.
        </li>
        <li>
          Sneak attack requires either advantage or a nearby ally to stand close
          to the enemy. Rogues have the ability to gain advantage on attack
          rolls, typically through hiding or using Steady Aim, but these actions
          eat up the rogue's bonus action, only allowing them to attack once on
          their turn using the Attack action. Additionally, having a nearby ally
          is not guaranteed, though with good team communication it can be
          reliably set-up.
        </li>
      </ul>
      <p>
        A two-level dip into sorcerer fixes both of these issues, thanks to two
        new changes in the D&D 2024 edition rules:
      </p>
      <ul>
        <li>Innate Sorcery</li>
        <li>Quickened True Strike</li>
      </ul>
      <p>
        Innate Sorcery allows sorcerers to enter a magical equivalent of rage
        for one minute as a bonus action, up to two times per long rest. While
        this state is active, they gain advantage on all attack rolls made with
        sorcerer spells, including cantrips.
      </p>
      <p>
        True Strike received a major rework in the new rules. Rather than being
        a costly way of gaining advantage, it now allows the caster to make a
        weapon attack using the caster's spellcasting modifier. Cantrips that
        allowed the attacker to make a weapon attack previously existed, such as
        Booming Blade and Green-Flame Blade, but these were limited to melee
        weapon attacks and used the caster's physical abilities rather than the
        spellcasting ability. Additionally, casting True Strike counts as
        casting a cantrip rather than taking the Attack action. This allows it
        to be combined with the Quickened Spell metamagic, giving a sorcerer the
        possibility to make two attacks per turn.
      </p>
      <p>
        Combining these two new features, a sorcerer can reliably make ranged
        weapon attacks with advantage. Sorcerers themselves are unable to
        capitalize on this however, as their cantrips typically do better
        damage. Instead, a rogue would be able to benefit from these features
        more.
      </p>
      {/* How to play */}
      <h2>How to play</h2>
      <h3>In combat</h3>
      <p>
        Much like a rogue, the True Strike rogue can perform an excellent job as
        a striker, dealing large amounts of single-target damage per round. A
        distinction is made between two scenarios:
      </p>
      <ol>
        <li>The rogue does not have access to Innate Sorcery.</li>
        <li>The rogue has access to Innate Sorcery.</li>
      </ol>
      <p>
        In the first scenario, the rogue play as a normal rogue would, relying
        on either Cunning Action Hide or Steady Aim to gain advantage. In this
        case, they would play a subpar rogue, but this should suffice for weaker
        encounters.
      </p>
      <p>
        The second scenario is where the True Strike rogue shines, however.
        Here, they activate Innate Sorcery on their first turn of combat,
        allowing them to cast True Strike with advantage and dealing sneak
        attack damage. From the second round onwards, they cast True Strike as a
        bonus action using Quickened Spell.
      </p>
      <p>
        After casting True Strike as a bonus action, the rogue then{" "}
        <b>readies</b> their next attack to cast True Strike on a different
        creature's turn. Because sneak attack activates once per turn and not
        once per round, this allows the rogue to activate it's sneak damage up
        to two times per round, resulting in large amounts of damage.
      </p>
      <h3>Outside of combat</h3>
      <p>
        Outside of combat, the True Strike rogue will play as a typical rogue.
        Because charisma is the primary ability used, they can play as a party's
        face extremely well, using Expertise and Reliable Talent to gain a high
        persuasion or deception bonus.
      </p>
      <p>
        They can also still use their thieves' tools to disarm traps and break
        into buildings. This build compromises on dexterity in order to maximize
        True Strike, so these tasks will be more difficult.
      </p>
      {/* How to build */}
      <h2>How to build</h2>
      <p>
        A baseline build is proposed, and further improvements can certainly be
        made. The build requires two levels in sorcerer to gain access to the
        True Strike cantrip, Innate Sorcery, and the Quickened Spell metamagic.
        All future levels will go into rogue to increase the rogue's sneak dice.
      </p>
      <p>
        For the rogue's subclass, arcane trickster is recommended. This gives
        access to more utility cantrips, such as Minor Illusion and Mage Hand,
        and it gives access to more spell slots which can be converted into more
        sorcery points.
      </p>
      <p>
        The build has no equipment requirements, and it can work well with even
        the most basic weapons. As the rogue is very squishy, it is recommended
        to use a shortbow to attack from a safe distance. Should an enemy get up
        close, the rogue can switch over to a shortsword and deal an equivalent
        amount of damage in melee range.
      </p>
      <p>
        As this is build is very charisma heavy to activate True Strike,
        proficiency and expertise into skills such as persuasion and deception
        are recommended.
      </p>
      {/* The numbers */}
      <h2>The numbers</h2>
      <p>
        Now that the basics of the build are laid out, how does it actually
        perform? In case Innate Sorcery is not active, the rogue can only do one
        attack per round as their bonus action is dedicated to gaining
        advantage. In this case, their damage is on-par with the other baseline
        rogue builds. In case Innate Sorcery is active however, the rogue can
        use its bonus action to attack twice per turn, doubling its average
        damage and allowing it to outperform other damage focused builds.
      </p>
      <BaseDamageChart />
      <p>
        Let's take a look at an example. At level eight the rogue will deal an
        average 20.57 damage per attack against targets with an AC of 15.{" "}
        <Link
          to={
            "https://formofdread.wordpress.com/2022/02/28/which-baseline-should-i-use/"
          }
        >
          The baseline warlock and fighter builds at this level
        </Link>{" "}
        would deal 18.20 and 32.38 damage per round, respectively. If the rogue
        thus attacks a single time per round, it outdamages the warlock but not
        the fighter. In case Innate Sorcery is active, the rogue would be able
        to attack twice per round however, dealing 41.14 damage per round,
        outperforming even an optimized fighter by a significant margin.
      </p>
      <p>
        One major limiting factor is that using Quickened Spell requires sorcery
        points to activate. Especially in the early levels, spell slots are few
        and far between. As a result, attacking twice will not be available
        every round.
      </p>
      <SorceryPointsGraph />
      <p>
        Starting from level five onwards, I've personally found this to not be
        an issue. A typical combat lasts four to six rounds, and the first round
        of combat will always be used to activate Innate Sorcery. Thus, only six
        to ten rounds per long rest are actually used to use the bonus action
        attack, assuming there are no other sources of advantage, and thus the
        sixteen available sorcery points starting from level five onwards have
        been sufficient from personal experience.
      </p>
      {/* Advantages */}
      <h2>Advantages</h2>
      <p>
        The True Strike rogue is an excellent build to deal large amounts of
        burst damage in the right conditions. At multiple tiers of play, it is
        able to outperform optimized DPR baseline builds with few resources
        required. This makes it excellent for difficult encounters, such as boss
        fights.
      </p>
      <p>
        Additionally, the investment in sorcerer is very low, as only two levels
        are required. Aside from this cost, the rogue is able to perform its
        tasks almost as well as any other rogue, and in later tiers the
        difference should be negligible.
      </p>
      {/* Disadvantages */}
      <h2>Disadvantages</h2>
      <p>
        Although the build is able to deal large amounts of burst damage, this
        comes at several disadvantages.
      </p>
      <p>
        Firstly, the rogue is only able to activate Innate Sorcery twice per
        long rest. In a campaign with four to six combat encounters per long
        rest, this means they're only able to perform their role optimally for
        33% to 50% of the time. Additionally, the rogue must be careful to
        clearly state its ready conditions. If a ready condition does not
        activate, the rogue will have wasted its action for that turn. The True
        Strike rogue is able to shine very brightly in the right conditions, but
        outside of these conditions they are effectively a subpar rogue.
      </p>
      <p>
        Secondly, the rogue is weak defensively. Using the ready action requires
        the rogue to use up its reaction. This cuts it off from using defensive
        abilities, such as the Shield spell or the rogue's Uncanny Dodge. The
        rogue will also have lower dexterity at earlier levels, resulting in a
        very low armor class early on.
      </p>
      <p>
        Finally, the rogue does not have many available spell slots. Arcane
        tricksters have very few spell slots to begin with, but as these all
        need to be converted to sorcery points to activate Quickened Spell, the
        rogue will not have any remaining for utility spells such as Disguise
        Self, Charm Person, or Invisibility.
      </p>
      {/* Further improvements */}
      <h2>Further improvements</h2>
      <p>
        Further improvements can be made, depending on the availability of
        sources and multi-classing limitations. A few suggestions are made:
      </p>
      <ul>
        <li>
          Taking one more level into sorcerer allows the rogue to take the
          draconic sorcerer subclass, gaining spell slots earlier and gaining an
          increase in armor class.
        </li>
        <li>
          Taking a single level into fighter allows the rogue to gain access to
          medium armor, proficiency in longbows, and the archery fighting style.
        </li>
        <li>
          Taking the elven accuracy feat at character level six allows the rogue
          to gain an even higher hit chance while innate sorcery or steady aim
          is active.
        </li>
      </ul>
      {/* Conclusion */}
      <h2>Conclusion</h2>
      <p>
        In this post I proposed the True Strike rogue, a rogue with several
        levels into sorcerer to deal large amounts of damage per round. I have
        used this build myself in a one-shot adventure, where I was satisfied
        with the results. Clear communication with my DM was required for the
        ready action however...
      </p>
    </BlogPage>
  );
}

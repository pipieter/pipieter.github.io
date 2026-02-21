import { Advantage } from "d20attack.js";

export function applyAdvantageToHitChance(
  advantage: Advantage,
  miss: number,
  hit: number,
  crit: number,
): { hit: number; crit: number; miss: number } {
  console.log(Math.abs(miss + hit + crit) < 1e-6);

  switch (advantage) {
    case Advantage.Normal: {
      return { hit, crit, miss };
    }

    case Advantage.Advantage: {
      crit = 1 - Math.pow(1 - crit, 2);
      miss = Math.pow(miss, 2);
      hit = 1 - crit - miss;
      return { hit, crit, miss };
    }

    case Advantage.Disadvantage: {
      crit = Math.pow(crit, 2);
      miss = 1 - Math.pow(1 - miss, 2);
      hit = 1 - crit - miss;
      return { hit, crit, miss };
    }

    case Advantage.ElvenAccuracy: {
      crit = 1 - Math.pow(1 - crit, 3);
      miss = Math.pow(miss, 3);
      hit = 1 - crit - miss;
      return { hit, crit, miss };
    }
  }
}

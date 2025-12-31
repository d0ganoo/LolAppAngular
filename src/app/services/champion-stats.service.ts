import { Injectable } from '@angular/core';

type ChampStats = Record<string, number>;

@Injectable({ providedIn: 'root' })
export class ChampionStatsService {
  statsAtLevel(base: ChampStats, level: number) {
    const L = Math.min(18, Math.max(1, level));
    const add = (kBase: string, kPer: string) =>
      (base[kBase] ?? 0) + (L - 1) * (base[kPer] ?? 0);

    return {
      hp: add('hp', 'hpperlevel'),
      mp: add('mp', 'mpperlevel'),
      armor: add('armor', 'armorperlevel'),
      spellblock: add('spellblock', 'spellblockperlevel'),
      attackdamage: add('attackdamage', 'attackdamageperlevel'),
      attackspeed: (base['attackspeed'] ?? 0) * (1 + (L - 1) * ((base['attackspeedperlevel'] ?? 0) / 100)),
    };
  }

  applyFlatBonuses(stats: ChampStats, flat: Partial<ChampStats>) {
    const out = { ...stats };
    for (const [k, v] of Object.entries(flat)) out[k] = (out[k] ?? 0) + (v ?? 0);
    return out;
  }
}

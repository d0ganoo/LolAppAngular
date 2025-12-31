import { Component, computed, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { DdragonService } from '../../services/ddragon.service';
import { ChampionStatsService } from '../../services/champion-stats.service';
import { DdChampion, DdItem, DdChampionDetail, ShopFilter, Classified } from './champions-stats-viewer.types';
import { EXCLUDE_ITEM_IDS, FORCE_LEGENDARY_IDS, FORCE_BOOTS, WARDSTONE_EPIC_IDS, EMPTY_CLASSIFIED } from './champions-stats-viewer.constants';

@Component({
  selector: 'app-champions-versus',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './champions-stats-viewer.html',
  styleUrls: ['./champions-stats-viewer.css'],
})

export class ChampionsStatsViewer {
  selectedChampionId = signal('Aatrox');
  level = signal(1);

  itemSearch = signal('');
  shopFilter = signal<ShopFilter>('all');
  selectedItemIds = signal<string[]>([]);

  latestVersion!: ReturnType<typeof toSignal<string>>;
  champions!: ReturnType<typeof toSignal<any[]>>;
  itemsMap!: ReturnType<typeof toSignal<Record<string, DdItem>>>;
  championDetail!: ReturnType<typeof toSignal<DdChampionDetail | null>>;

  constructor(private ddragon: DdragonService, private stats: ChampionStatsService) {
    this.latestVersion = toSignal(this.ddragon.latestVersion$, { initialValue: '' });
    this.champions = toSignal(this.ddragon.champions$, { initialValue: [] as any[] });
    this.itemsMap = toSignal(this.ddragon.items$, {
      initialValue: {} as Record<string, DdItem>,
    });

    this.championDetail = toSignal(
      toObservable(this.selectedChampionId).pipe(
        switchMap((id: string) => this.ddragon.championDetail$(id))
      ),
      { initialValue: null as DdChampionDetail | null }
    );
  }

  setChampionId(v: unknown) { this.selectedChampionId.set(String(v)); }
  setItemSearch(v: unknown) { this.itemSearch.set(String(v)); }
  setLevel(v: unknown) {
    const n = Number(v);
    this.level.set(Number.isFinite(n) ? Math.min(18, Math.max(1, n)) : 1);
  }
  setShopFilter(v: ShopFilter) { this.shopFilter.set(v); }

  trackById(_i: number, x: any) { return x?.id ?? _i; }
  trackByStr(_i: number, x: string) { return x; }

  championList = computed((): DdChampion[] =>
    (this.champions() ?? [])
      .map((c: any) => ({ id: c.id, name: c.name, title: c.title }))
      .sort((a, b) => a.name.localeCompare(b.name))
  );

  championIconUrl = computed(() => {
    const ver = this.latestVersion();
    const id = this.selectedChampionId();
    return ver ? this.ddragon.championSquareUrl(ver, id) : '';
  });

  itemIconUrl(itemId: string) {
    const ver = this.latestVersion();
    return ver ? this.ddragon.itemIconUrl(ver, itemId) : '';
  }

  shopFilters: { key: ShopFilter; label: string }[] = [
    { key: 'all', label: 'Tous' },
    { key: 'starter', label: 'Départ' },
    { key: 'basic', label: 'Basiques' },
    { key: 'epic', label: 'Épiques' },
    { key: 'legendary', label: 'Légendaires' },
    { key: 'boots', label: 'Bottes' },
    { key: 'consumable', label: 'Consommables' },
    { key: 'trinket', label: 'Trinkets' },
  ];

  private isSummonersRift(it: DdItem) {
    if (!it.maps) return true;
    return it.maps['11'] !== false;
  }

  private isShopItem(it: DdItem) {
    if (it.hideFromAll === true) return false;
    if (it.inStore === false) return false;
    if (it.requiredChampion) return false;
    if (it.requiredAlly) return false;
    if ((it.gold?.purchasable ?? true) === false) return false;
    return true;
  }

  private classifiedById = computed(() => {
    const map = this.itemsMap();
    const out: Record<string, Classified> = {};

    for (const [id, it] of Object.entries(map)) {
      if (!it) continue;
      out[id] = this.classifyCore(id, it);
    }
    return out;
  });

  private getClassified(id: string): Classified {
    return this.classifiedById()[id] ?? EMPTY_CLASSIFIED;
  }

  private classifyCore(id: string, it: DdItem): Classified {
    if (EXCLUDE_ITEM_IDS.has(id)) {
      return {
        excluded: true,
        isBoots: false,
        isTrinket: false,
        isConsumable: false,
        isStarter: false,
        isBasic: false,
        isEpic: false,
        isLegendary: false,
        gold: it.gold?.total ?? 0,
      };
    }

    if (FORCE_LEGENDARY_IDS.has(id)) {
      return {
        excluded: false,
        isBoots: false,
        isTrinket: false,
        isConsumable: false,
        isStarter: false,
        isBasic: false,
        isEpic: false,
        isLegendary: true,
        gold: it.gold?.total ?? 0,
      };
    }

    if (FORCE_BOOTS.has(id)) {
      return {
        excluded: false,
        isBoots: true,
        isTrinket: false,
        isConsumable: false,
        isStarter: false,
        isBasic: false,
        isEpic: false,
        isLegendary: false,
        gold: it.gold?.total ?? 0,
      };
    }

    // Wardstone épique
    if (WARDSTONE_EPIC_IDS.has(id)) {
      return {
        excluded: false,
        isBoots: false,
        isTrinket: false,
        isConsumable: false,
        isStarter: false,
        isBasic: false,
        isEpic: true,
        isLegendary: false,
        gold: it.gold?.total ?? 0,
      };
    }

    const tags = it.tags ?? [];
    const from = it.from ?? [];
    const into = it.into ?? [];
    const gold = it.gold?.total ?? 0;

    const isTrinket =
      tags.includes('Trinket') || id === '3340' || id === '3363' || id === '3364';

    const isBoots =
      tags.includes('Boots') || id === '1001' || from.includes('1001');

    const isConsumable =
      tags.includes('Consumable') && !isBoots && !isTrinket;

    // Départ = vrais starters
    const starterTags = new Set(['Lane', 'Jungle', 'GoldPer']);
    const hasStarterTag = tags.some(t => starterTags.has(t));

    const isStarter =
      !isBoots &&
      !isTrinket &&
      !isConsumable &&
      gold > 0 &&
      gold <= 700 &&
      hasStarterTag;

    const isBasic =
      !isBoots &&
      !isTrinket &&
      !isConsumable &&
      !isStarter &&
      gold > 0 &&
      from.length === 0 &&
      into.length > 0;

    const isEpic =
      !isBoots &&
      !isTrinket &&
      !isConsumable &&
      from.length > 0 &&
      into.length > 0;

    const isLegendary =
      !isBoots &&
      !isTrinket &&
      !isConsumable &&
      !isStarter &&
      gold >= 2000 &&
      into.length === 0;

    return {
      excluded: false,
      isBoots,
      isTrinket,
      isConsumable,
      isStarter,
      isBasic,
      isEpic,
      isLegendary,
      gold,
    };
  }

  // ✅ Interdits de sélection (visibles mais non cliquables)
  isSelectableItemId(itemId: string): boolean {
    const c = this.getClassified(itemId);
    if (c.excluded) return false;
    if (c.isConsumable || c.isTrinket) return false;
    return true;
  }

  canAddItem(itemId: string): boolean {
    if (!this.isSelectableItemId(itemId)) return false;
    const ids = this.selectedItemIds();
    if (ids.includes(itemId)) return false;
    if (ids.length >= 6) return false;
    return true;
  }

  // ✅ Liste filtrée
  items = computed(() => {
    const map = this.itemsMap();
    const q = this.itemSearch().trim().toLowerCase();
    const filter = this.shopFilter();

    const list: Array<{ id: string } & DdItem> = [];

    for (const [id, it] of Object.entries(map)) {
      if (!it) continue;
      if (!this.isSummonersRift(it)) continue;
      if (!this.isShopItem(it)) continue;

      const c = this.getClassified(id);
      if (c.excluded) continue;

      // filtre boutique
      let ok = true;
      switch (filter) {
        case 'boots': ok = c.isBoots; break;
        case 'trinket': ok = c.isTrinket; break;
        case 'consumable': ok = c.isConsumable; break;
        case 'starter': ok = c.isStarter; break;
        case 'basic': ok = c.isBasic; break;
        case 'epic': ok = c.isEpic; break;
        case 'legendary': ok = c.isLegendary; break;
        case 'all': ok = true; break;
      }
      if (!ok) continue;

      if (q && !(it.name ?? '').toLowerCase().includes(q)) continue;

      list.push({ id, ...(it as DdItem) });
    }

    // tri par prix puis nom
    list.sort((a, b) => {
      const ga = a?.gold?.total ?? 0;
      const gb = b?.gold?.total ?? 0;
      if (ga !== gb) return ga - gb;
      return (a.name ?? '').localeCompare(b.name ?? '');
    });

    return list;
  });

  // Stats
  baseStatsAtLevel = computed(() => {
    const champ = this.championDetail();
    if (!champ) return null;
    return this.stats.statsAtLevel(champ.stats, this.level());
  });

  finalStats = computed(() => {
    const base = this.baseStatsAtLevel();
    if (!base) return null;

    const map = this.itemsMap();
    const ids = this.selectedItemIds();

    const out: any = { ...base, ap: 0 };
    let asMultiplier = 1;

    for (const id of ids) {
      const it = map[id];
      if (!it) continue;

      const c = this.getClassified(id);
      if (c.isConsumable || c.isTrinket) continue;

      const s = it.stats ?? {};
      out.hp += s['FlatHPPoolMod'] ?? 0;
      out.armor += s['FlatArmorMod'] ?? 0;
      out.spellblock += s['FlatSpellBlockMod'] ?? 0;
      out.attackdamage += s['FlatPhysicalDamageMod'] ?? 0;
      out.ap += s['FlatMagicDamageMod'] ?? 0;

      asMultiplier *= 1 + (s['PercentAttackSpeedMod'] ?? 0);
    }

    out.attackspeed = out.attackspeed * asMultiplier;
    return out;
  });

  // Items UI
  addItem(itemId: string) {
    if (!this.canAddItem(itemId)) return;
    this.selectedItemIds.set([...this.selectedItemIds(), itemId]);
  }

  removeItem(itemId: string) {
    this.selectedItemIds.set(this.selectedItemIds().filter(id => id !== itemId));
  }

  clearItems() {
    this.selectedItemIds.set([]);
  }
}

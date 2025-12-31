export type DdChampion = { id: string; name: string; title: string };

export type DdItem = {
  name: string;
  tags?: string[];
  maps?: Record<string, boolean>;
  from?: string[];
  into?: string[];
  gold?: { purchasable?: boolean; total?: number };
  stats?: Record<string, number>;

  inStore?: boolean;
  hideFromAll?: boolean;
  requiredChampion?: string;
  requiredAlly?: string;
};

export type DdChampionDetail = {
  stats: Record<string, number>;
};

export type ShopFilter =
  | 'all'
  | 'starter'
  | 'basic'
  | 'epic'
  | 'legendary'
  | 'boots'
  | 'consumable'
  | 'trinket';

export type Classified = {
  excluded: boolean;
  isBoots: boolean;
  isTrinket: boolean;
  isConsumable: boolean;
  isStarter: boolean;
  isBasic: boolean;
  isEpic: boolean;
  isLegendary: boolean;
  gold: number;
};

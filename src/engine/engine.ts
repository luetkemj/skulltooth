import { World } from "miniplex";

type EId = number;

export enum DamageTypes {
  ACID = "Acid",
  COLD = "Cold",
  BLUDGEONING = "Bludgeoning",
  LIGHTNING = "Lightning",
  PIERCING = "Piercing",
  FIRE = "Fire",
  FORCE = "Force",
  POISON = "Poison",
  PSYCHIC = "Psychic",
  RADIANT = "Radiant",
  NECROSIS = "Necrosis",
  SLASHING = "Slashing",
  THUNDER = "Thunder",
}

export enum EffectTypes {
  HEALTH = "health",
}

type Damage = {
  type: DamageTypes;
  delta: number;
};

type Effect = {
  name: string;
  component: EffectTypes;
  delta: number;
  duration: number;
};

export type Entity = {
  activeDamages?: Array<Damage>;
  activeEffects?: Array<Effect>;
  ai?: false;
  appearance?: {
    char: string;
    tint: number;
    tileSet: string;
  };
  blocking?: false;
  damages?: Array<Damage>;
  dead?: false;
  effects?: Array<Effect>;
  equippedWeapon?: EId;
  health?: {
    max: number;
    current: number;
  };
  inventory?: Array<EId>;
  inFov?: false;
  layer?: Number;
  legendable?: false;
  opaque?: false;
  player?: false;
  revealed?: false;
  name?: String;
  pathThrough?: false;
  pickup?: false;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  tryMove?: {
    x: number;
    y: number;
    z: number;
  };
};

export const world = new World<Entity>();


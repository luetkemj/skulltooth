import { World } from "miniplex";

export type EId = number;

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
  ai?: boolean;
  appearance?: {
    char: string;
    tint: number;
    tileSet: string;
  };
  blocking?: boolean;
  damages?: Array<Damage>;
  dead?: boolean;
  effects?: Array<Effect>;
  equippedWeapon?: EId;
  health?: {
    max: number;
    current: number;
  };
  inventory?: Array<EId>;
  inFov?: true;
  layer?: Number;
  legendable?: boolean;
  isOpaque?: true;
  isPlayer?: boolean;
  revealed?: boolean;
  name?: String;
  pathThrough?: boolean;
  pickup?: boolean;
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

// const entity = world.add({ position: { x: 0, y: 0, z: 0 } });
//
// world.addComponent(entity, "velocity", { x: 10, y: 0, z: 0 });
//
// // const id = world.id(entity)
//
// // console.log(id)
// console.log(entity);
// console.log(world);
//

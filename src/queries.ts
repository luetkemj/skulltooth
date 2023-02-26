import { createQuery } from "./engine";
import { ComponentTypes } from "./engine/index.types";

export enum QueryTypes {
    IsPlayer = "isPlayer",
}

export const createQueries = () => {
    createQuery(QueryTypes.IsPlayer, {any: [ComponentTypes.IsPlayer], all: [], none: []})
}

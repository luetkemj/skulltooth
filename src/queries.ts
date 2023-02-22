import { createQuery } from "./engine";

export const createQueries = () => {
    createQuery('isPlayerQuery', {any: ["isPlayer"], all: [], none: []})
}

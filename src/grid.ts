type PosId = string;
type Pos = { x: number, y: number, z: number}

export const toPosId = (pos: Pos): PosId => {
    return `${pos.x},${pos.y},${pos.z}`
}

export const toPos = (posId: PosId): Pos => {
    const coords = posId.split(',').map(coord => parseInt(coord, 10))
    return {  x: coords[0],  y: coords[1], z: coords[2] }
}

import { Coord } from "./Moves"
import {v4} from 'uuid'

export interface Cell {
    value: number,
    id: string,
    coord: Coord
}
export const createCell = (coord: Coord): Cell => {
    return {
        value: 2,
        id: v4(),
        coord: coord
    }
}
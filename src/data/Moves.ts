export type Move = [[number, number], [number, number], boolean]
export type Turn = Move[]
export type Coord = [number, number]

export const newMove = (coord: Coord): Move => [coord, coord, false]
export const MoveDown = (move: Move): Move => {
    move[1][0] += 1
    return move
}
export const MoveUp = (move: Move): Move => {
    move[1][0] -= 1
    return move
}
export const MoveLeft = (move: Move): Move => {
    move[1][1] -= 1
    return move
}
export const MoveRight = (move: Move): Move => {
    move[1][1] += 1
    return move
}
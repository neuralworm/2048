import { Cell } from "@/data/Cells"

export const findHighest = (gameBoard: any[][]): number => {
    let highest = 0
    gameBoard.forEach((gameCol: any[])=> gameCol.forEach((cell: Cell) => {
        if(cell !== null && cell.value > highest) highest = cell.value
    }))
    return highest
}

export const checkForMoves = (board: any[][]): boolean => {

    return true
}
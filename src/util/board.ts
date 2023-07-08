export const findHighest = (gameBoard: any[][]): number => {
    let highest = 0
    gameBoard.forEach((gameCol: any[])=> gameCol.forEach((cell: any) => {
        if(cell !== null && cell > highest) highest = cell
    }))
    return highest
}

export const checkForMoves = (board: any[][]): boolean => {

    return true
}
import { Cell, combineCells, createCell } from "@/data/Cells"
import { Coord, Move, canIMoveTo, newMove } from "@/data/Moves"
import { checkForMoves, findHighest } from "@/util/board"
import Modal from "antd/lib/modal/Modal"
import { useState, useEffect, useRef } from "react"
import { useSwipeable, SwipeDirections } from "react-swipeable"
import CellStyle from '@/data/CellStyle'
const defaultGameBoard: any[][] = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]]

const GameView = () => {
    // NEW GAME
    const [newGame, setNewGame] = useState<boolean>(false)
    // OPTIONS
    const [swipeControls, setSwipeControls] = useState<boolean>(true)

    // INITIALIZE GAMEBOARD
    const [gameBoard, setGameBoard] = useState<any[][]>([])
    const boardRef = useRef<any[][]>(gameBoard)
    boardRef.current = gameBoard
    const [previousTurn, setPreviousTurn] = useState<any[][] | null>([])

    const initializeGame = () => {
        let oldBoard: any[] = JSON.parse(JSON.stringify([[...defaultGameBoard[0]], [...defaultGameBoard[1]], [...defaultGameBoard[2]], ...[defaultGameBoard[3]]]))
        let first: number[] = getRandBoardBlock()
        let second: number[] = getRandBoardBlock()
        while (first.toString() == second.toString()) {
            second = getRandBoardBlock()
        }
        // console.log(first, second)
        oldBoard[first[0]][first[1]] = createCell([first[0], first[1]])
        oldBoard[second[0]][second[1]] = createCell([second[0], second[1]])
        setGameBoard(oldBoard)
        setPreviousTurn(null)
        setScore(0)
        setTurn(0)
    }
    const confirmNewGame = () => {
        setNewGame(false)
        initializeGame()
    }
    const config = {
        trackMouse: true,
        preventScrollOnSwipe: true
    }
    const handlers = useSwipeable({
        onSwiped: (event) => {
            // console.log(event.dir)
            swipe(event.dir)
        }, ...config
    })
    //TURN
    const [turn, setTurn] = useState<number>(0)
    const [turnInProgress, setTurnInProgress] = useState(false)
    // SCORE
    const [score, setScore] = useState<number>(0)
    const [scoreChange, setScoreChange] = useState<number>()


    // CONTROLLERS TO HANDLE INPUT AND INVOKE START TURN METHOD WITH STRING ARGUMENT
    const swipe = (dir: SwipeDirections) => {
        switch (dir) {
            case "Down":
                startTurn("DOWN")
                break;
            case "Up":
                startTurn("UP")
                break;
            case "Left":
                startTurn("LEFT")
                break;
            case "Right":
                startTurn("RIGHT")
                break;
            default:
                break;
        }
    }
    const keys = (e: KeyboardEvent) => {
        // console.log(e)
        e.preventDefault()
        switch (e.key) {
            case "ArrowUp":
                startTurn("UP")
                break;
            case "ArrowDown":
                startTurn("DOWN")
                break;
            case "ArrowLeft":
                startTurn("LEFT")
                break;
            case "ArrowRight":
                startTurn("RIGHT")
                break;

            default:
                break;
        }
    }
    // RECEIVE CONTROL INPUT AND CALL CORRECT METHOD
    const startTurn = (direction: string) => {
        // SET HISTORY
        let lastTurn: any[][] = getCurrentBoardCopy()
        setPreviousTurn(lastTurn)
        switch (direction) {
            case "UP":
                swipeUp(getCurrentBoardCopy())
                break;
            case "DOWN":
                swipeDown(getCurrentBoardCopy())
                break;
            case "LEFT":
                swipeLeft(getCurrentBoardCopy())
                break;
            case "RIGHT":
                swipeRight(getCurrentBoardCopy())
                break;

            default:
                break;
        }
    }


    const getCurrentBoardCopy = (): any[][] => {
        return JSON.parse(JSON.stringify([[...boardRef.current[0]], [...boardRef.current[1]], [...boardRef.current[2]], ...[boardRef.current[3]]]))
    }
    const getPreviousBoardCopy = (): any[][] | null => {
        if (!previousTurn) return null
        return JSON.parse(JSON.stringify([[...previousTurn[0]], [...previousTurn[1]], [...previousTurn[2]], ...[previousTurn[3]]]))
    }
    const boardToString = (): string => {
        return JSON.stringify([[...boardRef.current[0]], [...boardRef.current[1]], [...boardRef.current[2]], ...[boardRef.current[3]]])
    }
    const boardColsToRows = (orig: any[][]): any[][] => {
        return orig.map((col: any[], ind: number) => {
            return [orig[0][ind], orig[1][ind], orig[2][ind], orig[3][ind]]
        })
    }
    const boardRowsToCols = (orig: any[][]): any[][] => {
        return orig.map((col: any[], ind: number) => {
            return [orig[0][ind], orig[0 + 1][ind], orig[0 + 2][ind], orig[0 + 3][ind]]
        })
    }

    // DIRECTIONS
    const swipeDown = (boardCopy: any[]) => {
        let checked = 0
        boardCopy.forEach((col: any[], ind: number) => {
            for (let i = col.length - 2; i >= 0; i--) {
                let cell: Cell = col[i] as Cell
                // continue if empty
                if (cell == null) continue

                let spacesToCheck = 3 - i
                for (let j = 0; j < spacesToCheck; j++) {
                    let me: Cell = cell
                    let you: Cell = col[i + 1 + j]
                    let canIMoveDown: boolean = canIMoveTo(me, you)
                    if (!canIMoveDown) break
                    if (you == null) {
                        col[i + j] = null
                        col[i + 1 + j] = me
                        me.coord = [ind, i + 1 + j]
                        // console.log(col)
                        checked++
                        continue
                    }
                    if (you.value == me.value) {
                        me.coord = you.coord
                        let combinedCell: Cell[] = [you, me]
                        col[i + j] = null
                        col[i + 1 + j] = combinedCell
                        checked++
                        break
                    }
                }
            }
        })
        if (!checked) return
        endTurn(boardCopy)
    }
    const swipeUp = (boardCopy: any[]) => {
        let checked = 0
        boardCopy.forEach((col: any[], ind: number) => {
            // let moves: Move[] = []
            for (let i = 1; i < col.length; i++) {
                let cell: Cell = col[i] as Cell
                // continue if empty
                if (cell == null) continue

                let spacesToCheck = i
                for (let j = 0; j < spacesToCheck; j++) {
                    let me: Cell = cell
                    let you: Cell = col[i - 1 - j]
                    let canIMoveDown: boolean = canIMoveTo(me, you)
                    if (!canIMoveDown) break
                    if (you == null) {
                        col[i - j] = null
                        col[i - 1 - j] = me
                        me.coord = [ind, i - j - 1]
                        // console.log(col)
                        checked++
                        continue
                    }
                    if (you.value == me.value) {
                        me.coord = you.coord
                        let combinedCell: Cell[] = [you, me]
                        col[i - j] = null
                        col[i - 1 - j] = combinedCell
                        checked++
                        break
                    }
                }
            }
        })
        if (!checked) return
        endTurn(boardCopy)
    }
    const swipeLeft = (boardCopy: any[]) => {
        let board = boardColsToRows(boardCopy)
        // console.log(board)
        let checked = 0
        board.forEach((col: any[], ind: number) => {
            for (let i = 1; i < col.length; i++) {
                let cell: Cell = col[i] as Cell
                // continue if empty
                if (cell == null) continue
                // if a number
                let spacesToCheck = i
                for (let j = 0; j < spacesToCheck; j++) {
                    let me: Cell = cell
                    let you: Cell = col[i - 1 - j]
                    let canIMoveDown: boolean = canIMoveTo(me, you)
                    if (!canIMoveDown) break
                    if (you == null) {
                        col[i - j] = null
                        col[i - 1 - j] = me
                        me.coord = [i - j - 1, ind]

                        checked++
                        continue
                    }
                    if (you.value == me.value) {
                        me.coord = you.coord
                        let combinedCell: Cell[] = [you, me]
                        col[i - j] = null
                        col[i - 1 - j] = combinedCell
                        checked++
                        break
                    }
                }
            }
        })
        if (!checked) return
        endTurn(boardRowsToCols(board))

    }
    const swipeRight = (boardCopy: any[]) => {
        let board = boardColsToRows(boardCopy)
        let checked = 0
        board.forEach((col: any[], ind: number) => {
            for (let i = col.length - 2; i >= 0; i--) {
                let cell: Cell = col[i] as Cell
                // continue if empty
                if (cell == null) continue
                // if a number
                let spacesToCheck = 3 - i
                for (let j = 0; j < spacesToCheck; j++) {
                    let me: Cell = cell
                    let you: Cell = col[i + 1 + j]
                    let canIMoveDown: boolean = canIMoveTo(me, you)
                    if (!canIMoveDown) break
                    if (you == null) {
                        col[i + j] = null
                        col[i + 1 + j] = me
                        me.coord = [i + j + 1, ind]

                        checked++
                        continue
                    }
                    if (you.value == me.value) {
                        me.coord = you.coord
                        let combinedCell: Cell[] = [you, me]
                        col[i + j] = null
                        col[i + 1 + j] = combinedCell
                        checked++
                        break
                    }
                }
            }
        })
        if (!checked) return
        endTurn(boardRowsToCols(board))
    }

    // Check if game over and add new 2
    const endTurn = (newGameBoard: any[][]) => {
        // CHECK FOR DOUBLE CELLS TO COMBINE AND GET SCORE
        let combinedCells: Cell[][] = newGameBoard.flat().filter((cell: any) => {
            if (Array.isArray(cell)) return true
            return false
        })
        let score = 0
        // COMBINE ALL COMBINED CELLS
        combinedCells.forEach((cells: Cell[]) => {
            let newCell = combineCells(cells)
            score += newCell.value
            newGameBoard[newCell.coord[0]][newCell.coord[1]] = newCell
        })
        // console.log(newGameBoard)
        // SET SCORE
        setScore(old => old + score)

        // INCREMENT
        setTurn(old => old + 1)
        let rand: Coord = getRandomEmptyBlock(newGameBoard)
        newGameBoard[rand[0]][rand[1]] = createCell([rand[0], rand[1]])
        // SET CURRENT STATE
        setGameBoard(newGameBoard)
        // CHECK IF BOARD FULL
        if (isBoardFull(newGameBoard)) {
            checkForMoves(newGameBoard)
        }
    }
    // BACK 1 TURN
    const undoTurn = () => {
        if (previousTurn == null) return
        let lastTurn = getPreviousBoardCopy()
        setPreviousTurn(null)
        setGameBoard(lastTurn!)
        setTurn(old => old - 1)
    }
    // UTIL
    const getRandBoardBlock = (): number[] => {
        let rand1 = Math.floor(Math.random() * 4)
        let rand2 = Math.floor(Math.random() * 4)
        return [rand1, rand2]
    }
    type Coord = [number, number]
    const getRandomEmptyBlock = (newBoard: any[][]): Coord => {
        let empties: Coord[] = []
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard[i].length; j++) {
                if (newBoard[i][j] == null) {
                    empties.push([i, j])
                }
            }
        }
        return empties[Math.floor(Math.random() * empties.length)]
    }
    const isBoardFull = (newBoard: any[][]): boolean => {
        let empties: Coord[] = []
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard[i].length; j++) {
                if (newBoard[i][j] == null) {
                    empties.push([i, j])
                }
            }
        }
        return empties.length > 0 ? false : true
    }
    // PERSISTENCE
    interface GameState {
        score: number,
        gameboard: any[][],
    }
    const saveState = () => {
        // console.log(gameBoard)
        localStorage.setItem('gamestate', JSON.stringify({
            score: score,
            gameBoard: boardToString()
        }))
    }
    const loadState = () => {
        let json: string | null = localStorage.getItem("gamestate")
        let gameState: GameState = json ? JSON.parse(json) as GameState : { score: 0, gameboard: defaultGameBoard }
        setScore(gameState.score)
        setGameBoard(gameState.gameboard)
    }
    useEffect(() => {
        initializeGame()
        // loadState()
        window.addEventListener('keydown', keys)
        window.addEventListener('beforeunload', saveState)
        return () => {
            window.removeEventListener('keydown', keys)
            window.removeEventListener('beforeunload', saveState)

        }
    }, [])

    return (
        <div {...handlers} className="cursor-grab select-none" id="drag-area">
            <div id="title-container">
                <h3 className="leading-7 text-sm opacity-50">
                    PLAY
                </h3>
                <h1 className="text-5xl font-bold mb-8 text-left font-mono leading-6">2048</h1>
            </div>

            {/* GAME STATE CONTROLS */}
            <div className="flex flex-row justify-between mb-4">
                <button onClick={() => setNewGame(true)} className="bg-neutral-300 text-black p-2 text-[12px] sm:text-xs font-bold">NEW GAME</button>
                <button disabled={previousTurn == null} onClick={() => undoTurn()} className={`${previousTurn != null ? "bg-neutral-50" : "bg-neutral-600"} text-black p-2 text-[12px] sm:text-xs font-bold`}>UNDO TURN ({previousTurn == null ? 0 : 1})</button>
            </div>


            {/* STATS */}
            <div className="flex flex-row justify-between mb-4 text-center">
                <div id="highest-number" className="text-lg sm:text-2xl bg-neutral-600 w-16 sm:w-28 flex items-center justify-center font-bold">
                    {findHighest(gameBoard)}
                </div>
                <div className="flex flex-row gap-4">

                    <div id="score-box" className="">
                        <div className="font-semibold text-neutral-400 text-[12px] sm:text-xs leading-3">SCORE</div>
                        <div className="font-extrabold text-white text-xl">{score}</div>
                    </div>
                    <div id="turn-box" className="">
                        <div className="font-semibold text-neutral-400 text-[12px] sm:text-xs leading-3">TURN</div>
                        <div className="font-extrabold text-white text-xl">{turn}</div>
                    </div>
                </div>
            </div>





            {/* GAME BOARD */}
            <div id="gameboard" className="rounded-md w-64 h-64  text-black flex flex-row relative bg-neutral-400">

                {/* CELLS */}
                {gameBoard.map((col: Cell[], indx: number) => {
                    return (
                        <div className="flex flex-col basis-1/4 relative" key={`col-${indx}`}>
                            {col.map((cell: Cell, ind2: number) => {
                                return (

                                    <div className="flex flex-row items-center justify-center border-2 rounded-sm basis-1/4 font-bold text-neutral-600" key={`col-${indx}-row-${ind2}`} style={{
                                        // background: `rgba(${255 / row},0,0,1)`
                                    }}>
                                        {/* {cell.value == null ? "" : cell.value} */}
                                    </div>
                                )

                            })}
                        </div>
                    )
                })}

                {/* ACTIVE CELLS */}
                <div id="active-cells" className="absolute top-0 left-0 right-0 bottom-0 w-64 h-64">
                    {/* NON-NESTED MAPPED ARRAY METHOD */}
                    {
                        gameBoard.flat().map((cell: Cell | any, index: number) => {
                            if (cell != null) return (
                                <Block key={`${cell.id}`} cell={cell} coord={cell.coord}></Block>
                            )
                        })
                    }
                    {/* NESTED COLUMN LOOPS METHOD */}
                    {/* {gameBoard.map((col: Cell[], indx: number) => {
                        return (
                           
                                col.map((cell: Cell, ind2: number) => {
                                    if (cell != null) return (
                                        <Block key={`${cell.id}`} cell={cell} coord={[indx, ind2]}></Block>

                                    )

                                })
                        )
                    })} */}
                </div>

            </div>
            <NewGamePopup confirmNewGame={confirmNewGame} onClose={() => setNewGame(false)} open={newGame}></NewGamePopup>
        </div>
    )

}

interface ModalProps {
    open: boolean,
    onClose: Function,
    confirmNewGame: Function
}
const NewGamePopup = ({ open, onClose, confirmNewGame }: ModalProps) => {
    return (
        <Modal title="New Game" open={open} onOk={() => confirmNewGame()} onCancel={() => onClose()} okText={"Confirm"} cancelText={"Cancel"}>
            <p>Are you sure you want to end your current game?</p>
        </Modal>

    )
}

interface blockprop {
    cell: Cell,
    coord: Coord
}

const Block = ({ cell, coord }: blockprop) => {
    return (
        <div className={`flex absolute flex-row items-center text-3xl font-bold justify-center w-1/4 h-1/4 p-1 transition-speed ${BoxPosition(coord)} `} data-id={cell.id} style={{
            transform: `translateX(${coord[0] * 4}rem) translateY(${coord[1] * 4}rem)`,
            WebkitTransform: `translateX(${coord[0] * 4}rem) translateY(${coord[1] * 4}rem)`,
            msTransform: `translateX(${coord[0] * 4}rem) translateY(${coord[1] * 4}rem)`,
        }}>
            <div className="bg-white text-neutral-600 w-full h-full flex items-center justify-center rounded-md">
                {cell.value}
            </div>
        </div>
    )
}

const BoxPosition = (coord: Coord): string => {
    let left = coord[0] == 0 ? "0" : (coord[0] == 1 ? "1/4" : (coord[0] == 2 ? "1/2" : "3/4"))
    let top = coord[1] == 0 ? "0" : (coord[1] == 1 ? "1/4" : (coord[1] == 2 ? "1/2" : "3/4"))
    return `translate-x-${left} translate-y-${top} `
}



export default GameView
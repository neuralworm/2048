import { Move, newMove } from "@/data/Moves"
import { checkForMoves, findHighest } from "@/util/board"
import Modal from "antd/lib/modal/Modal"
import { useState, useEffect, useRef } from "react"
import { useSwipeable, SwipeDirections } from "react-swipeable"

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
        oldBoard[first[0]][first[1]] = 2
        oldBoard[second[0]][second[1]] = 2
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
        trackMouse: true
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
    // Handlers
    const swipe = (dir: SwipeDirections) => {
        switch (dir) {
            case "Down":
                swipeDown(getCurrentBoardCopy())
                break;
            case "Up":
                swipeUp(getCurrentBoardCopy())
                break;
            case "Left":
                swipeLeft(getCurrentBoardCopy())
                break;
            case "Right":
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
        console.log(boardCopy)
        let checked = 0
        boardCopy.forEach((col: any[], ind: number) => {
            for (let i = col.length - 2; i >= 0; i--) {
                // continue if empty
                if (col[i] == null) continue

                // if a number
                // console.log(i, col[i])
                let spacesToCheck = 3 - i
                for (let j = 0; j < spacesToCheck; j++) {
                    let me = col[i + j]
                    let you = col[i + 1 + j]
                    if (you == null) {
                        col[i + j] = null
                        col[i + 1 + j] = me
                        console.log(col)
                        checked++

                        continue

                    }
                    if (you == me) {
                        col[i + j] = null
                        col[i + 1 + j] = me + you
                        setScore(old => old + me + you)
                        checked++

                        break
                    }
                }
            }
        })
        if (!checked) return
        console.log('setting board')
        endTurn(boardCopy)
    }
    const swipeUp = (boardCopy: any[]) => {
        console.log(boardCopy)
        let checked = 0
        boardCopy.forEach((col: any[], ind: number) => {
            for (let i = 1; i < col.length; i++) {
                // continue if empty
                if (col[i] == null) continue
                let move: Move = newMove([ind, i-1])
                console.log('move ' + move)

                // if a number
                // console.log(i, col[i])
                let spacesToCheck = i
                for (let j = 0; j < spacesToCheck; j++) {

                    let me = col[i - j]
                    let you = col[i - 1 - j]
                    if (you == null) {
                        col[i - j] = null
                        col[i - 1 - j] = me
                        console.log(col)
                        checked++
                        continue

                    }
                    if (you == me) {
                        col[i - j] = null
                        col[i - 1 - j] = me + you
                        setScore(old => old + me + you)
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
        let checked = 0
        board.forEach((col: any[], ind: number) => {
            for (let i = 1; i < col.length; i++) {
                // continue if empty
                if (col[i] == null) continue

                // if a number
                let spacesToCheck = i
                for (let j = 0; j < spacesToCheck; j++) {
                    let me = col[i - j]
                    let you = col[i - 1 - j]
                    if (you == null) {
                        col[i - j] = null
                        col[i - 1 - j] = me
                        console.log(col)
                        checked++

                        continue

                    }
                    if (you == me) {
                        col[i - j] = null
                        col[i - 1 - j] = me + you
                        setScore(old => old + me + you)
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


    }

    // Check if game over and add new 2
    const endTurn = (newGameBoard: any[][]) => {
        let lastTurn: any[][] = getCurrentBoardCopy()
        setTurn(old => old + 1)
        let rand: Coord = getRandomEmptyBlock(newGameBoard)
        newGameBoard[rand[0]][rand[1]] = 2
        // SET HISTORY
        setPreviousTurn(lastTurn)
        // SET CURRENT STATE
        setGameBoard(newGameBoard)
        // CHECK IF BOARD FULL
        if(isBoardFull(newGameBoard)){
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
    const keys = (e: KeyboardEvent) => {
        // console.log(e)
        switch (e.key) {
            case "ArrowUp":
                swipeUp(getCurrentBoardCopy())
                break;
            case "ArrowDown":
                swipeDown(getCurrentBoardCopy())
                break;
            case "ArrowLeft":
                swipeLeft(getCurrentBoardCopy())
                break;
            case "ArrowRight":
                swipeRight(getCurrentBoardCopy())
                break;

            default:
                break;
        }
    }
    return (
        <div {...handlers} className="cursor-grab select-nones" id="drag-area">


            {/* GAME STATE CONTROLS */}
            <div className="flex flex-row justify-between mb-4">
                <button onClick={() => setNewGame(true)} className="bg-neutral-300 text-black p-2 text-xs font-bold">NEW GAME</button>
                <button disabled={previousTurn == null} onClick={() => undoTurn()} className={`${previousTurn != null ? "bg-neutral-50" : "bg-neutral-600"} text-black p-2 text-xs font-bold`}>UNDO TURN</button>
            </div>


            {/* STATS */}
            <div className="flex flex-row justify-between mb-2 text-center">
                <div id="highest-number" className="text-2xl bg-neutral-600 w-28 flex items-center justify-center font-bold">
                    {findHighest(gameBoard)}
                </div>
                <div className="flex flex-row gap-4">

                <div id="score-box" className="">
                    <div className="font-semibold text-neutral-400 text-xs leading-3">SCORE</div>
                    <div className="font-extrabold text-white text-xl">{score}</div>
                </div>
                <div id="turn-box" className="">
                    <div className="font-semibold text-neutral-400 text-xs leading-3">TURN</div>
                    <div className="font-extrabold text-white text-xl">{turn}</div>
                </div>
                </div>
            </div>





            {/* GAME BOARD */}
            <div id="gameboard" className="bg-white w-48 sm:w-64 h-48 sm:h-64 text-black flex flex-row">
                {gameBoard.map((col: number[], indx: number) => {
                    return (
                        <div className="flex flex-col basis-1/4" key={`col-${indx}`}>
                            {col.map((row: number, ind2: number) => {
                                return (
                                    <div className="flex flex-row items-center justify-center border-2 basis-1/4 font-bold text-neutral-600" key={`col-${indx}-row-${ind2}`} style={{
                                        // background: `rgba(${255 / row},0,0,1)`
                                    }}>
                                        {row == null ? "" : row}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
            <NewGamePopup confirmNewGame={confirmNewGame} onClose={()=> setNewGame(false)} open={newGame}></NewGamePopup>
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
        <Modal title="New Game" open={open} onOk={()=> confirmNewGame()} onCancel={()=> onClose()} okText={"Confirm"} cancelText={"Cancel"}>
        <p>Are you sure you want to end your current game?</p>
      </Modal>
      
    )
}

interface blockprop {
    num: number
}

const Block = ({ num }: blockprop) => {
    return (
        <div className="h-12 w-12">
            {num}
        </div>
    )
}

export default GameView
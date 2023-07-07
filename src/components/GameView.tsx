import { useState, useEffect, useRef } from "react"
import { useSwipeable, SwipeDirections } from "react-swipeable"

const defaultGameBoard: any[][] = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]]

const GameView = () => {

    // INITIALIZE GAMEBOARD
    const [gameBoard, setGameBoard] = useState<any[][]>([])
    const boardRef = useRef<any[][]>(gameBoard)
    boardRef.current = gameBoard

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

    // SCORE
    const [score, setScore] = useState<number>(0)

    // Handlers
    const swipe = (dir: SwipeDirections) => {
        switch (dir) {
            case "Down":
                swipeDown(getBoardCopy())
                break;
            case "Up":
                swipeUp(getBoardCopy())
                break;
            case "Left":
                swipeLeft(getBoardCopy())
                break;
            case "Right":
                swipeRight(getBoardCopy())
                break;
            default:
                break;
        }
    }
    const getBoardCopy = (): any[][] => {
        return JSON.parse(JSON.stringify([[...boardRef.current[0]], [...boardRef.current[1]], [...boardRef.current[2]], ...[boardRef.current[3]]]))
    }
    const boardColsToRows = (orig: any[][]): any[][] => {
        return orig.map((col: any[], ind: number)=>{
            return [orig[0][ind], orig[1][ind], orig[2][ind], orig[3][ind]]
        })
    }
    const boardRowsToCols = (orig: any[][]): any[][] => {
        return orig.map((col: any[], ind: number)=>{
            return [orig[0][ind], orig[0+1][ind], orig[0+2][ind], orig[0+3][ind]]
        })
    }
    // DIRECTIONS
    const swipeDown = (boardCopy: any[]) => {
        console.log(boardCopy)
        boardCopy.forEach((col: any[], ind: number)=>{

            for(let i = col.length - 2; i >= 0; i--){
                // continue if empty
                if(col[i] == null) continue
                // if a number
                // console.log(i, col[i])
                let spacesToCheck = 3 - i
                console.log(spacesToCheck + 'spaces to check')
                for(let j = 0; j < spacesToCheck; j++){
                    console.log("loop " + j)
                    console.log(col)
                    let me = col[i+j]
                    let you = col[i+1+j]
                    if(you == null){
                        col[i+j] = null
                        col[i+1+j] = me
                        console.log(col)
                        continue

                    }
                    if(you == me){
                        col[i+j] = null
                        col[i+1+j] = me * you
                        setScore(old => old + me * you)
                        continue
                    }
                }
            }
        })
        console.log('setting board')
        setGameBoard(boardCopy)
    }
    const swipeUp = (boardCopy: any[]) => {
        console.log(boardCopy)
        boardCopy.forEach((col: any[], ind: number)=>{

            for(let i = 1; i < col.length; i++){
                // continue if empty
                if(col[i] == null) continue
                // if a number
                // console.log(i, col[i])
                let spacesToCheck = i
                console.log(spacesToCheck + 'spaces to check')
                for(let j = 0; j < spacesToCheck; j++){
                    console.log("loop " + j)
                    console.log(col)
                    let me = col[i-j]
                    let you = col[i-1-j]
                    if(you == null){
                        col[i-j] = null
                        col[i-1-j] = me
                        console.log(col)
                        continue

                    }
                    if(you == me){
                        col[i-j] = null
                        col[i-1-j] = me * you
                        setScore(old => old + me * you)
                        continue
                    }
                }
            }
        })
        console.log('setting board')
        setGameBoard(boardCopy)
    }
    const swipeLeft = (boardCopy: any[]) => {
        let board = boardColsToRows(boardCopy)
        board.forEach((col: any[], ind: number)=>{

            for(let i = 1; i < col.length; i++){
                // continue if empty
                if(col[i] == null) continue
                // if a number
                // console.log(i, col[i])
                let spacesToCheck = i
                console.log(spacesToCheck + 'spaces to check')
                for(let j = 0; j < spacesToCheck; j++){
                    console.log("loop " + j)
                    console.log(col)
                    let me = col[i-j]
                    let you = col[i-1-j]
                    if(you == null){
                        col[i-j] = null
                        col[i-1-j] = me
                        console.log(col)
                        continue

                    }
                    if(you == me){
                        col[i-j] = null
                        col[i-1-j] = me * you
                        setScore(old => old + me * you)
                        continue
                    }
                }
            }
        })
        setGameBoard(boardRowsToCols(board))
        
    }
    const swipeRight = (boardCopy: any[]) => {
        

    }

    // Check if game over and add new 2
    const endTurn = () => {

    }
    // UTIL
    const getRandBoardBlock = (): number[] => {
        let rand1 = Math.floor(Math.random() * 4)
        let rand2 = Math.floor(Math.random() * 4)
        return [rand1, rand2]
    }

    // PERSISTENCE
    interface GameState {
        score: number,
        gameboard: any[][]
    }
    const saveState = () => {
        // console.log(gameBoard)
        localStorage.setItem('gamestate', JSON.stringify({
            score: score,
            gameBoard: JSON.stringify(gameBoard)
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
                swipeUp(getBoardCopy())
                break;
            case "ArrowDown":
                swipeDown(getBoardCopy())
                break;
            case "ArrowLeft":
                swipeLeft(getBoardCopy())
                break;
            case "ArrowRight":
                swipeRight(getBoardCopy())
                break;

            default:
                break;
        }
    }
    return (
        <div {...handlers} className="">
            <div id="score-box" className="mb-4">
                <div className="font-semibold text-neutral-400 text-sm leading-3">SCORE</div>
                <div className="font-extrabold text-white text-lg">{score}</div>
            </div>
            <div id="gameboard" className="bg-white w-64 h-64 text-black flex flex-row">
                {gameBoard.map((col: number[], indx: number) => {
                    return (
                        <div className="flex flex-col basis-1/4" key={`col-${indx}`}>
                            {col.map((row: number, ind2: number) => {
                                return (
                                    <div className="flex flex-row items-center justify-center border-2 basis-1/4 font-bold text-neutral-600" key={`col-${indx}-row-${ind2}`}>
                                        {row == null ? "" : row}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
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
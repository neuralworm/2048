import { useState, useEffect } from "react"
import { useSwipeable, SwipeDirections } from "react-swipeable"

const defaultGameBoard: any[][] = [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]

const GameView = () => {

    const [gameBoard, setGameBoard] = useState<any[][]>(defaultGameBoard)

    const initializeGame = () => {
        let oldBoard: any[] = [[...defaultGameBoard[0]], [...defaultGameBoard[1]], [...defaultGameBoard[2]], ...[defaultGameBoard[3]]]
        let first: number[] = getRandBoardBlock()
        let second: number[] = getRandBoardBlock()
        while (first.toString() == second.toString()){
            second = getRandBoardBlock()
        }
        console.log(first, second)
        oldBoard[first[0]][first[1]] = 2
        oldBoard[second[0]][second[1]] = 2
        setGameBoard(oldBoard)
    }

    const config = {
        trackMouse: true
    }
    const handlers = useSwipeable({
        onSwiped: (event) => {
            console.log(event.dir)
            swipe(event.dir)
        }, ...config
    })


    // Handlers
    const swipe = (dir: SwipeDirections) => {
        
    }
    const getRandBoardBlock = (): number[] => {
        let rand1 = Math.floor(Math.random() * 4)
        let rand2 = Math.floor(Math.random() * 4)
        return [rand1, rand2]
    }

    useEffect(()=>{
        initializeGame()
    },[])
    return(
        <div {...handlers} className="">
            <div id="gameboard" className="bg-white w-64 h-64 text-black flex flex-col">
                {gameBoard.map((col: number[], indx: number)=>{
                    return(
                        <div className="flex flex-row basis-1/4" key={`col-${indx}`}>
                            {col.map((row: number, ind2: number)=>{
                                return(
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



interface blockprop{
    num: number
}

const Block = ({num}: blockprop) => {
    return(
        <div className="h-12 w-12">
            {num}
        </div>
    )
}

export default GameView
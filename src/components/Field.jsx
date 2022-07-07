import React, { useState } from "react";
import style from "./styles.module.css"

const FIELD_SIZE = 3;
const MARKS = ['X', 'O'];
const WINNER_NO_ONE = 'no one';

export function Field(props) {

    const size = props.size ? +props.size : FIELD_SIZE;

    let [player, setPlayer] = useState(0);
    let [currentMark, setMark] = useState(MARKS[0]);
    let [tableField, updateField] = useState(new Array(size * size));
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(WINNER_NO_ONE);

    const winCombinations = generateWinCombinations(size);

    const tableArray = [];
    for (let i = 1; i <= size; i++) {
        const rowsArray = [];
        for (let j = 1; j <= size; j++) {
            rowsArray.push((i - 1) * size + j);
        }
        tableArray.push(<Row rows={rowsArray} tableField={tableField} />);
    }

    function onFieldClick(event) {

        const fieldIndex = event.target.getAttribute('index');
        if (!fieldIndex || tableField[fieldIndex - 1] || gameOver) {
            return undefined;
        }
        tableField[fieldIndex - 1] = currentMark;
        updateField(tableField);
        checkGameOver(winCombinations, tableField);
        if (!gameOver) {
            setPlayer(player === 0 ? 1 : 0);
            setMark(currentMark === MARKS[0] ? MARKS[1] : MARKS[0]);
        }

    }

    function newGameOnClick() {
        setPlayer(0);
        setMark(MARKS[0]);
        updateField(new Array(size * size));
        setGameOver(false);
    }

    function checkGameOver(winCombinations, tableField) {     

        // win combinations
        winCombinations.forEach(item => {

            MARKS.forEach(mark => {

                let match = true;

                for (let i = 0; i < item.length; i++) {
                    match = (tableField[item[i] - 1] === mark && match);    
                }

                if (match) {
                    setGameOver(match); 
                    setWinner('player ' + MARKS.indexOf(mark))
                }

            })
            

            
            
        });

        // field full, no one win
        if (!gameOver) {
            if (tableField.filter(item => Boolean(item)).length === tableField.length){
                setGameOver(true);
                setWinner(WINNER_NO_ONE)
            }
        }

    }

    return <div>
        Current player: {player} ({currentMark})
        <div>
            <button onClick={newGameOnClick}>New game</button>
        </div>

        <table onClick={onFieldClick}>
            {tableArray}
        </table>

        <div className="gameOver">{gameOver ? 'GAME OVER, winner ' + winner : ''}</div>

    </div>;
}

function Cell(props) {

    return <td className={'cell'} index={props.element}>{props.mark ? props.mark : ''}</td>

}

function Row(props) {

    if (!props.rows || !props.tableField) {
        return '';
    }

    return <tr>{props.rows.map(el => <Cell element={el} index={el} mark={props.tableField[el - 1]} />)}</tr>

}

function generateWinCombinations(fieldSize) {

    const winCombinations = [];

    // win rows & columns
    for (let i = 1; i <= fieldSize; i++) {
        let row = [];
        let column = [];
        let j = 1;
        while (j  <= fieldSize) {
            row.push((i - 1) * fieldSize + j); // row
            column.push(i + (j - 1) * fieldSize); // column
            j++;
        }
        winCombinations.push(row, column);
    }

    // win diagonals
    let diag1 = [];
    let diag2 = [];
    for (let i = 1; i <= fieldSize; i++) {
        diag1.push(i + (i - 1) * fieldSize);
        diag2.push(i * fieldSize - (i == 1 ? 0 : i - 1));
    }
    winCombinations.push(diag1, diag2);

    return winCombinations;

}
import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

function Square(props) {
    let style = props.selected ? "square square-selected" : "square";
    return (
        <button className={style} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true
    //     };
    //     this.handleClick = this.handleClick.bind(this);
    // }

    // handleClick(i) {
    //     const squares = this.state.squares.slice();
    //     squares[i] = this.state.xIsNext ? 'X' : 'O';
    //     this.setState({
    //         squares: squares,
    //         xIsNext: !this.state.xIsNext
    //     });
    // }

    renderSquare(i) {
        const selected = i == this.props.selectedIndex ? true : false;
        return (
            <Square
                key={i}
                value={this.props.squares[i]} 
                selected={selected} 
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    render() {
        // const winner = calculateWinner(this.state.squares);
        // let status;
        // if (winner) {
        //     status = 'Winner: ' + winner;
        // } else {
        //     status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        // }
        //const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

        // return (
        //     <div>
        //         {/* <div className="status">{status}</div> */}
        //         <div className="board-row">
        //             {this.renderSquare(0)}
        //             {this.renderSquare(1)}
        //             {this.renderSquare(2)}
        //         </div>
        //         <div className="board-row">
        //             {this.renderSquare(3)}
        //             {this.renderSquare(4)}
        //             {this.renderSquare(5)}
        //         </div>
        //         <div className="board-row">
        //             {this.renderSquare(6)}
        //             {this.renderSquare(7)}
        //             {this.renderSquare(8)}
        //         </div>
        //     </div>
        // );
        let rows = [];
        let squares = [];
        let size = 3;
        for(let r=0; r<size; r++){
            for(let s=r*size; s<r*size + size ; s++){
                squares.push(this.renderSquare(s));
            }
            rows.push(<div key={r} className="board-row">{squares}</div>);
            squares = [];
        }
        return (
            <div>{rows}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: {col: null, row: null}
            }],
            xIsNext: true,
            stepNumber: 0,
            jumpToStep: 0 //After jump to should not allow any move before go back to current step
        };
    }

    handleClick(i) {        
        if(this.state.jumpToStep != this.state.stepNumber){
            return; //After jump to should not allow any move before go back to current step
        }
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const xLocation = Math.ceil((i+1)/3);
        const yLocation = (i+1)%3 == 0 ? 3: (i+1)%3;
        this.setState({
            history: history.concat([{
                squares: squares,
                location: {row: xLocation, col: yLocation}
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: this.state.history.length,  
            jumpToStep: this.state.history.length          
        });
    }

    jumpTo(move) {
        this.setState({
            jumpToStep: move,
            xIsNext: (move % 2) === 0,            
        });
    }

    render() {
        const history = this.state.history;
        const current = this.state.stepNumber == this.state.jumpToStep ? history[this.state.stepNumber] : history[this.state.jumpToStep];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {

            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    <label>{'Location: [' + step.location.row + ',' + step.location.col + ']'}</label>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        let selected = (current.location.row - 1) * 3 + (current.location.col -1);
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} selectedIndex={selected} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
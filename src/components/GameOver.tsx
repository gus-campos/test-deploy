import './GameOver.css'

interface GameOverProps {
    winner: string;
    newGame: () => void;
    hidden: boolean;
}

export default function GameOver({ winner, newGame, hidden}: GameOverProps){
    console.log("aaa",hidden)
    if(hidden){
        return(null)
    }
    return (
        <div >
            <div className="game-over">
                <h2>Fim de jogo!</h2>
                <p>O vencedor é: {winner}</p>
                <button className='game-over-btn' onClick={newGame}>Novo Jogo</button>
            </div>
        </div>
    )
}
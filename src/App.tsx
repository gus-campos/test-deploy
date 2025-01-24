import { useEffect, useState } from 'react'
import './App.css'
import SingleCard from './components/SingleCard.tsx'

interface Card {
  src: string;
  matched: boolean;
  id: number;
}

const cardImages: Card[] = [
  { src: "./img/bandeira.png", matched: false, id: 1},
  { src: "./img/bau-tesouro.png", matched: false, id: 1},
  { src: "./img/bussola.png", matched: false, id: 1},
  { src: "./img/chapeu.png", matched: false, id: 1},
  { src: "./img/moeda.png", matched: false, id: 1},
  { src: "./img/rum.png", matched: false, id: 1},
  { src: "./img/roda-barco.png", matched: false, id: 1},
  { src: "./img/bomba.png", matched: false, id: 1},
  { src: "./img/gancho.png", matched: false, id: 1}
]

function App() {
  const [cards, setCards] = useState<Card[]>([])
  const [turns, setTurns] = useState<number>(0)
  const [playerTurn, setPlayerTurn] = useState<number>(1) // Para alternar entre jogador 1 e 2
  const [score, setScore] = useState<{ player1: number, player2: number }>({ player1: 0, player2: 0 }) // Para armazenar a pontuação dos jogadores
  const [choiceOne, setChoiceOne] = useState<Card | null>(null)
  const [choiceTwo, setChoiceTwo] = useState<Card | null>(null)
  const [disabled, setDisabled] = useState<boolean>(false)

  // Função para embaralhar as cartas e resetar o estado do jogo
  const newGame = () => {
    //embaralha as cartas
    const shuffleCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }))

    // Resetando as variáveis de estado para começar um novo jogo
    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffleCards)
    setTurns(0)
    setPlayerTurn(1) // Jogador 1 começa após cada novo jogo
    setScore({ player1: 0, player2: 0 }) // Resetando a pontuação dos jogadores
  }

  //Seleção de Cartas nas variaveis de estado choice one ou two
  const handleChoice = (card: Card) => {
    if (card.id === choiceOne?.id) return; //tratamento de erro
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  //verificação se a carta da match ou não
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true }
            } else {
              return card
            }
          })
        })

        // Aumenta a pontuação do jogador atual
        setScore(prevScore => {
          const currentPlayer = playerTurn === 1 ? 'player1' : 'player2';
          return { ...prevScore, [currentPlayer]: prevScore[currentPlayer] + 1 }
        })

        // O jogador continua no mesmo turno se acertar
        resetTurn(true)
      } else {
        setTimeout(() => resetTurn(false), 1000)
      }
    }
  }, [choiceOne, choiceTwo])

  //reseta o turno
  const resetTurn = (isMatch: boolean) => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)

    // Alterna o jogador apenas se o jogador errar
    if (!isMatch) {
      setPlayerTurn(prev => (prev === 1 ? 2 : 1))
    }
  }

  //Começa um novo jogo automaticamente
  useEffect(() => {
    newGame()
  }, [])

  return (
    <div className="App">
      <div className="heading">
        <h1>Bubble Memory</h1>
        <button onClick={newGame}>Novo Jogo</button>
      </div>

      <div className="card-grid">
        {cards.map(card => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>

      <div className="game-info">
        <p>Turnos: {turns}</p>
        <p>Jogador Atual: {playerTurn === 1 ? "Jogador 1" : "Jogador 2"}</p>
      </div>

      <div className="scoreboard">
        <p>Jogador 1: {score.player1}</p>
        <p>Jogador 2: {score.player2}</p>
      </div>
    </div>
  )
}

export default App

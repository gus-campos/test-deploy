import { useEffect, useState } from 'react'
import './App.css'
import SingleCard from './components/SingleCard.tsx'

type Player = number;

type Score = [number, number];

export interface Card {
	name: string;
  matched: boolean;
  id: number;
}

let id = 0;
const createCard = (name: string): Card => {
	return { name: name, matched: false, id: id++ };
}

const cardStock: Card[] = [

	createCard("bandeira"),
	createCard("bau-tesouro"),
	createCard("bussola"),
	createCard("chapeu"),
	createCard("moeda"),
	createCard("rum"),
	createCard("roda-barco"),
	createCard("bomba"),
	createCard("gancho")
]

function App() {
  const [cards, setCards] = useState<Card[]>([])
  const [turns, setTurns] = useState<number>(0)
  const [playerTurn, setPlayerTurn] = useState<Player>(0) // Para alternar entre jogador 1 e 2
  const [score, setScore] = useState<Score>([0, 0]) // Para armazenar a pontuação dos jogadores
  const [choiceOne, setChoiceOne] = useState<Card | null>(null)
  const [choiceTwo, setChoiceTwo] = useState<Card | null>(null)
  const [disabled, setDisabled] = useState<boolean>(false)

  // Função para embaralhar as cartas e resetar o estado do jogo
  const newGame = () => {
    //embaralha as cartas

    const cardCopy = cardStock.map( card => {
      const cardCpy = {...card};
      return cardCpy;
    })

		const cardCopies = cardStock.map( card => { 
			const cardCopy = { ...card };
			cardCopy.id += cardStock.length; // Garantindo que cópias terão id único
			return cardCopy;
		}) 

    const shuffledCards = [...cardCopy, ...cardCopies].sort(() => Math.random() - 0.5);

    // Resetando as variáveis de estado para começar um novo jogo
    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setTurns(0)
    setPlayerTurn(0) // Jogador 1 começa após cada novo jogo
    setScore([0, 0]) // Resetando a pontuação dos jogadores
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
      if (choiceOne.name === choiceTwo.name) {
        setCards(prevCards => {
          return prevCards.map(card => {

            if (card.name === choiceOne.name)
							card.matched = true;

            return card;
          })
        })

        // Aumenta a pontuação do jogador atual
        setScore(prevScore => {
					prevScore[playerTurn]++;
          return prevScore;
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
      setPlayerTurn(prev => (prev === 0 ? 1 : 0))
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
        <p>Jogador Atual: {playerTurn === 0 ? "Jogador 1" : "Jogador 2"}</p>
      </div>

      <div className="scoreboard">
        <p>Jogador 1: {score[0]}</p>
        <p>Jogador 2: {score[1]}</p>
      </div>
    </div>
  )
}

export default App

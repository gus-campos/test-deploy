import { useEffect, useState } from 'react'
import './App.css'
import SingleCard from './components/SingleCard.tsx'
import GameOver from './components/GameOver.tsx';

type Player = number;
type Score = [number, number];
export type Posic = [number, number];

export interface Card {
	name: string;
  matched: boolean;
  id: number;
	posic: Posic;
} 



const createCard = (name: string): Card => {
	return { name: name, matched: false, id: -1, posic: [0, 0] };
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

// ============= Moving =============

const bubbleDimensions = [3, 6];

function lerp(start: Posic, end: Posic, t: number): Posic {

  /* Calcula uma posição intermediária entre dois pontos de acordo com um coeficiente t */

  return [
    start[0] + (end[0] - start[0]) * t,
    start[1] + (end[1] - start[1]) * t
  ];
}

let t: number = 0; // Tempo para interpolação (vai de 0 a 1)
const duration: number = 2000; // Duração da animação em mili segundos
let lastTime: (number | null) = null; // Para controlar o tempo decorrido

const randomCard = (cards: Card[]): Card => {

  /* Dado um array de cartas retorna uma carta aleatória */

	const length = cards.length;
	const index = Math.floor(Math.random() * length);

	return cards[index];
}

// =================================

// =============

function App() {

	// ============
	// State
	// ============

  const [cards, setCards] = useState<Card[]>([])
  const [turns, setTurns] = useState<number>(0)
  const [playerTurn, setPlayerTurn] = useState<Player>(0) // Para alternar entre jogador 1 e 2
  const [score, setScore] = useState<Score>([0, 0]) // Para armazenar a pontuação dos jogadores
  const [choiceOne, setChoiceOne] = useState<Card | null>(null)
  const [choiceTwo, setChoiceTwo] = useState<Card | null>(null)
  const [disabled, setDisabled] = useState<boolean>(false)
  //gerenciar game over
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [winner, setWinner] = useState<string>("")
  const [hidden,setHidden] = useState<boolean>(true)

	// Moving
	const [movingCards, setMovingCards] = useState<(Card | null)[]>([null, null])
	const [movingPositions, setMovingPositions] = useState<(Posic | null)[]>([null, null])

	// =============
	// Definições
	// =============

	const indexToPosic = (index: Posic): Posic => {

    /* Converte um índice de linha e coluna em uma posição baseada em porcentagem*/

		return [
			(100 * index[0]) / bubbleDimensions[0],
			(100 * index[1]) / bubbleDimensions[1]
		];
	}

  const newGame = () => {
    
    // Função para embaralhar as cartas e resetar o estado do jogo

    //embaralha as cartas
		const cardStockCopy1 = cardStock.map(card => createCard(card.name))
		const cardStockCopy2 = cardStock.map(card => createCard(card.name))
    const shuffledCards = [...cardStockCopy1, ...cardStockCopy2].sort(() => Math.random() - 0.5);

		// Definir ids únicos
		let id = 0;
		for (let card of shuffledCards)
			card.id = id++;

        // Definir a posição de cada um em um "grade" de posições
		for (let card of shuffledCards) {

            // Convertendo id em coluna e linha
			const column = card.id % bubbleDimensions[0];
			const row = Math.floor(card.id / bubbleDimensions[0]);
            
            // Definindo posição em porcentagens, de acordo com coluna e linha (será usado dentro de "SingleCard")
			card.posic = indexToPosic([column, row]);
		}

    // Resetando as variáveis de estado para começar um novo jogo
    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setTurns(0)
    setPlayerTurn(0) // Jogador 1 começa após cada novo jogo
    setScore([0, 0]) // Resetando a pontuação dos jogadores
    setMovingPositions([null,null])
    movingPositions[0] = null
    cancelAnimationFrame
    setDisabled(false)
    setHidden(true)
  }

  const handleChoice = (card: Card) => {
    
    //Seleção de Cartas nas variaveis de estado choice one ou two

    if (card.id === choiceOne?.id) return; //tratamento de erro
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  const resetTurn = (isMatch: boolean) => {
    
    // reseta o turno

    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)

    // Alterna o jogador apenas se o jogador errar
    if (!isMatch) {
      setPlayerTurn(prev => (prev === 0 ? 1 : 0))
    }
  }

	const animate = (time: number) => {

    /* Atualiza a posição das cartas em movimento, quadro a quadro, causando uma animação */ 

		if (lastTime == null) 
			lastTime = time;
	
		const deltaTime = (time - lastTime!);
		lastTime = time

		t += deltaTime / duration;
	
		if (t < 1) {

			// Interpolar posições
			const current0 = lerp(movingPositions[0]!, movingPositions[1]!, t);
			const current1 = lerp(movingPositions[1]!, movingPositions[0]!, t);

      // Aualizar posição das cartas
			const updatedCards = cards.map(card => {
				
				if (card === movingCards[0]) 
					return { ...card, posic: current0 };
				
				if (card === movingCards[1])
					return { ...card, posic: current1 }; 
				
				return card;
			});
				
			setCards(updatedCards);
      // Chama o próximo quadro
			requestAnimationFrame(animate); 
			
		} else {

			// Garantir que os elementos estão exatamente nas posições finais
			const updatedCardsFinal = cards.map(card => {
				
				if (card === movingCards[0]) 
					return { ...card, posic: movingPositions[1]! };
				
				if (card === movingCards[1])
					return { ...card, posic: movingPositions[0]! }; 
				
        setDisabled(false); // habilitar cartas para clique após a animação acabar
				return card;
			});

      setCards(updatedCardsFinal)

      // Resetar coeficiente de interpolação e anular tempo
			t = 0;
			lastTime = null;

      // Resetar variáveis
			setMovingCards([null, null]);
			setMovingPositions([null, null]);
		}
	}

	// =============
	// UseEffect
	// ============= 
  
  useEffect(() => {
    
    //Começa um novo jogo automaticamente

    newGame()
  }, [])

  useEffect(() => {
    
    //verificação se a carta da match ou não

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

	useEffect(() => {

		if (turns > 0) {
	
			// Se não estiver acontecendo movimento
			if (movingPositions[0] == null) {

				// Sortear cartas
				const movingCardsAux = [randomCard(cards), randomCard(cards)];
        while(movingCards[0] == movingCards[1])
          movingCards[1] = randomCard(cards)
        
				// Definir como cartas a serem movidas
				setMovingCards(movingCardsAux);
				setMovingPositions(movingCardsAux.map(card => card?.posic));
			}
		}
	
	}, [turns]);

	useEffect(() => {    
    /* Ao mudar moving positions, verifica e inicia a animação */
		
		if (movingPositions[0] != null){
			requestAnimationFrame(animate);
      setDisabled(true); //desabilitar cartas enquanto a animação de troca está sendo executada!
    }
		
	}, [movingPositions]);

  //Gerenciamento de vencedores
  useEffect(()=>{
    if(cards.every(card=>card.matched)){
      setGameOver(true);
      if(gameOver){
        setHidden(false);
      }
      //talvez else set hidden true
    }
    //determina o vencedor
    if(score[0] > score[1]){
      setWinner('Jogador 1');
    }else if(score[1] > score[0]){
      setWinner('Jogador 2');
    }else{
      setWinner('Empate!');
    }
    
  },[cards,score]);

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

      <GameOver
       winner = {winner} 
       newGame = {newGame}
       hidden = {hidden}
      />

    </div>
  )
}

export default App

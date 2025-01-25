import './SingleCard.css'
import { Card } from "../App";

// Definindo os tipos para as props do componente
interface SingleCardProps {
  card: Card;
  handleChoice: (card: Card) => void;
  flipped: boolean;
  disabled: boolean;
}

const getImagePath = (name: string): string  => `./img/${name}.png`;
const backImage = "img/teste-bolha.png"

export default function SingleCard({ card, handleChoice, flipped, disabled }: SingleCardProps) {

  const handleClick = () => {
    if (!disabled) 
      handleChoice(card)
  }

  const odd = card.id % 2 == 1;
  const flippedString = flipped ? "true" : "false"; 
  
  // Estilo que sobrescreverá parcialmente o estilo definido no arquivo css
  // Definindo a posição dele dentro do div, em porcentagem
  const overwritePosic = { 
    top: `${card.posic[0]}%`, 
    left: `${card.posic[1]}%`
  }

  return (
    <div className='card' data-odd={odd} data-flipped={flippedString} style={overwritePosic}> 
        <img className="back" src={backImage}></img>
        <img className='front' src={getImagePath(card.name)} onClick={handleClick} alt='card front' />
    </div>
  )
}

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

const odd = (n: number) => n % 2 == 1;

export default function SingleCard({ card, handleChoice, flipped, disabled }: SingleCardProps) {

  const handleClick = () => {
    if (!disabled) {
      handleChoice(card)
    }
  }

  return (
    <div className='card' data-odd={odd(card.id) ? "true" : "false"}>
      <div className={flipped ? "flipped" : ""}>
        <div className="back"></div>
        <img className='front' src={getImagePath(card.name)} onClick={handleClick} alt='card front' />
      </div>
    </div>
  )
}

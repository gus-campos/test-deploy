import './SingleCard.css'

// Definindo os tipos para as props do componente
interface SingleCardProps {
  card: {
    src: string;
    matched: boolean;
    id: number;
  };
  handleChoice: (card: { src: string; matched: boolean; id: number }) => void;
  flipped: boolean;
  disabled: boolean;
}

export default function SingleCard({ card, handleChoice, flipped, disabled }: SingleCardProps) {

  const handleClick = () => {
    if (!disabled) {
      handleChoice(card)
    }
  }

  return (
    <div className='card'>
      <div className={flipped ? "flipped" : ""}>
        <div className="back"></div>
        <img className='front' src={card.src} onClick={handleClick} alt='card front' />
      </div>
    </div>
  )
}

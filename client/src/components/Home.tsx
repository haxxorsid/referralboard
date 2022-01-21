import { cardType } from '../types';
import './Home.css';

export default function Home(props: { cards: cardType[]; }) {
    return (
      <div>
        <h2>Home</h2>
        {props.cards &&
                props.cards.map(card => <div key={card.cardId}>{card.title}</div>)
            }
      </div>
    );
  }
import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import axios from "axios";
import { v4 as uuid } from "uuid";
function Deck() {
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [autoDraw, setAutoDraw] = useState(false);


  const timerRef = useRef(null);
  useEffect(() => {
    async function getDeck() {
      const res = await axios.get("https://deckofcardsapi.com/api/deck/new/");
      setDeck(res.data.deck_id);
    }
    getDeck();
  }, [setDeck]);

   useEffect(() => {
    /* Draw a card via API, add card to state "drawn" list */
    async function getCard() {

      try {
        let res = await axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=1`);

        if (res.data.remaining === 0) {
          setAutoDraw(false);
          throw new Error("no cards remaining!");
        }

        const card = res.data.cards[0];

        setCards(d => [
          ...d, <Card key={uuid()}imageUrl={card.image}/>]);
      } catch (err) {
        alert(err);
      }
    }

    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await getCard();
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoDraw, setAutoDraw, deck]);


  const getNewCard = async () => {
    const res = await axios.get(
      `https://deckofcardsapi.com/api/deck/${deck}/draw/?count=1`
    );
    const imageUrl = res.data.cards[0].image;
    setCards([...cards, <Card key={uuid()} imageUrl={imageUrl} />]);
  };
  const getAllCards = ()=>{
      if (autoDraw === false) {
          setAutoDraw(true);
      } else {setAutoDraw(false)}
  }
  return (
    <div>
      <button onClick={getNewCard}>New Card</button>
      <button onClick={getAllCards}>New Card Every Second(toggle)</button>
      <div>{cards}</div>
    </div>
  );
}

export default Deck;

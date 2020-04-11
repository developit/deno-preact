import htm from 'htm'
import { h } from "preact";
const html = htm.bind(h);
import { useState } from "preact/hooks";


export const Counter = ({id}) => {
  const [likes, setLikes] = useState(0);
  const handleClick = (e) => {
    e.preventDefault();
    setLikes(likes + 1);
  };

  return html `
      <div>HOW MANY LIKES ${likes}</div>
      <button onClick=${handleClick}>Incrementz</button>
  `;
};

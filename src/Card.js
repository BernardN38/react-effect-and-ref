import React from "react";

function Card({ imageUrl }) {
  const randRotation = Math.floor(Math.random() * (45 + 45 + 1)) - 45;
  return (
    <div
      style={{
        position: "absolute",
        top: "20%",
        left: "45%",
        transform: `rotate(${randRotation}deg)`,
      }}
    >
      <img src={imageUrl} />
    </div>
  );
}

export default Card;

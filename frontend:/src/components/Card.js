import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = props.card.owner._id === currentUser._id;

  const cardDeleteButtonClassName = `card__delete-button ${
    isOwn ? "card__delete-button_visible" : "card__delete-button_hidden"
  }`;
  const isLiked = props.card.likes.some((i) => i._id === currentUser._id);

  const cardLikeButtonClassName = `card__like ${
    isLiked ? "card__like_active" : "card__like"
  }`;

  function handleCardClick() {
    props.onCardClick(props.card);
  }
  function handleLikeClick() {
    props.onCardLike(props.card);
  }
  function handleCardDelete() {
    props.onCardDelete(props.card);
  }
  return (
    <li className="card">
      <img
        className="card__image"
        onClick={handleCardClick}
        src={props.card.link}
        alt={`Фотография ${props.card.name}`}
      />
      <button
        type="button"
        onClick={handleCardDelete}
        className={cardDeleteButtonClassName}
      />
      <div className="card__item">
        <h2 className="card__title text-content">{props.card.name} </h2>
        <div className="card__like-container">
          <button
            type="button"
            onClick={handleLikeClick}
            className={cardLikeButtonClassName}
          />
          <span className="card__like-count">{props.card.likes.length}</span>
        </div>
      </div>
    </li>
  );
}

export default Card;

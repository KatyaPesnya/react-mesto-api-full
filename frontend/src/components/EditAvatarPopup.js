import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const avatarRef = React.useRef("");

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
    avatarRef.current.value = ('');
  }
  return (
    <PopupWithForm
      name="avatar"
      title="Обновить аватар"
      submitText="Сохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        id="avatar-input"
        type="url"
        name="avatar"
        required
        className="popup__input"
        ref={avatarRef}
      />
      <span className="popup__input-error avatar-input-error" />
    </PopupWithForm>
  );
}
export default EditAvatarPopup;

import { useEffect } from "react";
import css from "./Modal.module.css";
import PropTypes from "prop-types";

export default function Modal({ onClose, onLeft, onRight, src, tags }) {
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const handleKeyDown = (e) => {
    if (e.code === "Escape") {
      onClose();
    } else if (e.code === "ArrowLeft") {
      onLeft();
    } else if (e.code === "ArrowRight") {
      onRight();
    }
  };

  const handleOverlayClick = (event) => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  return (
    <div className={css.Overlay} onClick={handleOverlayClick}>
      <div>
        <img src={src} alt={tags} className={css.Modal} />
      </div>
    </div>
  );
}

Modal.propTypes = {
  src: PropTypes.string,
  tags: PropTypes.string,
};
import { Component } from "react";
import css from "./Modal.module.css";
import PropTypes from "prop-types";

export default class Modal extends Component {
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    if (e.code === "Escape") {
      this.props.onClose();
    } else if (e.code === "ArrowLeft") {
      this.props.onLeft();
    } else if (e.code === "ArrowRight") {
      this.props.onRight();
    }
  };

  handleOverlayClick = (event) => {
    if (event.currentTarget === event.target) {
      this.props.onClose();
    }
  };

  render() {
    return (
      <div className={css.Overlay} onClick={this.handleOverlayClick}>
        <div>
          <img src={this.props.src} alt={this.props.tags} className={css.Modal} />
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  src: PropTypes.string,
  tags: PropTypes.string,
};
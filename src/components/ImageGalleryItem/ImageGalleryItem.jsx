import css from "./ImageGalleryItem.module.css";
import PropTypes from "prop-types";

export default function ImageGalleryItem({ src, alt, onClick, id }) {
  return (
    <li
      className={css.ImageGalleryItem}
      onClick={() => {
        onClick(src, alt, id);
      }}
    >
      <img src={src} alt={alt} className={css.ImageGalleryItemImage} id={id} />
    </li>
  );
}

ImageGalleryItem.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  onClick: PropTypes.func,
  dataId: PropTypes.number,
};
import { useState, useEffect } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import ImageGalleryItem from "../ImageGalleryItem/ImageGalleryItem";
import css from "./ImageGallery.module.css";
import Api from "../../services/imageApi";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";

export default function ImageGallery({ query }) {
  const [gallery, setGallery] = useState([]);
  const [status, setStatus] = useState("idle");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const [modalImgSrc, setModalImgSrc] = useState("");
  const [currentImgIdx, setCurrentImgIdx] = useState("");
  const [largeImageURL, setLargeImageURL] = useState("");
  const [alt, setAlt] = useState("");
  
  useEffect(() => {
    if (query !== "") {
      setStatus("pending");
      Api(query)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return Promise.reject(new Error(`no images on request`));
        })
        .then(({ hits }) => {
          if (hits.length === 0) {
            setStatus("rejected");
          } else {
            const newHits = match(hits);
            setGallery(newHits);
            setStatus("resolved");
            setPage((prev) => prev + 1);
            setSearchQuery(query);
          }
        })
        .catch((error) => {
          setStatus("rejected");
          console.log(error);
        });
    }
  }, [query]);

  const loadmore = () => {
    Api(searchQuery, page)
      .then((response) => {
        return response.json();
      })
      .then(({ hits }) => {
        const newHits = match(hits);
        setGallery((prev) => [...prev, ...newHits]);
        setPage((prev) => prev + 1);
      })
      .then(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      })
      .catch((error) => {
        setStatus("rejected");
        console.log(error);
      });
  };

  const match = (arr) => {
    const newArr = [];
    arr.forEach(({ id, largeImageURL, tags }) => {
      newArr.push({ id, largeImageURL, tags });
    });
    return newArr;
  };

  const toggleModal = () => {
    setShowModal((prev) => !prev);
    setModalImgSrc("");
  };

  const decrementModal = () => {
    if (currentImgIdx > 0) {
      setModalImgSrc(gallery[currentImgIdx - 1].largeImageURL);
      setCurrentImgIdx((prev) => prev - 1);
    }
  };

  const incrementModal = () => {
    if (currentImgIdx < gallery.length - 1) {
      setModalImgSrc(gallery[currentImgIdx + 1].largeImageURL);
      setCurrentImgIdx((prev) => prev + 1);
    }
  };

  const modalOpen = (src, alt, id) => {
    setLargeImageURL(src);
    setAlt(alt);
    toggleModal();
    gallery.map((item, idx) => {
      if (item.id === id) {
        setCurrentImgIdx(idx);
      }
      return "";
    });
  };

  if (status === "idle") {
    return "";
  }
  if (status === "pending") {
    return (
      <Loader
        type="Audio"
        color="#3f51b5"
        height={100}
        width={100}
        timeout={300000}
        style={{ textAlign: "center", paddingTop: "25px" }}
      />
    );
  }
  if (status === "rejected") {
    
      return <p className={css.p} >Sorry, "{query}" not found</p>
    
  }
  if (status === "resolved") {
    return (
      <div className={css.wrapper}>
        {showModal && (
          <Modal
            onClose={toggleModal}
            onLeft={decrementModal}
            onRight={incrementModal}
            src={modalImgSrc || largeImageURL}
            tags={alt}
          />
        )}
        <ul className={css.ImageGallery}>
          {gallery.map(({ largeImageURL, tags, id }) => {
            return (
              <ImageGalleryItem
                src={largeImageURL}
                alt={tags}
                onClick={modalOpen}
                key={id}
                id={id}
              />
            );
          })}
        </ul>
        <Button onClick={loadmore} />
      </div>
    );
  }
}

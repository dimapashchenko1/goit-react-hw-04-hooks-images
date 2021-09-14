import { Component } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import ImageGalleryItem from "../ImageGalleryItem/ImageGalleryItem";
import css from "./ImageGallery.module.css";
import Api from "../../services/imageApi";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";

export default class ImageGallery extends Component {
    state = {
      gallery: [],
      status: "idle",
      page: 1,
      showModal: false,
    };
  
    
  componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevProps.query;
    const nextQuery = this.props.query;

    if (prevQuery !== nextQuery) {
      this.setState({ status: "pending" });
      Api(nextQuery)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return Promise.reject(new Error(`no images on request`));
        })
        .then(({ hits }) => {
          if (hits.length === 0) {
            this.setState({ status: "rejected" });
          } else {
            const newHits = this.match(hits);
            this.setState({
              gallery: newHits,
              status: "resolved",
              page: this.state.page + 1,
              searchQuery: nextQuery,
            });
          }
        })
        .catch((error) => {
          this.setState({ status: "rejected" });
          console.log(error);
        });
    }
  }
  

  loadmore = () => {
    const { searchQuery, page } = this.state;

    Api(searchQuery, page)
      .then((response) => {
        return response.json();
      })
      .then(({ hits }) => {
        const newHits = this.match(hits);
        this.setState((prevState) => ({
          gallery: [...prevState.gallery, ...newHits],
          page: page + 1,
        }));
      })
      .then(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      })
      .catch((error) => {
        this.setState({ status: "rejected" });
        console.log(error);
      });
  };

  match(arr) {
    const newArr = [];
    arr.forEach(({ id, largeImageURL, tags }) => {
      newArr.push({ id, largeImageURL, tags });
    });
    return newArr;
  }

  toggleModal = () => {
    this.setState((prevState) => ({ showModal: !prevState.showModal }));
  };

  decrementModal = () => {
    const { currentImgIdx, gallery } = this.state;
    if (currentImgIdx > 0) {
      this.setState({
        modalImgSrc: gallery[currentImgIdx - 1].largeImageURL,
        currentImgIdx: currentImgIdx - 1,
      });
    }
  };

  incrementModal = () => {
    const { currentImgIdx, gallery } = this.state;
    if (currentImgIdx < gallery.length - 1) {
      this.setState({
        modalImgSrc: gallery[currentImgIdx + 1].largeImageURL,
        currentImgIdx: currentImgIdx + 1,
      });
    }
  };

  modalOpen = (src, alt, id) => {
    this.setState({
      largeImageURL: src,
      alt,
    });
    this.toggleModal();

    this.state.gallery.map((item, idx) => {
      if (item.id === id) {
        this.setState({
          currentImgIdx: idx,
        });
      }
      return "";
    });
  };

  render() {
    const { status, gallery, showModal, largeImageURL, alt, modalImgSrc } =
      this.state;

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
          style={{ textAlign: "center", paddingTop: "20px" }}
        />
      );
    }
    if (status === "rejected") {
      return <p className={css.p} >Sorry, "{this.props.query}" not found</p>
    }
    if (status === "resolved") {
      return (
        <div className={css.wrapper}>
          {showModal && (
            <Modal
              onClose={this.toggleModal}
              onLeft={this.decrementModal}
              onRight={this.incrementModal}
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
                  onClick={this.modalOpen}
                  key={id}
                  id={id}
                />
              );
            })}
          </ul>
          <Button onClick={this.loadmore} />
        </div>
      );
    }
  }
}  
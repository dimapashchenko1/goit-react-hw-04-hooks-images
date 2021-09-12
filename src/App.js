import { Component } from 'react';
import Searchbar from './components/SearchBar/Searchbar';
import ImageGallery from './components/ImageGallery/ImageGallery';

export default class App extends Component {
  state = { searchQuery: '' };

  sendQueryInState = data => {
    this.setState(data);
  };

  render() {
    const { searchQuery } = this.state;
    return (
      <>
        <Searchbar onSubmit={this.sendQueryInState} />
        <ImageGallery query={searchQuery} />
      </>
    );
  }
}

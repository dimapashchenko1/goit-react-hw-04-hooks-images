import { useState } from 'react';
import Searchbar from './components/SearchBar/Searchbar';
import ImageGallery from './components/ImageGallery/ImageGallery';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const sendQueryInState = data => {
    setSearchQuery(data);
  };

  return (
    <>
      <Searchbar onSubmit={sendQueryInState} />
      <ImageGallery query={searchQuery} />
    </>
  );
}

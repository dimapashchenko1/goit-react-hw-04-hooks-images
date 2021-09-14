const KEY = "22667057-2dc7c959a5419833a30fef1e8";
const BASE_URL = "https://pixabay.com/api/";

export default function ImageApi(searchQuery, page) {
    const url = `${BASE_URL}?q=${searchQuery}&page=${page}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`;
  
    return fetch(url);
  }
import { Button, Form } from "react-bootstrap";
import "./index.css";
import { useCallback, useEffect, useRef, useState } from "react";
import  axios  from 'axios'

const API_URL = 'https://api.unsplash.com/search/photos'
const IMAGES_PER_PAGE = 24

function App() {
  const searchInput = useRef(null)
  const [images, setImages] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (event) => {
        event.preventDefault();
        console.log(searchInput.current.value)
        fetchImages();
        setPage(1)
  }

  const handleSelection = (selection) => {
        searchInput.current.value = selection
        fetchImages();
        setPage(1)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchImages = useCallback(async () => {
    try {
      setErrorMsg('');
      if (searchInput.current.value) {
      const { data } = await axios.get(`${API_URL}?query=${searchInput.current.value}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${import.meta.env.VITE_API_KEY}`);
      
      setImages(data.results)
      setTotalPages(data.total_pages)
      }
     } catch (error) {
       setErrorMsg('Error fetching images. Try again later.');
       console.log("Error ocurred", error)
     }
  }, [page])

  useEffect(() => {
    fetchImages();
  }, [fetchImages, page])

  return (
    <>
      <div className="container">
        <h1 className="title">Image Search</h1>
        {errorMsg && <p className='error-msg'>{errorMsg}</p>}
        <div className="search-section">
          <Form onSubmit={handleSearch}>
            <Form.Control type="text" placeholder="Search for your Image" className="search-input" 
            ref={searchInput}/>
          </Form>
        </div>

        <div className="filters">
          <div onClick={() => handleSelection('Sunset')}>Sunset</div>
          <div onClick={() => handleSelection('Pink')}>Pink</div>
          <div onClick={() => handleSelection('History')}>History</div>
          <div onClick={() => handleSelection('Colors')}>Colors</div>
        </div>
         
        <div className='images'>
            {images.map((image) => (
              <img
                key={image.id}
                src={image.urls.small}
                alt={image.alt_description}
                className='image'
              />
            ))}
        </div>

        <div className="buttons">
          {page > 1 && <Button onClick={() => setPage(page - 1)}>Previous</Button>}
          {page < totalPages && <Button onClick={() => setPage(page + 1)}>Next</Button>}
        </div>
      </div>
    </>
  );
}

export default App;

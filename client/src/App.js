import './App.css';
import React from "react"
import {FiSearch} from "react-icons/fi"

export default function App() {
    //URL of the server
    const URL = 'http://localhost:2000'

    // State Variables
    const [page, setPage] = React.useState(1)
    const [images, setImages] = React.useState([])
    const [keywords, setKeywords] = React.useState("")
    const textException = React.useRef("Make your search")

    /**
     * Function that retrieves the images from the server and handles the result.
     * If the server does not find any data with the respective keywords, it sets the textException ...
     * ... to no results found.
     */
    async function retrieveImages() {

        const res = await fetch(`${URL}/api/images?page=${page}&keywords=${keywords}`)
        const data = await res.json()
        setImages(prevImages => {
            const newImages = [...prevImages, ...data.photos.photo]
            // Before returning the newState I change the textException ref
            // This because here is the only place inside this async function where
            // I can access the most recent version of images state
            newImages.length === 0 ?
                textException.current = `No results found for "${keywords}"` :
                textException.current = ""
            return newImages
        })
    }

    // Used to fetch data from the next page of flickr when scrolling down
    React.useEffect(() => {

        //When the element is not mounted(on mount page is 1) or when we send a new submission with page 1
        //retrieveImages should not be called because it would duplicate the results on the page
        if(page !== 1) {
            retrieveImages()
        }
    }, [page])

    function handleSubmit(event) {
        // So that the page does not refresh on submit
        event.preventDefault()
        // Set the states to their initial values on a new submission
        setPage(1)
        setImages([])
        // Query the server
        retrieveImages()
    }

    //Image elements that will be displayed in the grid
    const imageElements = images.map((image, index) => {
        return (
                <img
                    className="grid--image"
                    key={image.id}
                    src={`https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg`}
                    alt={''}
                />
        )
    })

  return (
    <div>

        <h1 className="title">Search</h1>
        <form onSubmit={handleSubmit}>
            <button className="form--button"><FiSearch /></button>
            <input
                className="form--input"
                type="text"
                placeholder="Search for your favourite posts"
                onChange={(event) => setKeywords(event.target.value)}
            />
        </form>
        <hr />
        <div className="grid">
            {images.length !== 0 ? imageElements : <div className="initial-text">{textException.current}</div>}
        </div>

    </div>
  );
}

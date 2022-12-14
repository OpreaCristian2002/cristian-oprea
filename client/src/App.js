import './App.css';
import React from "react"
import Post from "./components/Post/Post"
import {FiSearch} from "react-icons/fi"

export default function App() {
    //URL of the server
    const URL = 'http://localhost:2000'

    // State Variables
    const [page, setPage] = React.useState(1)
    const numberPages = React.useRef(0)
    const [images, setImages] = React.useState([])
    const [keywords, setKeywords] = React.useState("")
    const [displayImage, setDisplayImage] = React.useState(null)
    const [textException, setTextException] = React.useState("Make your search")

    /**
     * Function that retrieves the images from the server and handles the result.
     * If the server does not find any data with the respective keywords, it sets the textException ...
     * ... to no results found and if there is an error with the fetch it sets it to something went wrong.
     */
    async function retrieveImages() {

        // Error handling - In case the server returns an error status or there
        // is an error with the fetch, "Something went wrong" is displayed on the screen
        const data = await fetch(`${URL}/api/images?page=${page}&keywords=${keywords}`)
            .then(res => {
                if(res.ok) {
                    return res.json()
                } else {
                    return Promise.reject(res)
                }
            })
            .catch((err) => {
                setTextException("Something went wrong")
            })

        if(!data) return

        // Check if there are no results and update the exception text
        data.photos.pages === 0 ?
            setTextException(`No results found for "${keywords}"`) :
            setTextException("")

        if(page === 1) numberPages.current = data.photos.pages

        setImages(data.photos.photo)
    }

    // Used to fetch data from the next page of flickr when clicking the button
    // Initially wanted to have an infinte scroll instead of buttons. Leaving the solution
    // as is in case it is implemented in the future.
    React.useEffect(() => {

        //When the element is not mounted(on mount the textException is "Make your search") or when we send a new submission with page 1
        //retrieveImages should not be called because it would duplicate the results on the page
        if(textException !== "Make your search") {
            retrieveImages()
        }
    }, [page])

    function handleSubmit(event) {
        // So that the page does not refresh on submit
        event.preventDefault()
        // Set the states to their initial values on a new submission
        setPage(1)
        setImages([])
        numberPages.current = 0
        // Query the server
        retrieveImages()
    }

    /**
     * This function sets the image to be displayed in the middle of the screen
     * @param index - index of the image inside the the images array
     */
    function handleDisplay(index) {
        setDisplayImage(images[index])
    }

    //Image elements that will be displayed in the grid
    const imageElements = images.map((image, index) => {
        return (
                <img
                    draggable="false"
                    className={displayImage ? "grid--image" : "grid--image hover"}
                    key={image.id}
                    src={`https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg`}
                    alt={''}
                    onClick={() => handleDisplay(index)}
                />
        )
    })

  return (
    <>
        {/*Added a wrapper so that when the image opens the background gets blurred*/}
        <div className={displayImage ? "blur" : ""}>
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
                {images.length !== 0 ? imageElements : <div className="initial-text">{textException}</div>}
            </div>

            {/*Buttons for scrolling through the pages of a query*/}
            {images.length !== 0 &&
                <div className = "page--button--wrapper">
                    <button
                        className = "page--button"
                        onClick = {() => setPage(prev => prev - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <button
                        className = "page--button"
                        onClick= {() => setPage(prev => prev + 1)}
                        disabled={page === numberPages.current}
                    >
                        Next
                    </button>
                </div>
            }
        </div>

        {/*The post is a sibling of the rest of the app so that it does not get blurred as well*/}
        {displayImage &&
            <Post
                image={displayImage}
                setImage={setDisplayImage}
        />
        }
    </>
  );
}

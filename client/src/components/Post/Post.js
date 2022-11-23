import './Post.css';
import React from "react"

export default function Post(props) {
    // URL of the server
    const URL = 'http://localhost:2000'

    // Props and state variables
    const image = props.image
    const [imageInfo, setImageInfo] = React.useState(null)

    React.useEffect(() => {
        // Retrieve more detailed information about the image
        async function retrieveImageInfo() {
            const res = await fetch(`${URL}/api/images/${image.id}`)
            const data = await res.json()
            setImageInfo(data.photo)
        }

        // When the image appears, I want the scrolling to be locked, thus after the object ...
        // ... is rendered I increase the padding of the body by the width of the scroll ...
        // ... such that when the scroll disappears, the body does not shift to occupy the extra space
        const scrollBarCompensation = window.innerWidth - document.body.offsetWidth
        document.body.style.paddingRight = `${30 + scrollBarCompensation}px`;
        document.body.style.overflow = 'hidden'

        retrieveImageInfo()

        // When the object is unmounted we reset those properties to their initial values
        return () => {
            document.body.style.overflow = 'unset'
            document.body.style.paddingRight = '30px'
        }
    },[])

    function formatDate(timestamp) {
        const options = {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric"
        }
        const date = new Date(timestamp)
        return date.toLocaleDateString('en-uk', options)
    }

    return (
        // I want the image to be closed when clicking outside. Unfortunately it is a hastle to create ...
        // ... an outside click event, therefore I create a transparent wrapper spanning the full page ...
        // and use it as an outside click detector
        <div
            data-testid={"post-element"}
            className="post--wrapper"
            onClick={() => props.setImage(null)}
        >
          <div className="post">
              {/*Top part of the post (profile-pic, username and date)*/}
              <div className="post--top">
                <img
                    className="profile--picture"
                    src={imageInfo ?
                        `http://farm${imageInfo.owner.iconfarm}.staticflickr.com/` +
                        `${imageInfo.owner.iconserver}/buddyicons/${imageInfo.owner.nsid}.jpg`:
                        ""}
                />
                <div>
                    {imageInfo && <div className="username">{imageInfo.owner.username}</div>}
                    {imageInfo && <div className="date">{formatDate(imageInfo.dates.taken)}</div>}
                </div>
              </div>

              {/*Description of the post*/}
              {imageInfo && <div className="post--description">{imageInfo.description._content}</div>}

              {/*Image itself*/}
              <img
                  className="post--image"
                  draggable="false"
                  src={`https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`}
                  alt='Could not find the image'
              />

          </div>
        </div>
    );
}
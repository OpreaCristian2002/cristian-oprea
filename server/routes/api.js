const express = require("express")
const axios = require('axios')

let router = express.Router();

//Configure the .env file
require('dotenv').config();

//URL to access flickr API
const URL = "https://www.flickr.com/services/rest/"


/**
 * This route returns data about at most 20 images at a time in a json format.
 * It calls the Flickr API. To check what data it returns visit the sites below
 * If you provided keywords visit: https://www.flickr.com/services/api/flickr.photos.search.html
 * If keywords does not exist visit: https://www.flickr.com/services/api/flickr.photos.getRecent.html
 */
router.route("/images")
    .get((req, res) => {
        const {keywords, page} = req.query

        // In case page does not exist or is not a number, bad request
        if(!page || isNaN(page)) {
            res.status(400)
            res.send("Server did not receive the correct query parameters")
            return;
        }

        let params = {
            "api_key": process.env.FLICKR_KEY,
            "page": page,
            "format": "json",
            "nojsoncallback": "1",
            "safe_search": "1",
            "per_page": "20"
        }

        if(keywords) {
            //In case keywords exists, we query based on the keywords
            params = {
                ...params,
                "text": keywords,
                "method": "flickr.photos.search"
            }
            axios.get(URL ,{"params": params})
                .then(response => {
                    res.status(response.status)
                    res.send(JSON.stringify(response.data))
                })
                .catch(error => {
                    console.log(error)
                    res.status(404)
                    res.send("Internal Server Error")
                })
        }
        else {
            //In case keywords does not exist, we query the most recent photos
            params = {
                ...params,
                "method": "flickr.photos.getRecent"
            }
            axios.get(URL, {"params": params})
                .then(response => {
                    res.status(response.status)
                    res.send(JSON.stringify(response.data))
                })
                .catch(error => {
                    console.log(error)
                    res.status(404)
                    res.send("Internal Server Error")
                })
        }

    })

/**
 * This route, given a photo id, returns more extensive information about a single photo
 * It calls the Flickr API.
 * To check what data it returns visit: https://www.flickr.com/services/api/flickr.photos.getInfo.html
 */
router.route("/images/:photoId")
    .get((req, res) => {
        // If no photo id is provided, it is a bad request
        const photoId = req.params.photoId;
        if(!photoId || isNaN(photoId)) {
            res.status(400)
            res.send("Server did not receive the correct query parameters")
            return;
        }

        const params = {
            "method": "flickr.photos.getInfo",
            "api_key": process.env.FLICKR_KEY,
            "photo_id": photoId,
            "format": "json",
            "nojsoncallback": "1",
        }

        axios.get(URL, {"params": params})
            .then(response => {
                res.status(response.status)
                res.send(JSON.stringify(response.data))
            })
            .catch(error => {
                console.log(error)
                res.status(404)
                res.send("Internal Server Error")
            })
    })

/**
 * WIP: Related to a could have
 */
// router.route("/comments")
//     .get((req, res) => {
//         res.status(200)
//         res.send("Hello World Comments!")
//     })

module.exports = router
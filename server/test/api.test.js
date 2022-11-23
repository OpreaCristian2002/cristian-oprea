const request = require('supertest')
const app = require('../app')
//Mock axios so we do not call the flickr API directly
const axios = require('axios')
jest.mock('axios')

const URL = "https://www.flickr.com/services/rest/"

describe("GET /api/images", () => {

    it("API call has keywords parameter and is successfull", async () => {
        //Arrange
        const resultMock = {
            status: 200,
            data: [
                {id: 1, "title": "Title 1"},
                {id: 2, "title": "Title 2"}
            ]
        }
        //Return the mocked value
        axios.get.mockResolvedValueOnce(Promise.resolve(resultMock));
        const keywords = "dog"
        const page = "1"

        //Act
        const response = await request(app).get("/api/images")
            .query({"keywords": keywords, "page": page})

        //Assert
        expect(JSON.parse(response.text)).toEqual(resultMock.data)
        expect(axios.get).toHaveBeenCalledWith(URL, {"params":
                {
                    "api_key": process.env.FLICKR_KEY,
                    "format": "json",
                    "method": "flickr.photos.search",
                    "nojsoncallback": "1",
                    "page": page,
                    "per_page": "20",
                    "safe_search": "1",
                    "tags": keywords}
        })
    })

    it("API call does not have keywords and is successfull", async () => {

        //Arrange
        const resultMock = {
            status: 200,
            data: [
                {id: 1, "title": "Title 1"},
                {id: 2, "title": "Title 2"}
            ]
        }
        //Return the mocked value
        axios.get.mockResolvedValueOnce(Promise.resolve(resultMock));
        const page = "2"

        //Act
        const response = await request(app).get("/api/images")
            .query({"page": page})

        //Assert
        expect(JSON.parse(response.text)).toEqual(resultMock.data)
        expect(axios.get).toHaveBeenCalledWith(URL, {"params":
                {
                    "api_key": process.env.FLICKR_KEY,
                    "format": "json",
                    "method": "flickr.photos.getRecent",
                    "nojsoncallback": "1",
                    "page": page,
                    "per_page": "20",
                    "safe_search": "1",}
        })
    })

    it("API call fails because there is no page number", async () => {
        //Act
        const response = await request(app).get("/api/images")

        //Assert
        expect(response.statusCode).toBe(400)
    })

    it("API call fails because the page is not a number", async () => {
        //Act
        const response = await request(app).get("/api/images").query({"page": "abc"})

        //Assert
        expect(response.statusCode).toBe(400)
    })
})

describe("GET information about a single image /api/images/:photoId", () => {
    it("API call is successful", async () => {
        //Arrange
        const resultMock={
            "status": 200,
            "data": {
                "photoId": "123",
                "title": "Title 1"
            }
        }
        //Return the mocked value
        axios.get.mockResolvedValueOnce(Promise.resolve(resultMock))
        const photoId = "123"

        //Act
        const response = await request(app).get(`/api/images/${photoId}`)

        //Assert
        expect(JSON.parse(response.text)).toEqual(resultMock.data)
        expect(axios.get).toHaveBeenCalledWith(URL, {"params":
                {
                    "api_key": process.env.FLICKR_KEY,
                    "format": "json",
                    "method": "flickr.photos.getInfo",
                    "nojsoncallback": "1",
                    "photo_id": photoId,
                    }
        })
    })

    it("API call fails because there is no photoId", async () => {
        //Act
        const response = await request(app).get("/api/images")

        //Assert
        expect(response.statusCode).toBe(400)
    })

    it("API call fails because the photoId is not a number", async () => {
        //Act
        const response = await request(app).get("/api/images/abc")

        //Assert
        expect(response.statusCode).toBe(400)
    })

})
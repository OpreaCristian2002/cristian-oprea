const express = require('express')
const cors = require('cors')
const app = express()
const api = require("./routes/api")


//Use CORS mechanism on the server
app.use(cors())

//Route /api endpoints
app.use("/api", api);

app.listen(process.env.PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port " + process.env.PORT)
    else
        console.log("Error occurred, server can't start", error);
    }
);

module.exports = app
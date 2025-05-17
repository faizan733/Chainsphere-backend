
const express =require("express");
const app = express();

app.use(express.json());
require("dotenv").config();
const PORT = process.env.PORT || 8000;


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const apiRoutes = require("./routes/api");

app.use("/api",apiRoutes);


app.listen(PORT,() =>{
    console.log(`server started successfully at port number ${PORT}`);
})

// connect to the database
const dbConnect =require("./config/database");
dbConnect();


// default route
app.get("/",(req,res) => {
    res.send(`<h1>this is homepage</h1>`)
})
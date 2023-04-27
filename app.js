require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const { serialize } = require("v8")
const encrypt = require("mongoose-encryption")

const app = express()

app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(express.static("public"))

app.set("view engine", "ejs")

mongoose.connect("mongodb://127.0.0.1:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const secret = process.env.SECRET
userSchema.plugin(encrypt, {secret: secret , encryptedFields: ["password"] })

const User = mongoose.model("User", userSchema)

app.get("/", function(req, res){
    res.render("home")
})

app.get("/login", function(req, res){
    res.render("login")
})


app.get("/register", function(req, res){
    res.render("register")
})

app.post("/register", function(req, res){
 
    const userName = req.body.username
    const password = req.body.password

    const newUser = new User({
        email: userName,
        password: password
    })

    newUser.save().catch(err => {
        console.log(err);
    }).then(()=> {
        res.render("secrets")
    })

})

app.post("/login", function(req, res){

    const userName = req.body.username
    const password = req.body.password

    User.findOne({email: userName}).catch(err => {
        console.log(err);
    }).then((userFound) => {
    
        if(userFound){
            if( userFound.password === password){
                res.render("secrets")
            }
        }

    })

})




app.listen("3000", function(){
    console.log("Server is running on port 3000");  
})
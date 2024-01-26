require('./models/db');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const reg = require('./models/regmodel');

app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.get("/", (req, res) => {
    res.render('registration')

})

const bcrypt = require('bcrypt');

app.post("/register", async (req, res) => {
    try {
        const { name, email, phonenumber, address, password, confirmpassword } = req.body;

       
        if (!name || !email || !phonenumber || !address || !password || !confirmpassword) {
            return res.status(400).send("All fields are required");
        }

    
        if (password !== confirmpassword) {
            return res.status(400).send("Passwords do not match");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const registerStd = new reg({
            name,
            email,
            phonenumber,
            address,
            password: hashedPassword,
            confirmpassword: hashedPassword,
        });
        const registered = await registerStd.save();
        res.status(201).send('Registered Succesfully')

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(3000, () => {
    console.log("server is Running")
})

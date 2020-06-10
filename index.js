const express = require('express');
const app = express();
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')


mongoose.connect('mongodb+srv://danPark:kAAV.Ss$kB8A8b5@mern-practice.bsft5.mongodb.net/<dbname>?retryWrites=true&w=majority', 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('DB connected'))
    .catch(err => console.error(err))


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.listen(5000)


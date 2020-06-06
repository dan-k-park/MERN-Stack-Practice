const express = require('express');
const app = express();
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://danPark:kAAV.Ss$kB8A8b5@mern-practice.bsft5.mongodb.net/<dbname>?retryWrites=true&w=majority', 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('DB connected'))
    .catch(err => console.error(err))

app.get('/', (req, res) => {
  res.send('hi')
})

app.listen(5000)


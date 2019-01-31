const express = require('express');
const app = express();
app.set('view engine', 'pug');
const port = 3000;


const server = app.listen(port, () => {
  console.log(`Express running on PORT ${port}`);
});

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Home'
  });
});

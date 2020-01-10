/*
 ____
|,--.| Created by:
||__|| Grayson Doshier
|+  o| 
|,'o | Language: Javascript
`----' File: index.js
*/

const express = require('express');
const app = express();
app.set('view engine', 'pug');
const port = 3000;

app.use(express.static('assets'));
app.use(express.static('semantic'));

const server = app.listen(port, () => {
  console.log(`Express running on PORT ${port}`);
});

/*
-= App Routes =-
*/

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Home'
  });
});

app.get('*', (req, res) => {
  res.render('err404', {
    title: 'Error 404'
  })
});
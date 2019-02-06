const express = require('express');
const app = express();
app.set('view engine', 'pug');
const port = 3000;

app.use(express.static('assets'));

const server = app.listen(port, () => {
  console.log(`Express running on PORT ${port}`);
});

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Home'
  });
});

app.get('/software', (req, res) => {
  res.render('software', {
    title: 'Software'
  })
})

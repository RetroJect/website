/*
 ____
|,--.| Created by:
||__|| Grayson Doshier
|+  o| 
|,'o | Language: Javascript
`----' File: index.js
*/

/*
-= Requires =-
*/

const GitHub = require('github-api');
const express = require('express');


/*
-= GitHub Setup =-
*/
var gh = new GitHub();
var me = gh.getUser('RetroJect');
var repoData = new Array();

// Get a list of my repositories sorted by date last pushed
function getRepos() {
  me.listRepos({ sort: 'pushed' }, (err, repos) => {
    if (err) {
      console.log(err)
    } else {
      for (var i = 0; i < repos.length; i++) {
        var pushedDate = new Date(repos[i]['pushed_at']);
        var createdDate = new Date(repos[i]['created_at']);
        var dateOpts = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        }
        repoData.push({
          url: repos[i]['svn_url'],
          pushed: pushedDate.toLocaleString("en-US", dateOpts),
          created: createdDate.toLocaleString('en-US', dateOpts),
          name: repos[i]['full_name'],
          description: repos[i]['description']
        })
      }
    }
  });
  // Take repos[#].svn_url and repos[#].pushed_at
}

getRepos();


/*
-= Express Setup =-
*/
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
    title: 'Home',
    data: repoData
  });
});

app.get('*', (req, res) => {
  res.render('err404', {
    title: 'Error 404'
  })
});
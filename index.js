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
const datediff = require('date-diff');


/*
-= GitHub Setup =-
*/
var gh = new GitHub();
var me = gh.getUser('RetroJect');
var repoData = new Array();
var dateOpts = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZoneName: 'long'
}

// Get a list of my repositories sorted by date last pushed
function getRepos() {
  me.listRepos({ sort: 'pushed' }, (err, repos) => {
    if (err) {
      console.log(err)
    } else {
      delete repoData;
      repoData = new Array();
      for (var i = 0; i < repos.length; i++) {
        var pushedDate = new Date(repos[i]['pushed_at']);
        var createdDate = new Date(repos[i]['created_at']);

        // Get difference between last push and now
        var now = new Date();
        now.getDate();
        var ddiff = new datediff(now, pushedDate);

        var diff = "";
        if(ddiff.seconds() < 60){
          diff = 'seconds';
        } else if(ddiff.seconds() < 3600){
          diff = 'minutes';
        } else if(ddiff.seconds() < 86400){
          diff = 'hours';
        } else if(ddiff.seconds() < 2678400){
          diff = 'days';
        } else if(ddiff.seconds() < 32140800){
          diff = 'months';
        } else {
          diff = 'years';
        }

        repoData.push({
          url: repos[i]['svn_url'],
          pushed: pushedDate.toLocaleString("en-US", dateOpts),
          created: createdDate.toLocaleString('en-US', dateOpts),
          name: repos[i]['full_name'],
          description: repos[i]['description'],
          avatar: repos[i]['owner']['avatar_url'],
          difference: diff
        })
      }
    }
  });
}

getRepos();
setInterval(getRepos, 600000)


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

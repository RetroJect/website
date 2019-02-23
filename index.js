const express = require('express');
const app = express();
app.set('view engine', 'pug');
const port = 3000;

const request = require('request');
const getOptions = {
  json: true,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
  }
}
const fs = require('file-system');
const logFile = "logs/main.log";

const showdown = require('showdown');
var converter = new showdown.Converter();

//Variables for Software View
var repositories = [];
var readmes = [];
var readmeHtml = [];


app.use(express.static('assets'));

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

app.get('/software', (req, res) => {
  res.render('software', {
    title: 'Software',
    repos: JSON.stringify(repositories),
    readmes: JSON.stringify(readmeHtml)
  })
});

app.get('/resume', (req, res) => {
  res.redirect('/resume.pdf');
})

app.get('*', (req, res) => {
  res.render('err404', {
    title: 'Error 404'
  })
});

function fileError(error) {
  console.log("Couldn't write to file!");
  console.log("Error: "+error);
}

//Writes strings to a file. Not very interesting
function writeLog(message) {
  var date = new Date();
  var dateString = date.toString();
  var output = `[${dateString}] ${message}\n`;
  fs.appendFile(logFile, output, {flag: 'a'}, function(err){
    if(err){
      fileError(err);
    }
  })
}

//Writes Repositories and READMEs out to files for later
function cache() {
  fs.writeFile("cache/repositories.json", JSON.stringify(repositories), (error) => {
    if(error){
      fileError(error);
    }
  });

  fs.writeFile("cache/readmes.json", JSON.stringify(readmes), (error) => {
    if(error){
      fileError(error);
    }
  });

  if(readmes.length != 0){
    //Changes GitHub markdown to html and creates objects
    for(var j=0; j<readmes.length; j++){
      readmeHtml.push(converter.makeHtml(readmes[j]));
    }
    if(readmeHtml.length != 0){
      writeLog('Generated HTML from READMEs');
    }
  }

}

//Gets Info about my repositories from GitHub API
function getData() {
  writeLog("Getting JSON for Repositories");
  request("https://api.github.com/users/RetroJect/repos", getOptions, (err, res, body) => {
    if(err){
      return console.log(err);
    }
    repositories = body;
  });

  //Gets README raw data from GitHub
  writeLog("Getting READMEs for repositories");
  readmes = [];
  readmeHtml = [];
  for(var i=0; i<repositories.length; i++){
    var url = "https://raw.githubusercontent.com/RetroJect/"+repositories[i].name+"/master/README.md";
    request(url, {headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'} }, (err, res, body) => {
      if(err){
        return console.log(err);
      }
      readmes.push(body);
    })
    writeLog(`Collected README for ${repositories[i].name}`);
  }

  setTimeout(cache, 5000);
}


//Half Hour: 1800000
//Hour: 3600000
//6 Minutes: 360000
setInterval(getData, 1800000);

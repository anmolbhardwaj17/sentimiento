var express = require("express");
const app = express();


var Sentiment = require("sentiment");
var sentiment = new Sentiment();

var Twit = require('twit');
require('dotenv').config();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
const bodyParser = require('body-parser');

app.use(bodyParser.json())
.use(bodyParser.urlencoded({
        extended: true
}));



//var congressCounter = 0;

var T = new Twit({
    consumer_key:         process.env.API_KEY,
    consumer_secret:      process.env.API_SECRET_KEY,
    access_token:         process.env.ACCESS_TOKEN,
    access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
  })

  app.get('/', (req, res)=>{
    res.render("home")
  })

  app.post('/', (req, res)=>{
    var singleArr = [];
var singleCounter = 0;
    const {topic} = req.body;

    T.get('search/tweets', { q: topic, count: 100 }, function(err, data, response) {
        var noOfTweets = Object.keys(data.statuses).length;
        for(let i = 0;i<noOfTweets;i++){
            var info = data.statuses[i].text;
            singleArr.push(info);
        }
        singleArr.forEach(function(s){
            var x = sentiment.analyze(s);
            if(x.score < 0){
                singleCounter--;
            }
            if(x.score > 0){
                singleCounter++;
            }
        })
        
        //text = data.statuses[0].text;
        res.render("results", {topic, singleCounter, noOfTweets});
        //console.log(sentiment.analyze(text))
      })
  })



// var mydocx = ["I love apples", "I don't eat pepper","I like cars but dislike veggies","annoy fuck bitch niggas"]

// mydocx.forEach(function(s){
//     console.log(sentiment.analyze(s))
// })

app.listen(process.env.PORT, function(){
    console.log(`Running on port ${process.env.PORT}`)
})



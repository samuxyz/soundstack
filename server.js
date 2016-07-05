var express = require('express');
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();

//Log with Morgan
app.use(morgan('dev'));

//parse application/json and look for raw text                                        
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

//configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

//Static files
app.use(express.static(__dirname + '/public')); 

//array to temporary store docs
var songsList = [
	{ id: 0, uuid: "uuid", converted:true, title: "Daft Punk - Get Lucky", user:"Samuele Zaza", url: "https://cdn.filestackcontent.com/19zTQzteSeysRGUyWgIZ", favorite: 1908, repost: 767, times:"480K", cover:"http://www.bad-boy.it/wp-content/uploads/2013/05/Daft-Punk-Random-Access-Memories-cd-cover.png"},
	{ id: 1, uuid: "uuid", converted:true, title: "Earth Wind and Fire - Let's Groove", user:"Pat Matthews", url: "https://cdn.filestackcontent.com/19zTQzteSeysRGUyWgIZ", favorite: 895, times:"100K", repost: 470, cover:"https://upload.wikimedia.org/wikipedia/en/c/c9/Earth,_Wind_%26_Fire_-_Raise.jpg"},
	{ id: 2, uuid: "uuid", converted:true, title: "Stevie Wonder - I Wish", user:"Bethany Stachenfeld", url: "https://cdn.filestackcontent.com/19zTQzteSeysRGUyWgIZ", favorite: 1500, times:"568K", repost: 1000, cover:"https://upload.wikimedia.org/wikipedia/en/e/e2/Songs_in_the_key_of_life.jpg"},
	{ id: 3, uuid: "uuid", converted:true, title: "Luther Vandross - Here and Now", user:"Joseph Palumbo", url: "https://cdn.filestackcontent.com/19zTQzteSeysRGUyWgIZ", favorite: 734, times:"19K", repost: 159, cover:"https://images-na.ssl-images-amazon.com/images/I/51-HveTVRFL.jpg"},
	{ id: 4, uuid: "uuid", converted:true, title: "The Chainsmokers - Wonder", user:"Joseph Palumbo", url: "https://cdn.filestackcontent.com/19zTQzteSeysRGUyWgIZ", favorite:433, times:"50K", repost: 246, cover:"http://www.worldofhouse.com/images/tracks/28442/500_500/adventure-club-wonder-the-chainsmokers-remix.jpg"},
	{ id: 5, uuid: "uuid", converted:true, title: "Franz Ferdinand - Take Me Out", user:"Pat Matthews", url: "https://cdn.filestackcontent.com/19zTQzteSeysRGUyWgIZ", favorite:1160, times:"150K", repost: 907, cover:"https://upload.wikimedia.org/wikipedia/en/5/52/Franz_Ferdinand_-_Take_Me_Out.jpg"},
	{ id: 6, uuid: "uuid", converted:true, title: "Foster the People - Pumped up Kicks", user:"Samuele Zaza", url: "https://cdn.filestackcontent.com/19zTQzteSeysRGUyWgIZ", favorite:2456, times:"850K", repost: 1978, cover:"https://upload.wikimedia.org/wikipedia/en/e/ed/PumpedUpKicks.jpg"},
	{ id: 7, uuid: "uuid", converted:true, title: "Mark Ronson - Uptown Funk ft. Bruno Mars", user:"Samuele Zaza", url: "https://cdn.filestackcontent.com/19zTQzteSeysRGUyWgIZ", favorite:1479, times:"1M", repost: 2458, cover:"http://loudersoft.com/wp-content/uploads/2014/11/mark-bruno.jpg"}	
];

var filestackResponse;
app.route('/soundstack')
	.get(function(req, res){
		var songsListReverse = songsList.filter(function(song){ return song.converted === true }).slice();
		res.json(songsListReverse.reverse());
	})
	.post(function(req, res){
		var song = {
			id : songsList.length,
			uuid: req.body.uuid,
			title: req.body.title,
			user: req.body.user,
			url: "",
			converted: false,
			favorite: parseInt(Math.random() * 4000 + 1000),
			repost: parseInt(Math.random() * 3000 + 1000),
			times: "134K",
			cover: "http://www.progarchives.com/progressive_rock_discography_covers/5084/cover_1729101022014_r.jpg"
		};
		songsList = songsList.concat([song]);
		res.json({ message: "Successfully added!"});	
	});
app.route('/convert')
	.post(function(req, res){
		var response = req.body;
		if(response.hasOwnProperty("status") && response.status === "completed"){
			uuid = response.uuid;
			songsList.forEach(function(song, index){
				if(song.uuid === response.uuid) 
					song.url = response.data.url;
					song.converted = true;

			});
		}
		filestackResponse = response;
	})
	.get(function(req,res){
		res.json({response: filestackResponse});
	})
app.listen(port);
console.log('listening on port ' + port);
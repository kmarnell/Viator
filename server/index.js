const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const User = require('../database/index');
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const request = require('request');
const GooglePlaces = require('googleplaces');

// Config variables
const G_ID = process.env.G_ID || require('./config').G_ID;
const G_SECRET = process.env.G_SECRET || require('./config').G_SECRET;
const G_URL = process.env.G_URL || 'http://localhost:1337/auth/google/callback';
const SESSION_SECRET = process.env.SESSION_SECRET || require('./config').SESSION_SECRET;
const GOOGLE_KEY = process.env.GOOGLE_KEY || require('./config').GOOGLE_KEY;
const DARK_SKY_KEY = process.env.DARK_SKY_KEY || require('./config').DARK_SKY_KEY;
const FLIGHT_API_KEY = process.env.FLIGHT_API_KEY || require('./config').FLIGHT_API_KEY;
const FLIGHT_APP_KEY = process.env.FLIGHT_APP_KEY || require('./config').FLIGHT_APP_KEY;

const place = new GooglePlaces(GOOGLE_KEY, 'json');

app.use(express.static(__dirname + '/../react-client/dist'));

var userId;
// check if user has saved data
var userIdCheck = false;
var checkUser = () => {
  User.find({user: userId}).exec((err,result) => {
    if(err) {
      console.log('Get did not return data');
    } else {
      if (typeof result[0] === 'object') {
        userIdCheck = true;
      } else {
        userIdCheck = false;
      }
    }
  });
}


// Passport/Auth
passport.use(new GoogleStrategy({
    clientID: G_ID,
    clientSecret: G_SECRET,
    callbackURL: G_URL
  },
  (accessToken, refreshToken, profile, done) => {
      userId = profile.id;
      checkUser();
    User.findOrCreate({ googleId: profile.id }, (err, user) => {
      return done(err, user);
    });
  }
));
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({ secret: SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/../react-client/dist/index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '/../react-client/dist/index.html'));
})

app.get('/sign-in', (req, res) => {
  res.sendFile(path.join(__dirname, '/../react-client/dist/index.html'));
})

app.get('/trip', (req, res) => {
  res.sendFile(path.join(__dirname, '/../react-client/dist/index.html'));
})

// Auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/sign-in' }),
  (req, res) => {
    if (userIdCheck === true) {
      res.redirect('/dashboard');
    } else {
      res.redirect('/trip');
    }
  });

// API routes
app.get('/geoLocation', (req, res) => {
  let _url = `https://maps.googleapis.com/maps/api/geocode/json?address=${position}&key=AIzaSyCTNveTrF9YoS4qDvdHF9K0kH69zUcbWyU`; 
  console.log('index.js /geoLocation', req.body);
 
});

app.get('/weather', (req, res) => {
  // Call Geocoding API for coordinates based on location
  const getCoords = new Promise((resolve, reject) => {
    request.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_KEY}&address=${req.query.location || 'San Francisco'}`,
    (error, response, body) => {
      if (error) console.error(error);
      resolve(JSON.parse(body).results[0].geometry.location);
    });
  });
  getCoords.then(coords => {
    // Use coordinates to get weather forecast
    request.get(`https://api.darksky.net/forecast/${DARK_SKY_KEY}/${coords.lat},${coords.lng}?exclude=[minutely,hourly]`,
    (error, response, body) => {
      if (error) console.error(error);
      res.send(JSON.parse(body).daily.data);
    });
  });
});

app.get('/events', (req, res) => {
  var location = req.query.location
  console.log(location);
  request.get(`https://www.eventbriteapi.com/v3/events/search/?token=UHLKIOWHWZNIOUNFTLKN&sort_by=distance&location.address=${location}&categories=109%2C133%2C110&location.within=10mi&start_date.keyword=this_week`, (error, response, body) => {
    if (error) console.error(error);
    body = JSON.parse(body);
    var events = body.events
    var eventData = {}
    dataLength = 10
    currentIndex = 0
    validData = true
    while(dataLength > 0 && validData) {
      var eventObj = {}
      eventObj["description"] = events[currentIndex].name.text
      eventObj["url"] = events[currentIndex].url
      if (events[currentIndex].logo) {
        eventObj["img"] = events[currentIndex].logo.url
        eventData[currentIndex] = eventObj
        dataLength--
     }
     if (!events[currentIndex + 1]) {
       validData = false
     }
     currentIndex++
    }
    res.send(eventData)
  })
})

app.get('/sights', (req, res) => {
  let params = {
    query: `${req.query.location || 'San Francisco'} attractions`
  };
  // Call Places API to get array of sights
  const getSights = new Promise((resolve, reject) => {
    place.textSearch(params, (err, res) => {
      if (err) console.error(err);
      resolve(res.results);
    });
  });
  getSights.then(sights => {
    // Create array of promises that gets details for each sight
    let promiseArr = sights.map((sight) => {
      return new Promise((resolve, reject) => {
        place.placeDetailsRequest({ placeid: sight.place_id }, (err, res) => {
          if (err) console.error(err);
          sight.url = res.result.url;
          if ( sight.photos ) {
            sight.img = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + sight.photos[0].photo_reference + '&key=' + GOOGLE_KEY;
          } else {
            sight.img = '';
          }
          resolve(sight);
        });
      });
    });
    // Send response with sights after all promises resolve
    Promise.all(promiseArr).then(sights => {
      res.send(sights);
    });
  });
});

app.get('/food', (req, res) => {
  let params = {
    query: req.query.location || 'San Francisco',
    type: 'restaurant'
  };
  // Call Places API to get array of restaurants
  const getRestaurants = new Promise((resolve, reject) => {
    place.textSearch(params, (err, res) => {
      if (err) console.error(err);
      resolve(res.results);
    });
  });
  getRestaurants.then(restaurants => {
    // Create array of promises that gets details for each restaurant
    promiseArr = restaurants.map((restaurant) => {
      return new Promise((resolve, reject) => {
        place.placeDetailsRequest({ placeid: restaurant.place_id }, (err, res) => {
          if (err) console.error(err);
          restaurant.url = res.result.url;
          if ( restaurant.photos ) {
            restaurant.photo = `https://maps.googleapis.com/maps/api/place/photo?maxheight=100&photoreference=${restaurant.photos[0].photo_reference}&key=${GOOGLE_KEY}`;
          } else {
            restaurant.photo = '';
          }
          resolve(restaurant);
        });
      });
    });
    // Send response with restaurants after all promises resolve
    Promise.all(promiseArr).then(restaurants => {
      res.send(restaurants);
    });
  });
});

app.get('/flightStatus', (req, res) => {
  request.get(`https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/${req.query.airline}/${req.query.flight}/arr/${req.query.year}/${req.query.day}/${req.query.month}?appId=${FLIGHT_API_KEY}&appKey=${FLIGHT_APP_KEY}&utc=false`,
  (error, response, body) => {
    if (error) console.error(error);
    console.log(JSON.parse(body));
    res.send(JSON.parse(body));
  });
})


// FOR ADDING DATA INTO THE DATEBASE

app.post('/database/save', (req, res) => {

    var dateTotal = req.body.date;
    var monthOnly;
    var dayOnly;
    var yearOnly;

    yearOnly = dateTotal.slice(0,4);
    dayOnly = Number(dateTotal.slice(5,7)).toString();
    monthOnly = Number(dateTotal.slice(8,10)).toString();
    userId = userId.toString();

    const addNew = new User({
      user: userId,
      month: monthOnly,
      day: dayOnly,
      year: yearOnly,
      Airline: req.body.airline,
      flight: req.body.flightNumber,
      destination: req.body.finalDestination
    })

    addNew.save((err,result) => {
      if (err) {
        console.log('did not save');
      } else {
        console.log('history saved', result);
      }
    })
    res.end();
});

// RETURNS LIST OF THE USERS HISTORY
app.get('/database/return', (req,res) => {
  User.find({user: userId}).limit(10).exec((err,result) => {
    if(err) {
      console.log('Get did not return data');
    } else {
      result = result.reverse();
      res.json(result);
    }
  })

})

app.get('/flightDuration', (req, res) => {
  request.get(`https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/${req.query.airline}/${req.query.flight}/arr/${req.query.year}/${req.query.day}/${req.query.month}?appId=${FLIGHT_API_KEY}&appKey=${FLIGHT_APP_KEY}&utc=false`,
  (error, response, body) => {
    if (error) console.error(error);
    res.send(JSON.parse(body));
  });
})


const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log('Listening on port', port);
});

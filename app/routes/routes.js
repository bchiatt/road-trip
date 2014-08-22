'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    less           = require('less-middleware'),
    home           = require('../controllers/home'),
    stops          = require('../controllers/stops'),
    trips          = require('../controllers/trips');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(less(__dirname + '/../static'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());

  app.get('/', home.index);
  app.get('/about', home.about);
  app.get('/contact', home.contact);
  app.get('/faq', home.faq);
  app.get('/trips/new', trips.new);
  app.get('/trips/:tripId', trips.show);
  app.post('/trips/', trips.create);
  app.get('/trips/', trips.index);
  app.get('/trips/:tripId/stops/:stopId', stops.show);
  app.post('/trips/:tripId/stops/:stopId/photo', stops.addPhoto);
  app.get('/trips/:tripId/stops/:stopId/event', stops.addEvent);
  app.post('/trips/:tripId/stops/', stops.create);

  console.log('Express: Routes Loaded');
};


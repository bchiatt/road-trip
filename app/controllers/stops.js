'use strict';

var Stop = require('../models/stop.js');

exports.create = function(req, res){
  Stop.create(req.body, function(err){
    res.redirect('/trips/'+req.params.tripId);
  });
};

exports.show = function(req, res){
  Stop.findById(req.params.stopId, function(err, stop){
    res.render('stops/show', {stop:stop});
  });
};

exports.addPhoto = function(req, res){
  res.redirect('/trips/:id/stops');
};

exports.addEvent = function(req, res){
  res.send();
};

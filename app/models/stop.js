'use strict';

var Mongo = require('mongodb'),
    async = require('async');

function Stop(o){
  this.tripId = o.tripId;
  this.loc    = {name:o.name, lat:o.lat, lng:o.lng};
  this.photos = [];
  this.events = [];
}

Object.defineProperty(Stop, 'collection', {
  get: function(){return global.mongodb.collection('stops');}
});

Stop.create = function(o, cb){
  var stops = o.places;
  async.each(stops, makeNew, function(err){
    console.log('saved!');
    cb();
  });
};

Stop.query = function(tripId, cb){
  Stop.collection.find({tripId:tripId}).toArray(cb);
};

Stop.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Stop.collection.findOne({_id:_id}, cb);
};

//Private Helper Functions
function makeNew(item, callback){
  var s = new Stop(item);
  Stop.collection.save(s, callback);
}


module.exports = Stop;

'use strict';

var Mongo = require('mongodb'),
    _     = require('lodash'),
    fs    = require('fs'),
    path  = require('path');

function Trip(fields){
  this._id         = Mongo.ObjectID();
  this.name        = fields.name[0];
  this.origin      = {address:fields.origin[0], lat:fields.originLat[0], lng:fields.originLng[0]};
  this.destination = {address:fields.destination[0], lat:fields.destinationLat[0], lng:fields.destinationLng[0]};
  this.startDate   = new Date(fields.startDate[0]);
  this.endDate     = new Date(fields.endDate[0]);
  this.car         = {photo:null, mpg:parseFloat(fields.carMpg[0]), gas:parseFloat(fields.carGas[0])};
  this.cash        = parseFloat(fields.cash[0]);
  //this.distance;
}

Object.defineProperty(Trip, 'collection', {
  get: function(){return global.mongodb.collection('trip');}
});

Trip.create = function(fields, files, cb){
  var trip = new Trip(fields);
  trip.moveFiles(files);
  Trip.collection.save(trip, cb);
};

Trip.all = function(cb){
  Trip.collection.find().toArray(cb);
};

Trip.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Trip.collection.findOne({_id:_id}, function(err, obj){
    cb(err, _.create(Trip.prototype, obj));
  });
};

Trip.prototype.moveFiles = function(files){
  var baseDir = __dirname + '/../static',
      relDir  = '/img/' + this._id,
      absDir  = baseDir + relDir;

  fs.mkdir(absDir);

  this.car.photo = files.photo.map(function(photo, index){
    if(!photo.size){return;}

    var ext     = path.extname(photo.path),
        name    = index + ext,
        relPath = relDir + '/' + name,
        absPath = absDir + '/' + name;
    fs.renameSync(photo.path, absPath);
    return relPath;
  });

  this.car.photo = _.compact(this.car.photo);
};

Trip.prototype.save = function(cb){
  Trip.collection.save(this, cb);
};

module.exports = Trip;


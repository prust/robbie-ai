(function() {

var is_a = / is an? /;
var has_a = / has an? /;

var sorry = [
  "I'm sorry, I didn't quite catch that.",
  "Come again?",
  "What was that?",
  "Uhh...",
  "What?"
];

var ok = [
  "Got it.",
  "Hey, thanks for letting me know!",
  "Makes sense to me.",
  "Yep.",
  "I'll remember that.",
  "Of course!"
];

function Robbie() {
  var json = localStorage.getItem('robbie');
  this.data = json ? JSON.parse(json) : {id_counter: 0};
}

Robbie.prototype.input = function(str) {
  if (is_a.test(str))
    this.isA(str);
  else if (has_a.test(str))
    this.hasA(str);
  else
    this.sorry();
};

Robbie.prototype.isA = function(str) {
  var matches = is_a.exec(str);
  var subject = str.slice(0, matches.index);
  var object = str.slice(matches.index + matches[0].length);
  if (!subject || !object)
    return this.sorry();

  var obj = this.get(subject);
  this.addType(obj, object);
  this.save();
};

Robbie.prototype.hasA = function(str) {
  var matches = has_a.exec(str);
  var subject = str.slice(0, matches.index);
  var object = str.slice(matches.index + matches[0].length);
  if (!subject || !object)
    return this.sorry();

  var obj = this.get(subject);
  this.addChild(obj, object);
  this.save();
};

Robbie.prototype.addChild = function(obj, child_type) {
  var child = this.create();
  if (child_type)
    this.addType(child, child_type);

  if (!obj.children)
    obj.children = [];
  obj.children.push({id: child.id});
};

// gets the object (if it doesn't exist, creates it)
Robbie.prototype.get = function(name) {
  for (var id in this.data)
    if (this.data[id].name == name)
      return this.data[id];

  return this.create(name);
};

Robbie.prototype.create = function(name) {
  var id = this.id();
  var obj = {id: id};
  if (name)
    obj.name = name;
  return this.data[id] = obj;
};

Robbie.prototype.addType = function(obj, type) {
  if (!obj.types)
    obj.types = [];

  obj.types.push(type);
  return obj;
};

Robbie.prototype.id = function() {
  return this.data.id_counter++;
};

Robbie.prototype.on = function(evt_name, callback) {
  if (evt_name != 'response')
    throw new Error('Unknown event: ' + evt_name);

  this.response_handler = callback;
};

Robbie.prototype.respond = function(str) {
  this.response_handler && this.response_handler(str);
};

Robbie.prototype.sorry = function() {
  var msg = sorry[random(sorry.length - 1)];
  this.respond(msg);
};

Robbie.prototype.save = function() {
  localStorage.setItem('robbie', JSON.stringify(this.data));
  var msg = ok[random(ok.length - 1)];
  this.respond(msg);
};

// returns random # from min-max (inclusive)
// from Underscore.js
function random(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  window.Robbie = Robbie;
})();
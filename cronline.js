
var Cronline = function(){};

// minute hour day month day(week)
Cronline.humanize = function(cronline){
  if(cronline == '* * * * *'){
    return 'at every minute';
  }
  else{
    var fields = cronline.split(/\s/);
    var string = '';

    if(fields.length != 5){
      return 'invalid cronline';
    } else {
      parts = {};

      parts.minute = this.parseField('minute', fields[0]);
      parts.hour = (fields[1] == '*') ? '' : this.parseField('hour', fields[1]);
      parts.day = (fields[2] == '*') ? '' : this.parseField('day', fields[2]);
      parts.month = (fields[3] == '*') ? ' of every month ' : this.parseField('month', fields[3]);
      parts.weekday = (fields[4] == '*') ? '' : this.parseField('weekday', fields[4]);

      // if(typeof parseInt(parts.minute) == 'number' && typeof parts.hour == 'number'){
      minutes = "" + parts.minute;
        string = 'At ' + fields[1] + ':' + "00".substring(0, 2 - minutes.length) + minutes;
      // }

      return string + parts.day + parts.month + parts.weekday;
    }
  }
};

Cronline.parseField = function(name, value){
  var output = '';

  // *
  if(value == '*' || value.match(/^\*\/1$/)){
    output = 'every ' + name;
    return output;
  }
  // 15 OR 1,2,3,4,5
  if(value.match(/^[0-9]{1,2}$/) || value.match(/^[0-9,]+[0-9]$/)){
    output = value;
  }
  // */5
  if(value.match(/^\*\/[0-9]{1,2}$/)){
    output = 'every ' + value.replace(/\*\//, '') + ' ' + name;
  }
  // 5-25
  if(value.match(/^[0-9]{1,2}-[0-9]{1,2}$/)){
    var range = value.match(/^([0-9]{1,2})-([0-9]{1,2})$/);
    output = ' from ' + range[1] + ' to ' + range[2];
  }
  // 5-25/5
  if(value.match(/^[0-9]{1,2}-[0-9]{1,2}\/[0-9]{1,2}$/)){
    var range = value.match(/^([0-9]{1,2})-([0-9]{1,2})\/([0-9]{1,2})$/);
    output = 'every ' + range[3] + ' ' + name + ' from ' + range[1] + ' to ' + range[2];
  }

  return this.decorate(name, output);
};

Cronline.decorate = function(name, parsed_value){
  switch (name){
    case 'minute':
      return parsed_value;
    case 'hour':
      return parsed_value;
    case 'day':
      return ' on day-of-month ' + parsed_value;
    case 'month':
      return ' in ' + this.monthNames(parsed_value);
    case 'weekday':
      return ' and on ' + this.dayNames(parsed_value);
  }
};
// TODO Missing 1-3 -> range ----------
Cronline.monthNames = function(value){
  var monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var months = value.split(',');
  var names = [];
  months.forEach(function(m) {
    names.push(monthNames[m]);
  });

  return names.join(', ');
};

Cronline.dayNames = function(value){
  var dayNames = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  var days = value.split(',');
  var names = [];
  days.forEach(function(m) {
    names.push(dayNames[m]);
  });

  return names.join(', ');
};
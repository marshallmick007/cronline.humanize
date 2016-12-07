
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
      string = 'invalid cronline';
    } else {
      string = 'At ' + this.parseField('minute', fields[0]) + '|';
      string += (fields[1] == '*') ? '' : this.parseField('hour', fields[1]) + '|';
      string += (fields[2] == '*') ? '' : this.parseField('day', fields[2]) + '|';
      string += (fields[3] == '*') ? '' : this.parseField('month', fields[3]) + '|';
      string += (fields[4] == '*') ? '' : this.parseField('weekday', fields[4]) + '|';
    }

    return string;
  }
};

Cronline.parseField = function(name, value){
  var output = '';

  // *
  if(value == '*' || value.match(/^\*\/1$/)){
    output = 'every ';
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
      return 'minute' + parsed_value;
    case 'hour':
      return 'hour ' + parsed_value;
    case 'day':
      return parsed_value;
    case 'month':
      return parsed_value;
    case 'weekday':
      return parsed_value;
  }
};

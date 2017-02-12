var _ = require('lodash');

module.exports = {
  time: null,

  humanize: function(cronline){
    if(cronline == '* * * * *'){
      return 'at every minute';
    }
    else{
      var fields = cronline.split(/\s/);
      var string = '';

      if(fields.length != 5){
        return 'not a valid cron expression';
      } else {
        var parsed_field = [];

        parsed_field.push(['minute', this.parseField(fields[0])]);
        parsed_field.push(['hour', this.parseField(fields[1])]);
        parsed_field.push(['day', this.parseField(fields[2])]);
        parsed_field.push(['month', this.parseField(fields[3])]);
        parsed_field.push(['weekday', this.parseField(fields[4])]);

        var defined_fields = _.filter(parsed_field, function (o) {
          return o[1] !== null;
        });

        if(defined_fields.length == 1)
        {
          o = defined_fields[0];
          return this.simple(o);
        }
        else
        {
          var combination = {};
          for(var i = 0; i < defined_fields.length; i++){
            o = defined_fields[i];
            combination[o[0]] = o[1];
          }
          this.parseTime(combination);
          return 'at ' + this.time;
        }
      }
    }
  },
  simple: function(value){
    var out = '';
    switch(value[0]){
      case 'minute':
        out = 'on minute ' + value[1];
        break;
      case 'hour':
         out = 'at every minute of hour ' + value[1];
         break;
      case 'day':
        out = 'at every minute on day of the month ' + value[1];
        break;
      case 'month':
        out = 'at every minute in ' + this.monthName(o[1]);
        break;
      case 'weekday':
        out = 'at every minute on ' + this.dayName(o[1]);
        break;
      default:
        break;
    }

    return out;
  },


  parseTime: function(combination){
    if(_.has(combination, 'minute') && _.has(combination, 'hour'))
    {
      this.time = combination.hour + ':' + "00".substring(0, 2 - combination.minute.length) + combination.minute;
    }
  },
  parseField: function(value){
    var output = '';

    // *
    if(value == '*' || value.match(/^\*\/1$/)){
      return null;
    }
    // 15 OR 1,2,3,4,5
    if(value.match(/^[0-9]{1,2}$/) || value.match(/^[0-9,]+[0-9]$/)){
      output = value;
    }
    // */5
    if(value.match(/^\*\/[0-9]{1,2}$/)){
      output = 'every ' + value.replace(/\*\//, '');
    }
    // 5-25
    if(value.match(/^[0-9]{1,2}-[0-9]{1,2}$/)){
      var range = value.match(/^([0-9]{1,2})-([0-9]{1,2})$/);
      output = ' from ' + range[1] + ' to ' + range[2];
    }
    // 5-25/5
    if(value.match(/^[0-9]{1,2}-[0-9]{1,2}\/[0-9]{1,2}$/)){
      var range = value.match(/^([0-9]{1,2})-([0-9]{1,2})\/([0-9]{1,2})$/);
      output = range[3] + ' from ' + range[1] + ' to ' + range[2];
    }

    return output;
  },
  monthName: function(value){
// TODO Missing 1-3 -> range ----------
    var monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var months = value.split(',');
    var names = [];
    months.forEach(function(m) {
      names.push(monthNames[m]);
    });

    return names.join(', ');
  },
  dayName: function(value){
    var dayNames = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var days = value.split(',');
    var names = [];
    days.forEach(function(m) {
      names.push(dayNames[m]);
    });

    return names.join(', ');
  }
};
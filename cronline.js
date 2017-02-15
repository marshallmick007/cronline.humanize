var _ = require('lodash');

module.exports = {

  humanize: function(cronline){
    if(cronline == '* * * * *'){
      return 'at every minute';
    }
    else{
      var fields = cronline.split(/\s/);

      if(fields.length != 5){
        return 'not a valid cron expression';
      } else {
        var parsed_field = [];

        parsed_field.push(['minute', this.getValue(fields[0])]);
        parsed_field.push(['hour', this.getValue(fields[1])]);
        parsed_field.push(['day', this.getValue(fields[2])]);
        parsed_field.push(['month', this.getValue(fields[3])]);
        parsed_field.push(['weekday', this.getValue(fields[4])]);

        var defined_fields = _.filter(parsed_field, function (o) {
          return o[1] !== null;
        });

        if(defined_fields.length == 1)
        {
          o = defined_fields[0];
          if(o[1].match(','))
          {
            return this.list(o);
          }
          else if(o[1].match('-'))
          {
            return this.range(o);
          }
          return this.single(o);
        }
        else
        {
          return this.combination(defined_fields);
        }
      }
    }
  },
  single: function(value){
    var out = '';
    switch(value[0]){
      case 'minute':
        out = 'at minute ' + value[1];
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
  list: function(value){
    var out = '';

    switch(value[0]){
      case 'minute':
        out = 'at minute ' + this.listify(value[1]);
        break;
      case 'hour':
        out = 'at every minute of hour ' + this.listify(value[1]);
        break;
      case 'day':
        out = 'at every minute on days of the month ' + this.listify(value[1]);
        break;
      case 'month':
        self = this;
        var months = _.map(value[1].split(','), function(v){
          return self.monthName(v);
        });
        out = 'at every minute in ' + this.listify(months.join(','));
        break;
      case 'weekday':
        self = this;
        var weekdays = _.map(value[1].split(','), function(v){
          return self.dayName(v);
        });
        out = 'at every minute on ' + this.listify(weekdays.join(','));
        break;
      default:
        break;
    }

    return out;
  },
  range: function(value){
    var out = '';

    switch(value[0]){
      case 'minute':
        out = 'at every minute ' + this.rangeify(value[1]);
        break;
      case 'hour':
        out = 'at every minute past every hour ' + this.rangeify(value[1]);
        break;
      case 'day':
        out = 'at every minute on every day of the month ' + this.rangeify(value[1]);
        break;
      case 'month':
        self = this;
        var months = _.map(value[1].split('-'), function(v){
          return self.monthName(v);
        });
        out = 'at every minute of every month ' + this.rangeify(months.join('-'));
        break;
      case 'weekday':
        self = this;
        var weekdays = _.map(value[1].split('-'), function(v){
          return self.dayName(v);
        });
        out = 'at every minute of every day ' + this.rangeify(weekdays.join('-'));
        break;
      default:
        break;
    }

    return out;
  },
  hasMinutes: function (combination) {
    return _.has(combination, 'minute') && !_.has(combination, 'hour');
  },
  hasHours: function (combination) {
    return !_.has(combination, 'minute') && _.has(combination, 'hour');
  },
  hasMinutesAndHours: function (combination) {
    return _.has(combination, 'minute') && _.has(combination, 'hour');
  },
  hasTime: function (combination) {
    if(_.has(combination, 'minute') && _.has(combination, 'hour')) {
      return (!combination.minute.match(',') && !combination.hour.match(','));
    }
    return false;
  },
  hasDayOfTheMonth: function (combination) {
    return _.has(combination, 'day');
  },
  hasWeekday: function(combination) {
    return _.has(combination, 'weekday');
  },
  hasMonth: function(combination){
    return _.has(combination, 'month');
  },
  humanizeTime: function (combination) {
    var string = '';

    if (this.hasTime(combination)) {
      string = 'at ' + this.parseTime(combination);
    }
    else if (this.hasMinutes(combination)) {
      string = 'at minute ' + combination.minute;
    }
    else if (this.hasHours(combination)) {
      string = 'at every minute past hour ' + combination.hour;
    }
    else if (this.hasMinutesAndHours(combination)) {
      string = 'at minute ' + this.listify(combination.minute);
      string += ' past hour ' + this.listify(combination.hour);
    }
    else
    {
      string = 'at every minute';
    }
    return string;
  },
  combination: function(defined_fields){
    var combination = {};
    for(var i = 0; i < defined_fields.length; i++){
      o = defined_fields[i];
      combination[o[0]] = o[1];
    }
    var out = [];
    out.push(this.humanizeTime(combination));

    if (this.hasDayOfTheMonth(combination)){
      out.push('on day of the month ' + this.something(combination.day));
      if(this.hasWeekday(combination)) {
        out.push('and on ' + this.dayName(combination.weekday));
      }
    }
    else if(this.hasWeekday(combination)){
      self = this;
      var weekdays = _.map(combination.weekday.split('-'), function(v){
        return self.dayName(v);
      });

      if(weekdays.length == 1)
      {
        var prefix = 'on ';
      }
      else
      {
        var prefix = 'on every day ';
      }
      out.push(prefix + this.something(weekdays.join('-')));
    }
    if(this.hasMonth(combination)){
      self = this;
      var months = _.map(combination.month.split('-'), function(v){
        return self.monthName(v);
      });

      if(months.length == 1)
      {
        var prefix = 'in ';
      }
      else
      {
        var prefix = 'in every month ';
      }
      out.push(prefix + this.something(months.join('-')));
    }

    return out.join(' ');
  },
  something: function(o){
    if(o.match(','))
    {
      return this.listify(o);
    }
    else if(o.match('-'))
    {
      return this.rangeify(o);
    }
    else
    {
      return o;
    }
  },
  parseTime: function(combination){
    return combination.hour + ':' + "00".substring(0, 2 - combination.minute.length) + combination.minute;
  },
  getValue: function(value){
    return (value == '*' || value.match(/^\*\/1$/)) ? null: value;
  },
  monthName: function(value){
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
  },
  listify: function(value) {
    return value.replace(/,(?=[^,]+$)/, ' and ');
  },
  rangeify: function(value){
    return value.replace(/([\w]+)-([\w]+)/, 'from $1 to $2')
  }
};
module.exports = {

  humanize: function (cronline) {
    if (cronline == '* * * * *' || cronline == '*/1 * * * *') {
      return 'at every minute';
    }
    else {
      var fields = cronline.split(/\s/);

      if (fields.length != 5) {
        return 'not a valid cron expression';
      } else {
        var parsed_field = [];

        parsed_field.push(['minute', this.getValue(fields[0])]);
        parsed_field.push(['hour', this.getValue(fields[1])]);
        parsed_field.push(['day', this.getValue(fields[2])]);
        parsed_field.push(['month', this.getValue(fields[3])]);
        parsed_field.push(['weekday', this.getValue(fields[4])]);

        var defined_fields = parsed_field.filter(function (e, i) {
          return e[1] !== null;
        });

        if (defined_fields.length == 1) {
          return this.single(defined_fields[0]);
        }
        else {
          return this.combination(defined_fields);
        }
      }
    }
  },
  humanizeExp: function (value) {
    var out = '';
    switch (value[0]) {
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
        out = 'at every minute in ' + this.monthName(value[1]);
        break;
      case 'weekday':
        out = 'at every minute on ' + this.dayName(value[1]);
        break;
      default:
        break;
    }

    return out;
  },
  humanizeList: function (value) {
    var out = '';

    switch (value[0]) {
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
        var months = value[1].split(',').map(function (v) {
          return self.monthName(v);
        });
        out = 'at every minute in ' + this.listify(months.join(','));
        break;
      case 'weekday':
        self = this;
        var weekdays = value[1].split(',').map(function (v) {
          return self.dayName(v);
        });
        out = 'at every minute on ' + this.listify(weekdays.join(','));
        break;
      default:
        break;
    }

    return out;
  },
  humanizeRange: function (value) {
    var out = '';

    switch (value[0]) {
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
        var months = value[1].split('-').map(function (v) {
          return self.monthName(v);
        });
        out = 'at every minute of every month ' + this.rangeify(months.join('-'));
        break;
      case 'weekday':
        self = this;
        var weekdays = value[1].split('-').map(function (v) {
          return self.dayName(v);
        });
        out = 'at every minute of every day ' + this.rangeify(weekdays.join('-'));
        break;
      default:
        break;
    }

    return out;
  },
  humanizeStep: function (value) {
    var out = '';

    switch (value[0]) {
      case 'minute':
        out = 'at every ' + this.stepify(value[1]) + ' minute';
        break;
      case 'hour':
        out = 'at every minute past every ' + this.stepify(value[1]) + ' hour';
        break;
      case 'day':
        out = 'at every minute on every ' + this.stepify(value[1]) + ' day of the month';
        break;
      case 'month':
        out = 'at every minute in every ' + this.stepify(value[1]) + ' month';
        break;
      case 'weekday':
        out = 'at every minute on every ' + this.stepify(value[1]) + ' day of the week';
        break;
      default:
        break;
    }

    return out;
  },
  hasMinutes: function (combination) {
    return combination.hasOwnProperty('minute') && !combination.hasOwnProperty('hour');
  },
  hasHours: function (combination) {
    return !combination.hasOwnProperty('minute') && combination.hasOwnProperty('hour');
  },
  hasMinutesAndHours: function (combination) {
    return combination.hasOwnProperty('minute') && combination.hasOwnProperty('hour');
  },
  hasTime: function (combination) {
    if (combination.hasOwnProperty('minute') && combination.hasOwnProperty('hour')) {
      return (combination.minute.match(/^[0-9]{1,2}$/) && combination.hour.match(/^[0-9]{1,2}$/));
    }
    return false;
  },
  humanizeTime: function (combination) {
    var string = '';

    if (this.hasTime(combination)) {
      string = 'at ' + this.parseTime(combination);
    }
    else if (this.hasMinutes(combination)) {
      string = 'at minute ' + this.parseExp(combination.minute);
    }
    else if (this.hasHours(combination)) {
      string = 'at every minute past hour ' + combination.hour;
    }
    else if (this.hasMinutesAndHours(combination)) {
      if (combination.minute.match('/')) {
        string = 'at every ' + this.parseExp(combination.minute) + ' minute';
      }
      else {
        string = 'at minute ' + this.parseExp(combination.minute);
      }
      if (combination.hour.match('/')) {
        string += ' on every ' + this.parseExp(combination.hour) + ' hour';
      }
      else {
        string += ' past hour ' + this.parseExp(combination.hour);
      }
    }
    else {
      string = 'at every minute';
    }
    return string;
  },
  hasDayOfTheMonth: function (combination) {
    return combination.hasOwnProperty('day');
  },
  hasWeekday: function (combination) {
    return combination.hasOwnProperty('weekday');
  },
  hasMonth: function (combination) {
    return combination.hasOwnProperty('month');
  },
  single: function (o) {
    if (o[1].match(',')) {
      return this.humanizeList(o);
    }
    else if (o[1].match('-')) {
      return this.humanizeRange(o);
    }
    else if (o[1].match('/')) {
      return this.humanizeStep(o);
    }
    else {
      return this.humanizeExp(o);
    }
  },
  combination: function (defined_fields) {
    var out = [];
    var prefix = '';

    var combination = {};
    for (var i = 0; i < defined_fields.length; i++) {
      o = defined_fields[i];
      combination[o[0]] = o[1];
    }

    out.push(this.humanizeTime(combination));

    if (this.hasDayOfTheMonth(combination)) {
      out.push('on day of the month ' + this.parseExp(combination.day));
      if (this.hasWeekday(combination)) {
        out.push('and on ' + this.dayName(combination.weekday));
      }
    }
    else if (this.hasWeekday(combination)) {
      var weekdays = combination.weekday.split('-').map(function (v) {
        return this.dayName(v);
      }, this);

      prefix = (weekdays.length == 1) ? 'on ' : 'on every day ';
      out.push(prefix + this.parseExp(weekdays.join('-')));
    }
    if (this.hasMonth(combination)) {
      var months = combination.month.split('-').map(function (v) {
        return this.monthName(v);
      }, this);

      prefix = (months.length == 1) ? 'in ' : 'in every month ';
      out.push(prefix + this.parseExp(months.join('-')));
    }

    return out.join(' ');
  },
  parseExp: function (o) {
    var op = o.match(',|-|/');

    if (op) {
      switch (op[0]) {
        case ',':
          return this.listify(o);
        case '-':
          return this.rangeify(o);
        case '/':
          return this.stepify(o);
        default:
          return '';
      }
    }
    return o;
  },
  parseTime: function (combination) {
    return combination.hour + ':' + "00".substring(0, 2 - combination.minute.length) + combination.minute;
  },
  getValue: function (value) {
    return (value == '*' || value.match(/^\*\/1$/)) ? null : value;
  },
  monthName: function (value) {
    var monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var months = value.split(',');
    var names = [];
    months.forEach(function (m) {
      names.push(monthNames[m]);
    });

    return names.join(', ');
  },
  dayName: function (value) {
    var dayNames = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var days = value.split(',');
    var names = [];
    days.forEach(function (m) {
      names.push(dayNames[m]);
    });

    return names.join(', ');
  },
  listify: function (value) {
    return value.replace(/,(?=[^,]+$)/, ' and ');
  },
  rangeify: function (value) {
    return value.replace(/([\w]+)-([\w]+)/, 'from $1 to $2')
  },
  stepify: function (value) {
    var humanizeStep = value.replace(/\*\/([\d+])/, '$1');
    return this.ordinalify(humanizeStep);
  },
  ordinalify: function (value) {
    var j = value % 10, k = value % 100;
    if (j == 1 && k != 11) {
      return value + "st";
    }
    if (j == 2 && k != 12) {
      return value + "nd";
    }
    if (j == 3 && k != 13) {
      return value + "rd";
    }
    return value + "th";
  }
};
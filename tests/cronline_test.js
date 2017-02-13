var expect = require('chai').expect;
var Cronline = require('../cronline');

describe('single expression', function(){
  it("should return an error on ivalid cron expression", function(){
    var result = Cronline.humanize("Failure, when your best isn't just good enough");
    expect(result).to.equal('not a valid cron expression');
  });

  it("should return 'at every minute' for '* * * * *'", function(){
    var result = Cronline.humanize('* * * * *');
    expect(result).to.equal('at every minute');
  });

  describe('single', function(){
    it("should parse minute 1", function(){
      var result = Cronline.humanize('1 * * * *');
      expect(result).to.equal('at minute 1');
    });

    it("should parse hour 1", function(){
      var result = Cronline.humanize('* 1 * * *');
      expect(result).to.equal('at every minute of hour 1');
    });

    it("should parse day 1", function(){
      var result = Cronline.humanize('* * 1 * *');
      expect(result).to.equal('at every minute on day of the month 1');
    });

    it("should parse month 1", function(){
      var result = Cronline.humanize('* * * 1 *');
      expect(result).to.equal('at every minute in January');
    });

    it("should parse weekday 1", function(){
      var result = Cronline.humanize('* * * * 1');
      expect(result).to.equal('at every minute on Monday');
    });
  });
  describe('list expression', function(){
    it('should parse a list of 2', function(){
      var result = Cronline.humanize("1,31 * * * *");
      expect(result).to.equal('at minute 1 and 31');

      result = Cronline.humanize("* * 1,31 * *");
      expect(result).to.equal('at every minute on day of the month 1 and 31');
    });

    it('should parse a list of many', function(){
      var result = Cronline.humanize("* 2,4,6,8,10 * * *");
      expect(result).to.equal('at every minute of hour 2,4,6,8 and 10');

      expect(result).to.equal('at every minute of hour 2,4,6,8 and 10');
    });

    it('should parse a list of minutes with an hour', function(){
      var result = Cronline.humanize("5,10,15 4 * * *");
      expect(result).to.equal('at minute 5,10 and 15 past hour 4');
    });

    it('should parse a list of months', function(){
      var result = Cronline.humanize("* * * 1,6 *");
      expect(result).to.equal('at every minute in January and June');
    });

    it('should parse a list of weekdays', function(){
      var result = Cronline.humanize("* * * * 1,4");
      expect(result).to.equal('at every minute on Monday and Thursday');
    });
  });

});

describe('combinations', function() {
  describe('of two', function() {
    it("should parse minute and hour", function () {
      var result = Cronline.humanize('1 5 * * *');
      expect(result).to.equal('at 5:01');

      result = Cronline.humanize('15 15 * * *');
      expect(result).to.equal('at 15:15');
    });

    it("should parse minute and weekday", function () {
      var result = Cronline.humanize('1 * * * 1');
      expect(result).to.equal('at minute 1 on Monday');

      result = Cronline.humanize('15 * * * 5');
      expect(result).to.equal('at minute 15 on Friday');
    });

    it("should parse minute and day", function () {
      var result = Cronline.humanize('1 * 5 * *');
      expect(result).to.equal('at minute 1 on day of the month 5');

      result = Cronline.humanize('15 * 22 * *');
      expect(result).to.equal('at minute 15 on day of the month 22');
    });

    it("should parse minute and month", function () {
      var result = Cronline.humanize('12 * * 2 *');
      expect(result).to.equal('at minute 12 in February');

      result = Cronline.humanize('32 * * 5 *');
      expect(result).to.equal('at minute 32 in May');
    });

    it("should parse hour and weekday", function () {
      var result = Cronline.humanize('* 4 * * 4');
      expect(result).to.equal('at every minute past hour 4 on Thursday');

      result = Cronline.humanize('* 15 * * 2');
      expect(result).to.equal('at every minute past hour 15 on Tuesday');
    });

    it("should parse hour and month", function () {
      var result = Cronline.humanize('* 8 * 9 *');
      expect(result).to.equal('at every minute past hour 8 in September');

      result = Cronline.humanize('* 23 * 12 *');
      expect(result).to.equal('at every minute past hour 23 in December');
    });

    it("should parse hour and day of the month", function () {
      var result = Cronline.humanize('* 8 12 * *');
      expect(result).to.equal('at every minute past hour 8 on day of the month 12');

      result = Cronline.humanize('* 23 14 * *');
      expect(result).to.equal('at every minute past hour 23 on day of the month 14');
    });

    it("should parse day of the month and month", function () {
      var result = Cronline.humanize('* * 8 4 *');
      expect(result).to.equal('at every minute on day of the month 8 in April');

      result = Cronline.humanize('* * 22 10 *');
      expect(result).to.equal('at every minute on day of the month 22 in October');
    });

    it("should parse month and weekday", function () {
      var result = Cronline.humanize('* * * 3 1');
      expect(result).to.equal('at every minute on Monday in March');

      result = Cronline.humanize('* * * 7 3');
      expect(result).to.equal('at every minute on Wednesday in July');
    });
  });

  describe('of many', function(){
    it("should parse minute and hour and weekday", function () {
      var result = Cronline.humanize('5 6 * * 1');
      expect(result).to.equal('at 6:05 on Monday');
    });

    it("should parse minute and hour and month and weekday", function(){
      var result = Cronline.humanize('15 21 * 1 4');
      expect(result).to.equal('at 21:15 on Thursday in January');
    });

    it("should parse minute and hour and month and and day of month and weekday", function(){
      var result = Cronline.humanize('15 21 5 1 4');
      expect(result).to.equal('at 21:15 on day of the month 5 and on Thursday in January');
    });
  });
});
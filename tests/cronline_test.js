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
    });

    it('should parse a list of many', function(){
      var result = Cronline.humanize("* 2,4,6,8,10 * * *");
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

  describe('range expression', function(){
    it('should parse a range of minutes', function(){
      var result = Cronline.humanize("1-5 * * * *");
      expect(result).to.equal('at every minute from 1 to 5');
    });

    it('should parse a range of hours', function(){
      var result = Cronline.humanize("* 2-22 * * *");
      expect(result).to.equal('at every minute past every hour from 2 to 22');
    });

    it('should parse a range of days of the month', function(){
      var result = Cronline.humanize("* * 4-9 * *");
      expect(result).to.equal('at every minute on every day of the month from 4 to 9');
    });

    it('should parse a range of months', function(){
      var result = Cronline.humanize("* * * 1-7 *");
      expect(result).to.equal('at every minute of every month from January to July');
    });

    it('should parse a range of weekdays', function(){
      var result = Cronline.humanize("* * * * 1-5");
      expect(result).to.equal('at every minute of every day from Monday to Friday');
    });
  });

  describe('step values expression', function() {
    it('should parse a step of one minute', function () {
      var result = Cronline.humanize("*/1 * * * *");
      expect(result).to.equal('at every minute');
    });

    it('should parse a step of one hour', function () {
      var result = Cronline.humanize("* */1 * * *");
      expect(result).to.equal('at every minute');
    });

    it('should parse a step of one day of the month', function () {
      var result = Cronline.humanize("* * */1 * *");
      expect(result).to.equal('at every minute');
    });

    it('should parse a step of one month', function () {
      var result = Cronline.humanize("* * * */1 *");
      expect(result).to.equal('at every minute');
    });

    it('should parse a step of one weekday', function () {
      var result = Cronline.humanize("* * * * */1");
      expect(result).to.equal('at every minute');
    });

    it('should parse a step of minutes', function () {
      var result = Cronline.humanize("*/5 * * * *");
      expect(result).to.equal('at every 5th minute');
    });

    it('should parse a step of hours', function () {
      var result = Cronline.humanize("* */3 * * *");
      expect(result).to.equal('at every minute past every 3rd hour');
    });

    it('should parse a step of days of the month', function () {
      var result = Cronline.humanize("* * */7 * *");
      expect(result).to.equal('at every minute on every 7th day of the month');
    });

    it('should parse a step of month', function () {
      var result = Cronline.humanize("* * * */3 *");
      expect(result).to.equal('at every minute in every 3rd month');
    });

    it('should parse a step of weekdays', function () {
      var result = Cronline.humanize("* * * * */2");
      expect(result).to.equal('at every minute on every 2nd day of the week');
    });
  });
});

describe('combinations', function() {
  describe('of two', function() {
    it("should parse minute and hour", function () {
      var result = Cronline.humanize('1 5 * * *');
      expect(result).to.equal('at 5:01');
    });

    it("should parse minute and weekday", function () {
      var result = Cronline.humanize('3 * * * 1');
      expect(result).to.equal('at minute 3 on Monday');
    });

    it("should parse minute and day", function () {
      var result = Cronline.humanize('5 * 5 * *');
      expect(result).to.equal('at minute 5 on day of the month 5');
    });

    it("should parse minute and month", function () {
      var result = Cronline.humanize('12 * * 2 *');
      expect(result).to.equal('at minute 12 in February');
    });

    it("should parse hour and weekday", function () {
      var result = Cronline.humanize('* 4 * * 4');
      expect(result).to.equal('at every minute past hour 4 on Thursday');
    });

    it("should parse hour and month", function () {
      var result = Cronline.humanize('* 23 * 12 *');
      expect(result).to.equal('at every minute past hour 23 in December');
    });

    it("should parse hour and day of the month", function () {
      var result = Cronline.humanize('* 8 12 * *');
      expect(result).to.equal('at every minute past hour 8 on day of the month 12');
    });

    it("should parse day of the month and month", function () {
      var result = Cronline.humanize('* * 22 10 *');
      expect(result).to.equal('at every minute on day of the month 22 in October');
    });

    it("should parse month and weekday", function () {
      var result = Cronline.humanize('* * * 7 3');
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

    it("should parse time and a list of days of month", function(){
      var result = Cronline.humanize('30 12 1,10,20 * *');
      expect(result).to.equal('at 12:30 on day of the month 1,10 and 20')
    });

    it("should parse time a range of days of month", function(){
      var result = Cronline.humanize('0 6 15-25 * *');
      expect(result).to.equal('at 6:00 on day of the month from 15 to 25')
    });

    it("should parse time a range of months", function(){
      var result = Cronline.humanize('0 8 * 1-6 *');
      expect(result).to.equal('at 8:00 in every month from January to June')
    });

    it("should parse time a range of days", function(){
      var result = Cronline.humanize('30 9 * * 1-3');
      expect(result).to.equal('at 9:30 on every day from Monday to Wednesday')
    });

    it("should step of minutes and list of hours anything", function(){
      var result = Cronline.humanize('*/5 0,12 1 2 *');
      expect(result).to.equal('at every 5th minute past hour 0 and 12 on day of the month 1 in February');
    });

    it("should parse anything", function(){
      var result = Cronline.humanize('*/11 */4 1,4 2-6 1,3,5');
      expect(result).to.equal('at every 11th minute on every 4th hour on day of the month 1 and 4 and on Monday, Wednesday, Friday in every month from February to June');
    });
  });
});
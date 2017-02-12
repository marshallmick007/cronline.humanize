var expect = require('chai').expect;
var Cronline = require('../cronline');

describe('simple expression parsing', function(){
  it("should return an error on ivalid cron expression", function(){
    var result = Cronline.humanize("Failure, when your best isn't just good enough");
    expect(result).to.equal('not a valid cron expression');
  });

  it("should return 'at every minute' for '* * * * *'", function(){
    var result = Cronline.humanize('* * * * *');
    expect(result).to.equal('at every minute');
  });

  describe('single values', function(){
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
  describe('single values combinations', function() {
    it("should parse minute and hour combination", function () {
      var result = Cronline.humanize('1 5 * * *');
      expect(result).to.equal('at 5:01');

      result = Cronline.humanize('15 15 * * *');
      expect(result).to.equal('at 15:15');
    });

    it("should parse minute and weekday combination", function () {
      var result = Cronline.humanize('1 * * * 1');
      expect(result).to.equal('at minute 1 on Monday');

      result = Cronline.humanize('15 * * * 5');
      expect(result).to.equal('at minute 15 on Friday');
    });

    it("should parse minute and day combination", function () {
      var result = Cronline.humanize('1 * 5 * *');
      expect(result).to.equal('at minute 1 on day of month 5');

      result = Cronline.humanize('15 * 22 * *');
      expect(result).to.equal('at minute 15 on day of month 22');
    });

    it("should parse minute and month combination", function () {
      var result = Cronline.humanize('12 * * 2 *');
      expect(result).to.equal('at minute 12 in February');

      result = Cronline.humanize('32 * * 5 *');
      expect(result).to.equal('at minute 32 in May');
    });

    it("should parse hour and weekday combination", function () {
      var result = Cronline.humanize('* 4 * * 4');
      expect(result).to.equal('at every minute past hour 4 on Thursday');

      result = Cronline.humanize('* 15 * * 2');
      expect(result).to.equal('at every minute past hour 15 on Tuesday');
    });

    it("should parse hour and month combination", function () {
      var result = Cronline.humanize('* 8 * 9 *');
      expect(result).to.equal('at every minute past hour 8 in September');

      result = Cronline.humanize('* 23 * 12 *');
      expect(result).to.equal('at every minute past hour 23 in December');
    });

    it("should parse hour and day of month combination", function () {
      var result = Cronline.humanize('* 8 12 * *');
      expect(result).to.equal('at every minute past hour 8 on day of month 12');

      result = Cronline.humanize('* 23 14 * *');
      expect(result).to.equal('at every minute past hour 23 on day of month 14');
    });

    it("should parse day of month and month combination", function () {
      var result = Cronline.humanize('* * 8 4 *');
      expect(result).to.equal('at every minute on day of month 8 in April');

      result = Cronline.humanize('* * 22 10 *');
      expect(result).to.equal('at every minute on day of month 22 in October');
    });

    it("should parse month and weekday combination", function () {
      var result = Cronline.humanize('* * * 3 1');
      expect(result).to.equal('at every minute on Monday in March');

      result = Cronline.humanize('* * * 7 3');
      expect(result).to.equal('at every minute on Wednesday in July');
    });
  });
});
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
      expect(result).to.equal('on minute 1');
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
  });
});
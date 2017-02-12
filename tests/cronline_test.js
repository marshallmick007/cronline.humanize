var expect = require('chai').expect;
var Cronline = require('../cronline');

describe('simple cron parsing', function(){
  it("should return an error on ivalid cron expression", function(){
    var result = Cronline.humanize("Failure, when your best isn't just good enough");
    expect(result).to.equal('not a valid cron expression');
  });

  it("should return 'at every minute' for '* * * * *'", function(){
    var result = Cronline.humanize('* * * * *');
    expect(result).to.equal('at every minute');
  });

  it("should parse minute", function(){
    var result = Cronline.humanize('1 * * * *');
    expect(result).to.equal('at minute 1');
  });
});
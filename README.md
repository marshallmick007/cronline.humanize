# cronline.humanize
Little Node.js module that translate a Cron expression to a human readable format.

# Usage

```js
var Cronline = require('cronline');

var result = Cronline.humanize('* * * * *');
// 'at every minute'
result = Cronline.humanize('1 * * * *');
// 'at minute 1'
result = Cronline.humanize('* 1 * * *');
// 'at every minute of hour 1'
result = Cronline.humanize('* * 22 10 *');
// 'at every minute on day of the month 22 in October'
result = Cronline.humanize('15 21 * 1 4');
// 'at 21:15 on Thursday in January'
```

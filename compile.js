
/**
 * Module dependencies.
 */

var jade = require('jade')
  , fs = require('fs');

var path = process.argv[2];
var obj = JSON.parse(fs.readFileSync(path, 'utf8'));
var tmpl = fs.readFileSync('index.jade', 'utf8');

jade.render(tmpl, { comments: obj }, function(err, html){
  if (err) throw err;
  process.stdout.write(html);
});


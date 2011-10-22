
/**
 * Module dependencies.
 */

var jade = require('jade')
  , fs = require('fs');

var path = process.argv[2];
var obj = JSON.parse(fs.readFileSync(path, 'utf8'));
var tmpl = fs.readFileSync('index.jade', 'utf8');

var locals = {
    id: id
  , ignore: ignore
  , comments: obj
  , title: title
};

jade.render(tmpl, locals, function(err, html){
  if (err) throw err;
  process.stdout.write(html);
});

function title(comment) {
  if (comment.ctx.string.indexOf('prototype')) {
    return comment.ctx.string.replace('.prototype.', '#');
  } else {
    return comment.ctx.string;
  }
}

function id(comment) {
  return comment.ctx.string
    .replace('()', '');
}

function ignore(comment) {
  return comment.ignore
    || !comment.ctx
    || 'version' == comment.ctx.name
    || ~comment.description.full.indexOf('Module dependencies');
}
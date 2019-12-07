# Changelog for 1.x

## 1.3.2 / 2013-07-18

* add support for sub-commands to co-exist with the original command

## 1.3.1 / 2013-07-18

* add quick .runningCommand hack so you can opt-out of other logic when running a sub command

## 1.3.0 / 2013-07-09

* add EACCES error handling
* fix sub-command --help

## 1.2.0 / 2013-06-13

* allow "-" hyphen as an option argument
* support for RegExp coercion

## 1.1.1 / 2012-11-20

* add more sub-command padding
* fix .usage() when args are present. Closes #106

## 1.1.0 / 2012-11-16

* add git-style executable subcommand support. Closes #94

## 1.0.5 / 2012-10-09

* fix `--name` clobbering. Closes #92
* fix examples/help. Closes #89

## 1.0.4 / 2012-09-03

* add `outputHelp()` method.

## 1.0.3 / 2012-08-30

* remove invalid .version() defaulting

## 1.0.2 / 2012-08-24

* add `--foo=bar` support [arv]
* fix password on node 0.8.8. Make backward compatible with 0.6 [focusaurus]

## 1.0.1 / 2012-08-03

* fix issue #56
* fix tty.setRawMode(mode) was moved to tty.ReadStream#setRawMode() (i.e. process.stdin.setRawMode())

## 1.0.0 / 2012-07-05

* add support for optional option descriptions
* add defaulting of `.version()` to package.json's version

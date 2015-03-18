# Change Log

## [Unreleased](https://github.com/tj/commander.js/tree/HEAD)

[Full Changelog](https://github.com/tj/commander.js/compare/v2.7.1...HEAD)

**Closed issues:**

- command parsing in 2.7 possibly should have bumped major [\#367](https://github.com/tj/commander.js/issues/367)

- Multiline option and command descriptions [\#207](https://github.com/tj/commander.js/issues/207)

-  if \(this.\_execs\[name\]\)  when name is a property of Array tries to run subcommand --with fix [\#206](https://github.com/tj/commander.js/issues/206)

**Merged pull requests:**

- Add camelCase example to `Readme.md` [\#371](https://github.com/tj/commander.js/pull/371) ([malthejorgensen](https://github.com/malthejorgensen))

- multiline descriptions support [\#208](https://github.com/tj/commander.js/pull/208) ([zxqfox](https://github.com/zxqfox))

- fixes \#61 Adds check is a number check on param [\#134](https://github.com/tj/commander.js/pull/134) ([davidcl64](https://github.com/davidcl64))

- Adding parsedOptions [\#65](https://github.com/tj/commander.js/pull/65) ([alsonkemp](https://github.com/alsonkemp))

- Wait for STDOUT to drain before exiting running process. [\#25](https://github.com/tj/commander.js/pull/25) ([jhamlet](https://github.com/jhamlet))

## [v2.7.1](https://github.com/tj/commander.js/tree/v2.7.1) (2015-03-11)

[Full Changelog](https://github.com/tj/commander.js/compare/v2.7.0...v2.7.1)

**Merged pull requests:**

- patch version [\#369](https://github.com/tj/commander.js/pull/369) ([zhiyelee](https://github.com/zhiyelee))

- Revert "Issue \#346, fix collisions when option and first arg have same n... [\#368](https://github.com/tj/commander.js/pull/368) ([zhiyelee](https://github.com/zhiyelee))

## [v2.7.0](https://github.com/tj/commander.js/tree/v2.7.0) (2015-03-09)

[Full Changelog](https://github.com/tj/commander.js/compare/v2.6.0...v2.7.0)

**Fixed bugs:**

- Subcommands not found when installed globally \(npm\) on Unix-type environments [\#335](https://github.com/tj/commander.js/issues/335)

- Uncaught Error in git-style sub-command [\#306](https://github.com/tj/commander.js/issues/306)

**Closed issues:**

- Update doc for git-style subcommand for v2.7.0 [\#364](https://github.com/tj/commander.js/issues/364)

- Git-style command with support of JS 6 [\#355](https://github.com/tj/commander.js/issues/355)

- Using commander I describe a command line based API. How about an HTTP API? [\#351](https://github.com/tj/commander.js/issues/351)

- Release a new version? [\#348](https://github.com/tj/commander.js/issues/348)

- Support explicit boolean flag [\#344](https://github.com/tj/commander.js/issues/344)

- How to detect an unsupported command? [\#338](https://github.com/tj/commander.js/issues/338)

- Bug and Design Flaw: Option "--opts" clashes with Command\#opts function [\#334](https://github.com/tj/commander.js/issues/334)

- add `--config` as an option that commander can use to default other options [\#328](https://github.com/tj/commander.js/issues/328)

- Allow config option for subcommands to be resolved by directory '/' instead of '-' concat [\#325](https://github.com/tj/commander.js/issues/325)

- npm tarball not current [\#317](https://github.com/tj/commander.js/issues/317)

- With '\*' commands, options doesn't work [\#314](https://github.com/tj/commander.js/issues/314)

- add test suites for the git-style executive subcommand feature [\#290](https://github.com/tj/commander.js/issues/290)

- Command Description Broken with Action [\#285](https://github.com/tj/commander.js/issues/285)

- the sub-command only supported in the same directory  [\#196](https://github.com/tj/commander.js/issues/196)

**Merged pull requests:**

- fix typo [\#366](https://github.com/tj/commander.js/pull/366) ([zhiyelee](https://github.com/zhiyelee))

- update README close \#364 [\#365](https://github.com/tj/commander.js/pull/365) ([zhiyelee](https://github.com/zhiyelee))

- version v2.7.0 [\#363](https://github.com/tj/commander.js/pull/363) ([zhiyelee](https://github.com/zhiyelee))

- Revert "Add support for optional boolean flag" [\#362](https://github.com/tj/commander.js/pull/362) ([zhiyelee](https://github.com/zhiyelee))

- add test for required argument [\#361](https://github.com/tj/commander.js/pull/361) ([zhiyelee](https://github.com/zhiyelee))

- refactor [\#360](https://github.com/tj/commander.js/pull/360) ([zhiyelee](https://github.com/zhiyelee))

- resort [\#358](https://github.com/tj/commander.js/pull/358) ([zhiyelee](https://github.com/zhiyelee))

- Add a Gitter chat badge to Readme.md [\#356](https://github.com/tj/commander.js/pull/356) ([gitter-badger](https://github.com/gitter-badger))

- Add support for camelCase on opts\(\) [\#353](https://github.com/tj/commander.js/pull/353) ([nkzawa](https://github.com/nkzawa))

- fix \#335 [\#349](https://github.com/tj/commander.js/pull/349) ([zhiyelee](https://github.com/zhiyelee))

- Issue \#346, fix collisions when option and first arg have same name [\#347](https://github.com/tj/commander.js/pull/347) ([tonylukasavage](https://github.com/tonylukasavage))

- Add support for optional boolean flag [\#345](https://github.com/tj/commander.js/pull/345) ([Globegitter](https://github.com/Globegitter))

- Add node.js 0.12 and io.js to travis.yml [\#342](https://github.com/tj/commander.js/pull/342) ([demohi](https://github.com/demohi))

- Remove unused method parameter. [\#341](https://github.com/tj/commander.js/pull/341) ([yursha](https://github.com/yursha))

- Allowing RegEx options [\#337](https://github.com/tj/commander.js/pull/337) ([palanik](https://github.com/palanik))

- cherry-pick \#260 [\#332](https://github.com/tj/commander.js/pull/332) ([zhiyelee](https://github.com/zhiyelee))

- Fix \#306, and bin-file in $PATH make sense [\#327](https://github.com/tj/commander.js/pull/327) ([zhiyelee](https://github.com/zhiyelee))

- add tests for git-style command Close \#290 [\#324](https://github.com/tj/commander.js/pull/324) ([zhiyelee](https://github.com/zhiyelee))

- Update index.js [\#323](https://github.com/tj/commander.js/pull/323) ([axalix](https://github.com/axalix))

- Removed 'prompt' from keywords [\#321](https://github.com/tj/commander.js/pull/321) ([palanik](https://github.com/palanik))

- update docs for v2.6.0 [\#320](https://github.com/tj/commander.js/pull/320) ([zhiyelee](https://github.com/zhiyelee))

- Remove unnecessary empty line [\#343](https://github.com/tj/commander.js/pull/343) ([ysmood](https://github.com/ysmood))

- Support for RegEx options [\#336](https://github.com/tj/commander.js/pull/336) ([palanik](https://github.com/palanik))

- fixes \#7 - docs patch [\#329](https://github.com/tj/commander.js/pull/329) ([foxx](https://github.com/foxx))

- solve \#306, and bin in $PATH make sense now [\#307](https://github.com/tj/commander.js/pull/307) ([zhiyelee](https://github.com/zhiyelee))

- fixes exit code from sub-commands not propagating [\#260](https://github.com/tj/commander.js/pull/260) ([pirelenito](https://github.com/pirelenito))

- fix up errant output & escape codes in make test [\#187](https://github.com/tj/commander.js/pull/187) ([dbushong](https://github.com/dbushong))

- Update help [\#144](https://github.com/tj/commander.js/pull/144) ([jimthedev](https://github.com/jimthedev))

- add multiple .usage\(\) call support. see \#80 [\#102](https://github.com/tj/commander.js/pull/102) ([millermedeiros](https://github.com/millermedeiros))

## [v2.6.0](https://github.com/tj/commander.js/tree/v2.6.0) (2014-12-29)

[Full Changelog](https://github.com/tj/commander.js/compare/v2.5.1...v2.6.0)

**Closed issues:**

- 2.2.0 isn't compatible any more with parseInt used with default arguments [\#201](https://github.com/tj/commander.js/issues/201)

**Merged pull requests:**

- v2.6.0 [\#319](https://github.com/tj/commander.js/pull/319) ([zhiyelee](https://github.com/zhiyelee))

- Rename allowunknown to allowUnknownOption [\#318](https://github.com/tj/commander.js/pull/318) ([zhiyelee](https://github.com/zhiyelee))

- update README for application description [\#316](https://github.com/tj/commander.js/pull/316) ([zhiyelee](https://github.com/zhiyelee))

- Add application description  Closed \#112 [\#315](https://github.com/tj/commander.js/pull/315) ([zhiyelee](https://github.com/zhiyelee))

- unify codestyle [\#313](https://github.com/tj/commander.js/pull/313) ([zhiyelee](https://github.com/zhiyelee))

- make the test silent [\#312](https://github.com/tj/commander.js/pull/312) ([zhiyelee](https://github.com/zhiyelee))

- subcommand allowUnknown option [\#311](https://github.com/tj/commander.js/pull/311) ([zhiyelee](https://github.com/zhiyelee))

- allow unknown function  \#138  [\#310](https://github.com/tj/commander.js/pull/310) ([zhiyelee](https://github.com/zhiyelee))

- Fixed return value when desc parameter is defined on command. [\#286](https://github.com/tj/commander.js/pull/286) ([pwdonald](https://github.com/pwdonald))

- make node sub command work in windows [\#194](https://github.com/tj/commander.js/pull/194) ([dead-horse](https://github.com/dead-horse))

- Command.action functions should have the Command as this, not the parent. [\#180](https://github.com/tj/commander.js/pull/180) ([radford](https://github.com/radford))

- add mulit argv support [\#177](https://github.com/tj/commander.js/pull/177) ([wyicwx](https://github.com/wyicwx))

- allowUnknownOptions\(\) --- dont process.exit\(1\) when an unknown option is detected. [\#147](https://github.com/tj/commander.js/pull/147) ([matthiasg](https://github.com/matthiasg))

- Add ability to ignore unknown options [\#138](https://github.com/tj/commander.js/pull/138) ([doozr](https://github.com/doozr))

- Amend engine version in package.json [\#127](https://github.com/tj/commander.js/pull/127) ([jamielinux](https://github.com/jamielinux))

## [v2.5.1](https://github.com/tj/commander.js/tree/v2.5.1) (2014-12-15)

[Full Changelog](https://github.com/tj/commander.js/compare/v2.5.0...v2.5.1)

**Fixed bugs:**

- Function instead of first undefined option [\#283](https://github.com/tj/commander.js/issues/283)

**Closed issues:**

- help info of subcommand can't show description [\#304](https://github.com/tj/commander.js/issues/304)

- <id\> parameters not being shown in help [\#302](https://github.com/tj/commander.js/issues/302)

- why so many if `desc` at `Command.prototype.command` ? [\#294](https://github.com/tj/commander.js/issues/294)

- Cannot provide custom name for app [\#292](https://github.com/tj/commander.js/issues/292)

- Fix documentation build flow [\#182](https://github.com/tj/commander.js/issues/182)

- update gh-pages to reflect bf5e1f5 [\#171](https://github.com/tj/commander.js/issues/171)

- how to exec function before all comand when giving some options [\#168](https://github.com/tj/commander.js/issues/168)

- Docs, Section "Custom help": program.on\("help"\) instead of program.on\("--help"\)? [\#141](https://github.com/tj/commander.js/issues/141)

- `cmd.password` displays password being typed if kill command sent [\#119](https://github.com/tj/commander.js/issues/119)

- commander.password hangs in node 0.8.8 [\#82](https://github.com/tj/commander.js/issues/82)

- Non-interactive terminal .prompt and .password not working [\#74](https://github.com/tj/commander.js/issues/74)

- Password prompt does not work in Node.JS 0.8 [\#72](https://github.com/tj/commander.js/issues/72)

- prompt, password, etc. should be able to use stderr, not stdout [\#59](https://github.com/tj/commander.js/issues/59)

- Question: Handling multiple prompts/chooses/etc [\#43](https://github.com/tj/commander.js/issues/43)

- program.options [\#29](https://github.com/tj/commander.js/issues/29)

**Merged pull requests:**

- version bump [\#309](https://github.com/tj/commander.js/pull/309) ([zhiyelee](https://github.com/zhiyelee))

- fix \#302 [\#308](https://github.com/tj/commander.js/pull/308) ([zhiyelee](https://github.com/zhiyelee))

- update README [\#300](https://github.com/tj/commander.js/pull/300) ([zhiyelee](https://github.com/zhiyelee))

- Bring gh-pages up to date and refactor documentation building process [\#299](https://github.com/tj/commander.js/pull/299) ([stephenmathieson](https://github.com/stephenmathieson))

- Revert "Make app name settable \#292" [\#298](https://github.com/tj/commander.js/pull/298) ([zhiyelee](https://github.com/zhiyelee))

- small refactor [\#296](https://github.com/tj/commander.js/pull/296) ([zhiyelee](https://github.com/zhiyelee))

- add info for git-style subcommand [\#295](https://github.com/tj/commander.js/pull/295) ([zhiyelee](https://github.com/zhiyelee))

- Make app name settable \#292 [\#293](https://github.com/tj/commander.js/pull/293) ([lawrencejones](https://github.com/lawrencejones))

- Fix a bug with variadic argument [\#291](https://github.com/tj/commander.js/pull/291) ([Quentin01](https://github.com/Quentin01))

- Typo fix [\#288](https://github.com/tj/commander.js/pull/288) ([sorrycc](https://github.com/sorrycc))

- add support for throwing error on finding missing required arguments. fi... [\#287](https://github.com/tj/commander.js/pull/287) ([vaidik](https://github.com/vaidik))

- Added test case for dashes in options [\#251](https://github.com/tj/commander.js/pull/251) ([henrytseng](https://github.com/henrytseng))

- avoid normalizing arguments after the double dash [\#130](https://github.com/tj/commander.js/pull/130) ([davidchambers](https://github.com/davidchambers))

- Add program.opts namespace for all options [\#35](https://github.com/tj/commander.js/pull/35) ([russpos](https://github.com/russpos))

## [v2.5.0](https://github.com/tj/commander.js/tree/v2.5.0) (2014-10-24)

[Full Changelog](https://github.com/tj/commander.js/compare/v2.4.0...v2.5.0)

**Closed issues:**

- command action throws error when description present [\#281](https://github.com/tj/commander.js/issues/281)

- The fn won't be excuted if no params is passed to it, is this bug? [\#276](https://github.com/tj/commander.js/issues/276)

- Variadic arguments to commands [\#53](https://github.com/tj/commander.js/issues/53)

**Merged pull requests:**

- version bump v2.5.0 [\#282](https://github.com/tj/commander.js/pull/282) ([zhiyelee](https://github.com/zhiyelee))

- Readme [\#279](https://github.com/tj/commander.js/pull/279) ([zhiyelee](https://github.com/zhiyelee))

- Updates links in readme [\#278](https://github.com/tj/commander.js/pull/278) ([shidel-dev](https://github.com/shidel-dev))

- Add support for variadic arguments [\#277](https://github.com/tj/commander.js/pull/277) ([whitlockjc](https://github.com/whitlockjc))

- add command alias support. see \#64 [\#104](https://github.com/tj/commander.js/pull/104) ([millermedeiros](https://github.com/millermedeiros))

- Add variadic arguments to commands and options. see \#53 [\#103](https://github.com/tj/commander.js/pull/103) ([millermedeiros](https://github.com/millermedeiros))

- fix promptForDate test by not using instanceOf check and a less precise date [\#101](https://github.com/tj/commander.js/pull/101) ([millermedeiros](https://github.com/millermedeiros))

- fix a bug in the `Variadic arguments` demo [\#280](https://github.com/tj/commander.js/pull/280) ([zhiyelee](https://github.com/zhiyelee))

## [v2.4.0](https://github.com/tj/commander.js/tree/v2.4.0) (2014-10-17)

[Full Changelog](https://github.com/tj/commander.js/compare/v2.3.0...v2.4.0)

**Fixed bugs:**

- Using 'filter' \(or other native array methods\) as a command causing error [\#248](https://github.com/tj/commander.js/issues/248)

- version command should output using `process.stdout.write` [\#246](https://github.com/tj/commander.js/issues/246)

- how to delete the mistyped password [\#6](https://github.com/tj/commander.js/issues/6)

**Closed issues:**

- What can we bind with .on options?  [\#269](https://github.com/tj/commander.js/issues/269)

- Disabling option descriptions [\#268](https://github.com/tj/commander.js/issues/268)

- retag without the 'v' appended to version [\#267](https://github.com/tj/commander.js/issues/267)

- How to use choose command? [\#263](https://github.com/tj/commander.js/issues/263)

- Remove "stdin" from the package keywords [\#261](https://github.com/tj/commander.js/issues/261)

- list and collection failed [\#244](https://github.com/tj/commander.js/issues/244)

- Accessing parent options from subcommand [\#243](https://github.com/tj/commander.js/issues/243)

- Support to know if any known command was processed, or any output written [\#240](https://github.com/tj/commander.js/issues/240)

- Option to add space padding  [\#236](https://github.com/tj/commander.js/issues/236)

- Is it possible to pass the same option more than once? [\#235](https://github.com/tj/commander.js/issues/235)

- Create a dev branch for development and keep master at current release version on npm [\#233](https://github.com/tj/commander.js/issues/233)

- Unable to install via npm [\#232](https://github.com/tj/commander.js/issues/232)

- Options for subcommand are parsed by parent command [\#227](https://github.com/tj/commander.js/issues/227)

- defaultAction or something... [\#219](https://github.com/tj/commander.js/issues/219)

- add support for option terminator -- [\#213](https://github.com/tj/commander.js/issues/213)

- Handling option --parse [\#154](https://github.com/tj/commander.js/issues/154)

- Parameter name collisions [\#152](https://github.com/tj/commander.js/issues/152)

- The confirm function hangs, on Node 0.9.3. [\#109](https://github.com/tj/commander.js/issues/109)

- Version 1.0.5 breaks help display that worked in 1.0.4 [\#95](https://github.com/tj/commander.js/issues/95)

- Show an arbitrary banner message \(Feature request\) [\#78](https://github.com/tj/commander.js/issues/78)

- Add Support For Title? [\#46](https://github.com/tj/commander.js/issues/46)

- How to go back to prompt [\#30](https://github.com/tj/commander.js/issues/30)

- options for commands [\#27](https://github.com/tj/commander.js/issues/27)

- Run a function on no actions [\#26](https://github.com/tj/commander.js/issues/26)

- nested password commands is freaky [\#21](https://github.com/tj/commander.js/issues/21)

- \[Request\] Allow change stream for prompt\(\), etc.. [\#13](https://github.com/tj/commander.js/issues/13)

- Use process.stdout.write\(\) instead of console.log\(\) [\#9](https://github.com/tj/commander.js/issues/9)

- prompt/password default for empty arguments [\#4](https://github.com/tj/commander.js/issues/4)

- automated sub-command help [\#2](https://github.com/tj/commander.js/issues/2)

- nested subcommands [\#1](https://github.com/tj/commander.js/issues/1)

**Merged pull requests:**

- v2.4.0 [\#275](https://github.com/tj/commander.js/pull/275) ([zhiyelee](https://github.com/zhiyelee))

- add .idea to .gitignore [\#274](https://github.com/tj/commander.js/pull/274) ([zhiyelee](https://github.com/zhiyelee))

- lint `\){` ==\> `\) {` [\#272](https://github.com/tj/commander.js/pull/272) ([zhiyelee](https://github.com/zhiyelee))

- Add license field to package.json [\#271](https://github.com/tj/commander.js/pull/271) ([phadej](https://github.com/phadej))

- fix subCommand [\#270](https://github.com/tj/commander.js/pull/270) ([zhiyelee](https://github.com/zhiyelee))

- remove the set functionality of the name [\#266](https://github.com/tj/commander.js/pull/266) ([zhiyelee](https://github.com/zhiyelee))

- rm unused variable [\#265](https://github.com/tj/commander.js/pull/265) ([zhiyelee](https://github.com/zhiyelee))

- implement Command.prototype.name\(\) [\#264](https://github.com/tj/commander.js/pull/264) ([tonylukasavage](https://github.com/tonylukasavage))

- add opts\(\) for getting key-value pairs [\#262](https://github.com/tj/commander.js/pull/262) ([tonylukasavage](https://github.com/tonylukasavage))

- Fix \#248 [\#249](https://github.com/tj/commander.js/pull/249) ([jonathandelgado](https://github.com/jonathandelgado))

- Output version information using process.stdout.write instead of console... [\#247](https://github.com/tj/commander.js/pull/247) ([jwarby](https://github.com/jwarby))

- add space padding [\#237](https://github.com/tj/commander.js/pull/237) ([rlidwka](https://github.com/rlidwka))

- Fix some style choices causing JSHint warnings [\#234](https://github.com/tj/commander.js/pull/234) ([thethomaseffect](https://github.com/thethomaseffect))

- bug fixing: function normalize doesn't honor option terminator. [\#216](https://github.com/tj/commander.js/pull/216) ([abbr](https://github.com/abbr))

- clean up usage argument summary [\#186](https://github.com/tj/commander.js/pull/186) ([dbushong](https://github.com/dbushong))

- add .idea to .gitignore [\#273](https://github.com/tj/commander.js/pull/273) ([zhiyelee](https://github.com/zhiyelee))

- Fix a typo in index.js [\#254](https://github.com/tj/commander.js/pull/254) ([rrthomas](https://github.com/rrthomas))

- Fix --help listening example [\#253](https://github.com/tj/commander.js/pull/253) ([rrthomas](https://github.com/rrthomas))

- Add npm badge to readme [\#252](https://github.com/tj/commander.js/pull/252) ([jbrudvik](https://github.com/jbrudvik))

- remove unused list function from custom-help example [\#191](https://github.com/tj/commander.js/pull/191) ([fyockm](https://github.com/fyockm))

- Improved key handling in commander.password [\#155](https://github.com/tj/commander.js/pull/155) ([whitelynx](https://github.com/whitelynx))

- add choose method message write [\#149](https://github.com/tj/commander.js/pull/149) ([CatTail](https://github.com/CatTail))

- fixed bug that stdin did not be paused after .prompt\(\) [\#133](https://github.com/tj/commander.js/pull/133) ([xingrz](https://github.com/xingrz))

- Test date failed [\#67](https://github.com/tj/commander.js/pull/67) ([sebastiendb](https://github.com/sebastiendb))

## [v2.3.0](https://github.com/tj/commander.js/tree/v2.3.0) (2014-07-17)

[Full Changelog](https://github.com/tj/commander.js/compare/2.2.0...v2.3.0)

**Closed issues:**

- I've forked/added features to commander, which ones are worth doing pull requests for? [\#229](https://github.com/tj/commander.js/issues/229)

- prompt\(\), choose\(\), ... non existant, but in the doc? [\#228](https://github.com/tj/commander.js/issues/228)

- Why "test.js -f" can't run into foo function? How to use it ? [\#223](https://github.com/tj/commander.js/issues/223)

- Expose `--help` message API [\#221](https://github.com/tj/commander.js/issues/221)

- npm: cannot find module with git-style subcommand [\#220](https://github.com/tj/commander.js/issues/220)

- wish: explicitly support input validation [\#215](https://github.com/tj/commander.js/issues/215)

- How do I implement `$ program help command` [\#205](https://github.com/tj/commander.js/issues/205)

-  Object \#<Command\> has no method 'choose' [\#199](https://github.com/tj/commander.js/issues/199)

- support for async option parsing [\#190](https://github.com/tj/commander.js/issues/190)

- Remove prompt commands from docs [\#178](https://github.com/tj/commander.js/issues/178)

- typo in docs for Command\#option [\#99](https://github.com/tj/commander.js/issues/99)

- Support command aliases [\#64](https://github.com/tj/commander.js/issues/64)

- Support more than one level of subcommands [\#63](https://github.com/tj/commander.js/issues/63)

- Take -version from package.json [\#48](https://github.com/tj/commander.js/issues/48)

**Merged pull requests:**

- Update History.md for 2.3.0 [\#231](https://github.com/tj/commander.js/pull/231) ([startswithaj](https://github.com/startswithaj))

- drop Node.js v0.4.x testing [\#218](https://github.com/tj/commander.js/pull/218) ([Mithgol](https://github.com/Mithgol))

- removed unused fs module [\#217](https://github.com/tj/commander.js/pull/217) ([tonylukasavage](https://github.com/tonylukasavage))

- use SVG to display Travis CI build testing status [\#214](https://github.com/tj/commander.js/pull/214) ([Mithgol](https://github.com/Mithgol))

- Added alias feature [\#210](https://github.com/tj/commander.js/pull/210) ([tandrewnichols](https://github.com/tandrewnichols))

- if args is falsy, assume a default collection. [\#209](https://github.com/tj/commander.js/pull/209) ([v0lkan](https://github.com/v0lkan))

- Update Readme.md [\#203](https://github.com/tj/commander.js/pull/203) ([plievone](https://github.com/plievone))

- bugfix: the coercion fn will not be called of optional  value, when not providing values [\#225](https://github.com/tj/commander.js/pull/225) ([zhiyelee](https://github.com/zhiyelee))

- remove `subcommand --help` output comma when more than one arg [\#212](https://github.com/tj/commander.js/pull/212) ([Treri](https://github.com/Treri))

- missed coercion function name [\#204](https://github.com/tj/commander.js/pull/204) ([maestrow](https://github.com/maestrow))

- remove .prompt .password .confirm .choose from documentation. [\#181](https://github.com/tj/commander.js/pull/181) ([LegitTalon](https://github.com/LegitTalon))

- Issue \#6 : Password with mask [\#54](https://github.com/tj/commander.js/pull/54) ([sebastiendb](https://github.com/sebastiendb))

## [2.2.0](https://github.com/tj/commander.js/tree/2.2.0) (2014-03-29)

[Full Changelog](https://github.com/tj/commander.js/compare/2.1.0...2.2.0)

**Closed issues:**

- Command action arguments [\#195](https://github.com/tj/commander.js/issues/195)

- Positional arguments on root command [\#193](https://github.com/tj/commander.js/issues/193)

- Required arguments aren't technically required. [\#185](https://github.com/tj/commander.js/issues/185)

- Multi Value Flags? [\#175](https://github.com/tj/commander.js/issues/175)

- Pass on options after `--` [\#118](https://github.com/tj/commander.js/issues/118)

- display help automatically or error message if user passes an invalid command [\#57](https://github.com/tj/commander.js/issues/57)

- Mandatory flags [\#44](https://github.com/tj/commander.js/issues/44)

**Merged pull requests:**

- Repeated options [\#198](https://github.com/tj/commander.js/pull/198) ([AlphaHydrae](https://github.com/AlphaHydrae))

- support subcommands on windows. Fixes \#142 [\#173](https://github.com/tj/commander.js/pull/173) ([yiminghe](https://github.com/yiminghe))

- Command.prototype.outputHelpIfNecessary [\#197](https://github.com/tj/commander.js/pull/197) ([tirana](https://github.com/tirana))

- Version callback and exit code fix [\#192](https://github.com/tj/commander.js/pull/192) ([freeformsystems](https://github.com/freeformsystems))

- Implement the wrapping of command and option descriptions [\#184](https://github.com/tj/commander.js/pull/184) ([socsieng](https://github.com/socsieng))

- Hidden commands [\#160](https://github.com/tj/commander.js/pull/160) ([sonnym](https://github.com/sonnym))

- Added localization capabilities to Commander.js - Issue \#128 [\#131](https://github.com/tj/commander.js/pull/131) ([mkautzmann](https://github.com/mkautzmann))

## [2.1.0](https://github.com/tj/commander.js/tree/2.1.0) (2013-11-21)

[Full Changelog](https://github.com/tj/commander.js/compare/2.0.0...2.1.0)

**Closed issues:**

- Support for `--cflags` style option parameters [\#174](https://github.com/tj/commander.js/issues/174)

- where are the input functions? [\#166](https://github.com/tj/commander.js/issues/166)

- custom "name" support [\#165](https://github.com/tj/commander.js/issues/165)

- Have you removed user inputs, \(prompt, choose, etc.\) ? [\#163](https://github.com/tj/commander.js/issues/163)

- No more input methods? [\#162](https://github.com/tj/commander.js/issues/162)

- move prompt and others into separate mods [\#159](https://github.com/tj/commander.js/issues/159)

- Subcommands doesn't appear to be working on Windows / node 0.10.2 [\#142](https://github.com/tj/commander.js/issues/142)

- Wrap lines [\#123](https://github.com/tj/commander.js/issues/123)

**Merged pull requests:**

- Support for `--cflags` style option parameters, unit test, fixes \#174 [\#176](https://github.com/tj/commander.js/pull/176) ([tonylukasavage](https://github.com/tonylukasavage))

- Explicitly define contents of npm package [\#161](https://github.com/tj/commander.js/pull/161) ([sindresorhus](https://github.com/sindresorhus))

- Use of dot notation to prevent array method name collision - fix error "execvp\(\): No such file or directory" [\#169](https://github.com/tj/commander.js/pull/169) ([aversini](https://github.com/aversini))

- split -abc="def" into -abc def [\#164](https://github.com/tj/commander.js/pull/164) ([yize](https://github.com/yize))

## [2.0.0](https://github.com/tj/commander.js/tree/2.0.0) (2013-07-19)

[Full Changelog](https://github.com/tj/commander.js/compare/1.3.2...2.0.0)

## [1.3.2](https://github.com/tj/commander.js/tree/1.3.2) (2013-07-18)

[Full Changelog](https://github.com/tj/commander.js/compare/1.3.1...1.3.2)

## [1.3.1](https://github.com/tj/commander.js/tree/1.3.1) (2013-07-18)

[Full Changelog](https://github.com/tj/commander.js/compare/1.3.0...1.3.1)

## [1.3.0](https://github.com/tj/commander.js/tree/1.3.0) (2013-07-09)

[Full Changelog](https://github.com/tj/commander.js/compare/1.2.0...1.3.0)

**Closed issues:**

- "-h, --help" is not work when using sub command [\#146](https://github.com/tj/commander.js/issues/146)

- Help doesn't work when using subcommands [\#110](https://github.com/tj/commander.js/issues/110)

**Merged pull requests:**

- Fixed spelling of 'pineapple' in Readme [\#158](https://github.com/tj/commander.js/pull/158) ([ChrisWren](https://github.com/ChrisWren))

- More nicer error handling [\#157](https://github.com/tj/commander.js/pull/157) ([noway421](https://github.com/noway421))

- Fixing issue with subcommands and --help [\#156](https://github.com/tj/commander.js/pull/156) ([noway421](https://github.com/noway421))

## [1.2.0](https://github.com/tj/commander.js/tree/1.2.0) (2013-06-13)

[Full Changelog](https://github.com/tj/commander.js/compare/1.1.1...1.2.0)

**Closed issues:**

- commander.js is dead ? [\#153](https://github.com/tj/commander.js/issues/153)

- How to create shell/repl? [\#136](https://github.com/tj/commander.js/issues/136)

- Dynamic loading commands problem [\#132](https://github.com/tj/commander.js/issues/132)

- Please include a license [\#124](https://github.com/tj/commander.js/issues/124)

- Subcommands unusable with npm link [\#115](https://github.com/tj/commander.js/issues/115)

- Usage option is not correct when using git-style executable subcommands [\#113](https://github.com/tj/commander.js/issues/113)

- support for values which start with a hyphen [\#107](https://github.com/tj/commander.js/issues/107)

**Merged pull requests:**

- allow "-" hyphen as an option argument [\#139](https://github.com/tj/commander.js/pull/139) ([kawanet](https://github.com/kawanet))

- support for regular expressions in coercion [\#120](https://github.com/tj/commander.js/pull/120) ([mreinstein](https://github.com/mreinstein))

- Don't ship dot files with the npm package [\#111](https://github.com/tj/commander.js/pull/111) ([vojtajina](https://github.com/vojtajina))

- Explain how to exit from multi-line prompt in README [\#148](https://github.com/tj/commander.js/pull/148) ([CatTail](https://github.com/CatTail))

- Git-like sub commands support on Windows [\#135](https://github.com/tj/commander.js/pull/135) ([mgutz](https://github.com/mgutz))

- Implemented 'Mandatory flags' per issue \#44 [\#98](https://github.com/tj/commander.js/pull/98) ([kppullin](https://github.com/kppullin))

- Required options can be bypassed [\#70](https://github.com/tj/commander.js/pull/70) ([RyanGordon](https://github.com/RyanGordon))

- Issue \#37 : --help should not display first [\#68](https://github.com/tj/commander.js/pull/68) ([sebastiendb](https://github.com/sebastiendb))

## [1.1.1](https://github.com/tj/commander.js/tree/1.1.1) (2012-11-20)

[Full Changelog](https://github.com/tj/commander.js/compare/1.1.0...1.1.1)

**Closed issues:**

- Usage shows \[undefined\] tokens [\#106](https://github.com/tj/commander.js/issues/106)

## [1.1.0](https://github.com/tj/commander.js/tree/1.1.0) (2012-11-17)

[Full Changelog](https://github.com/tj/commander.js/compare/1.0.5...1.1.0)

**Closed issues:**

- git-style subcommands [\#94](https://github.com/tj/commander.js/issues/94)

- stdin [\#88](https://github.com/tj/commander.js/issues/88)

- Commander.showHelp\(\) \(Feature request\) [\#79](https://github.com/tj/commander.js/issues/79)

**Merged pull requests:**

- accept multiple `usage\(\)` calls [\#100](https://github.com/tj/commander.js/pull/100) ([millermedeiros](https://github.com/millermedeiros))

- fix typo [\#96](https://github.com/tj/commander.js/pull/96) ([zemirco](https://github.com/zemirco))

- Update lib/commander.js [\#93](https://github.com/tj/commander.js/pull/93) ([kode4food](https://github.com/kode4food))

## [1.0.5](https://github.com/tj/commander.js/tree/1.0.5) (2012-10-10)

[Full Changelog](https://github.com/tj/commander.js/compare/1.0.4...1.0.5)

**Closed issues:**

- name argument collide with application name [\#92](https://github.com/tj/commander.js/issues/92)

- increase help output console limit [\#91](https://github.com/tj/commander.js/issues/91)

**Merged pull requests:**

- Updated the help example to use the outputHelp method. [\#89](https://github.com/tj/commander.js/pull/89) ([rodolfocaldeira](https://github.com/rodolfocaldeira))

## [1.0.4](https://github.com/tj/commander.js/tree/1.0.4) (2012-09-03)

[Full Changelog](https://github.com/tj/commander.js/compare/1.0.3...1.0.4)

**Merged pull requests:**

- Add outputHelp method to Command object. [\#86](https://github.com/tj/commander.js/pull/86) ([karthikv](https://github.com/karthikv))

## [1.0.3](https://github.com/tj/commander.js/tree/1.0.3) (2012-08-30)

[Full Changelog](https://github.com/tj/commander.js/compare/1.0.2...1.0.3)

## [1.0.2](https://github.com/tj/commander.js/tree/1.0.2) (2012-08-24)

[Full Changelog](https://github.com/tj/commander.js/compare/1.0.1...1.0.2)

**Closed issues:**

- Commander output strange message using node.js v0.4.9 [\#81](https://github.com/tj/commander.js/issues/81)

**Merged pull requests:**

- fix password on node 0.8.8. Make backward compatible with 0.6. [\#87](https://github.com/tj/commander.js/pull/87) ([focusaurus](https://github.com/focusaurus))

- Add support for equal sign [\#85](https://github.com/tj/commander.js/pull/85) ([arv](https://github.com/arv))

- Add support for equal sign [\#84](https://github.com/tj/commander.js/pull/84) ([arv](https://github.com/arv))

- Add support for equal sign [\#83](https://github.com/tj/commander.js/pull/83) ([arv](https://github.com/arv))

## [1.0.1](https://github.com/tj/commander.js/tree/1.0.1) (2012-08-03)

[Full Changelog](https://github.com/tj/commander.js/compare/1.0.0...1.0.1)

**Fixed bugs:**

- sub-command args seem off [\#56](https://github.com/tj/commander.js/issues/56)

**Closed issues:**

- Is it possible for commands to have their own set of options? [\#71](https://github.com/tj/commander.js/issues/71)

- Update node compatibility in package.json to work with node \>= 7.x [\#60](https://github.com/tj/commander.js/issues/60)

**Merged pull requests:**

- Fix issue \#56 where options parsing strips off arguments that it shouldn't [\#77](https://github.com/tj/commander.js/pull/77) ([orthlieb](https://github.com/orthlieb))

- Hi! I fixed some code for you! [\#73](https://github.com/tj/commander.js/pull/73) ([node-migrator-bot](https://github.com/node-migrator-bot))

## [1.0.0](https://github.com/tj/commander.js/tree/1.0.0) (2012-07-05)

[Full Changelog](https://github.com/tj/commander.js/compare/0.6.1...1.0.0)

**Closed issues:**

- npm install failing for node v0.8 [\#66](https://github.com/tj/commander.js/issues/66)

**Merged pull requests:**

- Make description optional and avoid printing "--someoption undefined" in... [\#69](https://github.com/tj/commander.js/pull/69) ([focusaurus](https://github.com/focusaurus))

- Issue \#48 : Take -version from package.json [\#55](https://github.com/tj/commander.js/pull/55) ([sebastiendb](https://github.com/sebastiendb))

- Issue \#37 : --help should not display first [\#52](https://github.com/tj/commander.js/pull/52) ([sebastiendb](https://github.com/sebastiendb))

## [0.6.1](https://github.com/tj/commander.js/tree/0.6.1) (2012-06-01)

[Full Changelog](https://github.com/tj/commander.js/compare/0.6.0...0.6.1)

**Closed issues:**

- running in current shell [\#51](https://github.com/tj/commander.js/issues/51)

**Merged pull requests:**

- allow node.js v0.7.x [\#62](https://github.com/tj/commander.js/pull/62) ([ryancole](https://github.com/ryancole))

- Fix version flag in help menu [\#58](https://github.com/tj/commander.js/pull/58) ([cliffano](https://github.com/cliffano))

## [0.6.0](https://github.com/tj/commander.js/tree/0.6.0) (2012-04-11)

[Full Changelog](https://github.com/tj/commander.js/compare/0.5.1...0.6.0)

**Closed issues:**

- Unable to require in a subdirectory [\#50](https://github.com/tj/commander.js/issues/50)

**Merged pull requests:**

- Fixed the choice example [\#45](https://github.com/tj/commander.js/pull/45) ([raincole](https://github.com/raincole))

- Feature request for multiple prompt [\#49](https://github.com/tj/commander.js/pull/49) ([kuwabarahiroshi](https://github.com/kuwabarahiroshi))

- Not sure if ternary's cleaner [\#42](https://github.com/tj/commander.js/pull/42) ([shezard](https://github.com/shezard))

- Changed choose method so it can now return a default item if none is spe... [\#41](https://github.com/tj/commander.js/pull/41) ([Shogun147](https://github.com/Shogun147))

- commander.js\#camelcase [\#40](https://github.com/tj/commander.js/pull/40) ([sandro-pasquali](https://github.com/sandro-pasquali))

- Allow multiple arguments to a command [\#38](https://github.com/tj/commander.js/pull/38) ([DukeyToo](https://github.com/DukeyToo))

## [0.5.1](https://github.com/tj/commander.js/tree/0.5.1) (2011-12-20)

[Full Changelog](https://github.com/tj/commander.js/compare/0.5.0...0.5.1)

**Closed issues:**

- stdin is not initialized: program.password\(\) fails [\#36](https://github.com/tj/commander.js/issues/36)

**Merged pull requests:**

- Added prompt tests and fixed four issues [\#34](https://github.com/tj/commander.js/pull/34) ([martypdx](https://github.com/martypdx))

## [0.5.0](https://github.com/tj/commander.js/tree/0.5.0) (2011-12-04)

[Full Changelog](https://github.com/tj/commander.js/compare/0.4.3...0.5.0)

## [0.4.3](https://github.com/tj/commander.js/tree/0.4.3) (2011-12-04)

[Full Changelog](https://github.com/tj/commander.js/compare/0.4.2...0.4.3)

**Closed issues:**

- custom help inverted order [\#32](https://github.com/tj/commander.js/issues/32)

## [0.4.2](https://github.com/tj/commander.js/tree/0.4.2) (2011-11-24)

[Full Changelog](https://github.com/tj/commander.js/compare/0.4.1...0.4.2)

**Closed issues:**

- Invisible new space in prompt input [\#31](https://github.com/tj/commander.js/issues/31)

**Merged pull requests:**

- Add options to subcommands [\#28](https://github.com/tj/commander.js/pull/28) ([itay](https://github.com/itay))

## [0.4.1](https://github.com/tj/commander.js/tree/0.4.1) (2011-11-18)

[Full Changelog](https://github.com/tj/commander.js/compare/0.4.0...0.4.1)

## [0.4.0](https://github.com/tj/commander.js/tree/0.4.0) (2011-11-15)

[Full Changelog](https://github.com/tj/commander.js/compare/0.3.3...0.4.0)

**Closed issues:**

- Support for -- [\#24](https://github.com/tj/commander.js/issues/24)

## [0.3.3](https://github.com/tj/commander.js/tree/0.3.3) (2011-11-14)

[Full Changelog](https://github.com/tj/commander.js/compare/0.3.2...0.3.3)

## [0.3.2](https://github.com/tj/commander.js/tree/0.3.2) (2011-11-01)

[Full Changelog](https://github.com/tj/commander.js/compare/0.3.1...0.3.2)

**Merged pull requests:**

- Fix: Long-only flags would not take values [\#23](https://github.com/tj/commander.js/pull/23) ([felixge](https://github.com/felixge))

## [0.3.1](https://github.com/tj/commander.js/tree/0.3.1) (2011-10-31)

[Full Changelog](https://github.com/tj/commander.js/compare/0.3.0...0.3.1)

**Merged pull requests:**

- Make version flags configurable [\#22](https://github.com/tj/commander.js/pull/22) ([felixge](https://github.com/felixge))

## [0.3.0](https://github.com/tj/commander.js/tree/0.3.0) (2011-10-31)

[Full Changelog](https://github.com/tj/commander.js/compare/0.2.1...0.3.0)

**Closed issues:**

- Doing long-only options is awkward [\#18](https://github.com/tj/commander.js/issues/18)

- version 0.4.x, install via npm [\#12](https://github.com/tj/commander.js/issues/12)

## [0.2.1](https://github.com/tj/commander.js/tree/0.2.1) (2011-10-24)

[Full Changelog](https://github.com/tj/commander.js/compare/0.2.0...0.2.1)

**Merged pull requests:**

- Allow for empty \[optional\] options and actually default them to their default [\#17](https://github.com/tj/commander.js/pull/17) ([jimisaacs](https://github.com/jimisaacs))

- Relax the node.js dependency. [\#20](https://github.com/tj/commander.js/pull/20) ([koush](https://github.com/koush))

- Allow for empty \[optional\] options and actually default them to their default [\#16](https://github.com/tj/commander.js/pull/16) ([jimisaacs](https://github.com/jimisaacs))

- Refactor for option defaults, with tests [\#15](https://github.com/tj/commander.js/pull/15) ([jimisaacs](https://github.com/jimisaacs))

## [0.2.0](https://github.com/tj/commander.js/tree/0.2.0) (2011-09-26)

[Full Changelog](https://github.com/tj/commander.js/compare/0.1.0...0.2.0)

**Closed issues:**

- Allow trailing argument [\#14](https://github.com/tj/commander.js/issues/14)

- Node 0.5 compliance [\#10](https://github.com/tj/commander.js/issues/10)

- Show help if no command was executed [\#7](https://github.com/tj/commander.js/issues/7)

**Merged pull requests:**

- Chumpalump [\#11](https://github.com/tj/commander.js/pull/11) ([chumpalump](https://github.com/chumpalump))

- Added repository [\#8](https://github.com/tj/commander.js/pull/8) ([dylang](https://github.com/dylang))

## [0.1.0](https://github.com/tj/commander.js/tree/0.1.0) (2011-08-24)

[Full Changelog](https://github.com/tj/commander.js/compare/0.0.5...0.1.0)

## [0.0.5](https://github.com/tj/commander.js/tree/0.0.5) (2011-08-19)

[Full Changelog](https://github.com/tj/commander.js/compare/0.0.4...0.0.5)

**Fixed bugs:**

- password breaks when starting with a number [\#3](https://github.com/tj/commander.js/issues/3)

**Merged pull requests:**

- Fixed issue with passwords beginning with numbers. [\#5](https://github.com/tj/commander.js/pull/5) ([NuckChorris](https://github.com/NuckChorris))

## [0.0.4](https://github.com/tj/commander.js/tree/0.0.4) (2011-08-15)

[Full Changelog](https://github.com/tj/commander.js/compare/0.0.3...0.0.4)

## [0.0.3](https://github.com/tj/commander.js/tree/0.0.3) (2011-08-15)

[Full Changelog](https://github.com/tj/commander.js/compare/0.0.2...0.0.3)

## [0.0.2](https://github.com/tj/commander.js/tree/0.0.2) (2011-08-15)

[Full Changelog](https://github.com/tj/commander.js/compare/0.0.1...0.0.2)

## [0.0.1](https://github.com/tj/commander.js/tree/0.0.1) (2011-08-14)



\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*
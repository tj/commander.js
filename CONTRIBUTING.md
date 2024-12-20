# Contributing

## Issues

New issues are welcome, whether questions or suggestions or reporting bugs.
You are also welcome to contribute by adding helpful comments on an existing issue.

We love reproducible code examples in questions and answers.

If you get a satisfactory reply to a question then please close your issue, but it is ok to leave an issue open for more replies or interest. Inactive issues may get closed after one month if they have an answer,
or after six months otherwise.

## Pull Requests

Pull Requests will be considered. Please submit pull requests against the develop branch.

Follow the existing code style. Check the tests succeed, including format and lint.

- `npm run test`
- `npm run check`

Don't update the CHANGELOG or command version number. That gets done by maintainers when preparing the release.

Useful things to include in your request description are:

- what problem are you solving?
- what Issues does this relate to?
- suggested summary for CHANGELOG

There are a lot of forms of documentation which could need updating for a change in functionality. It
is ok if you want to show us the code to discuss before doing the extra work, and
you should say so in your comments so we focus on the concept first before talking about all the other pieces:

- TypeScript typings
- JSDoc documentation in code
- tests
- README
- examples/

Commander currently has zero production dependencies. That isn't a hard requirement, but is a simple story. Requests which add a dependency are much less likely to be accepted, and we are likely to ask for alternative approaches to avoid the dependency.

- <https://devrant.com/rants/1854993/package-tsunami>
- <https://dev.to/leoat12/the-nodemodules-problem-29dc>

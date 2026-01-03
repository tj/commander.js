# Release Policy

We follow [Semantic Versioning](http://semver.org/spec/v2.0.0.html), and limit breaking changes to major versions.

There are major releases about every six months. We do a major release and bump the minimum required node version when LTS Node.js versions reach end-of-life.

The release notes for major versions highlight breaking changes, and include a section of migration tips for common changes required.
The [Changelog](../CHANGELOG.md) lists release notes for all versions.

The current release line gets all updates: features, bug fixes, and security updates. Older maintenance versions get just security updates for 12 months.

| Version | First Release | Release Note |  Status | End of Life |
| ------- | ------------- | - | ------- | ----------- |
| 14.x | 2025-05-18 | [14.0.0](https://github.com/tj/commander.js/releases/tag/v14.0.0) | current | |
| 13.x | 2024-12-30 | [13.0.0](https://github.com/tj/commander.js/releases/tag/v13.0.0) | maintenance | 2026-05-18 |
| 12.x | 2024-02-03 | [12.0.0](https://github.com/tj/commander.js/releases/tag/v12.0.0) | maintenance | 2025-12-30 |

Older versions do not automatically get security updates.

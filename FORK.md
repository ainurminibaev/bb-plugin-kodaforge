# This fork

The `own` branch is KodaForge by [Kodaks94](https://github.com/Kodaks94/bb-plugin-kodaforge)
plus the changes below. Each one is a branch from the author's `main` and a pull request to
the author; when a change is released upstream, its branch is no longer needed here.

| Change | Branch |
| --- | --- |
| No highlight on ambiguous Unicode letters | `fix/unicode-highlight-scroll` |
| Terminal echo without the idle delay | `fix/terminal-echo-latency` |
| Workspace tabs: labels, Close others, Close all | `feat/workspace-tabs-labels-close-all` |
| Previews of images, media, PDF and office documents | `feat/file-previews` |
| Markdown and SVG previews | `feat/markdown-preview` |
| CSV and TSV previews (needs the two above) | `feat/csv-preview` |
| Explorer: Open in Terminal, menu items from other plugins | `feat/explorer-actions` |
| Separate workspace tabs per project (setting) | `feat/separate-workspace-tabs` |

Releases are tagged `own/vX.Y.Z`, apart from the author's `vX.Y.Z`. The patch number is
`(author's patch + 1) * 100 + build`, so `0.7.100` is the author's `0.7.0` with these changes
and `0.7.200` would be `0.7.1` with them. Install:

```sh
bb plugin install 'git:https://github.com/ainurminibaev/bb-plugin-kodaforge.git@>=0.7.100 <1.0.0' --tag-prefix own/
```

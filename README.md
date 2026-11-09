# va-chronical-missing-issues

A Node.js script that detects which issues are missing from an online newspaper archive. It downloads the archive's calendar page for a paper, finds the dates that are available, compares them to the paper's publishing frequency, and writes a CSV report of the dates that are missing.

## Status

July 2024 experiment. The paper (a three-letter code such as `WST`) and the frequency in days are set at the top of `index.js`.

## Use

```sh
npm install
node index.js
```

It saves the downloaded page as `paper-<code>.html` and the report as `paper-<code>.csv` in the current folder.

## License

MIT. See [LICENSE.md](LICENSE.md).

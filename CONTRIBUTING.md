# Contributing

Please read and follow our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing to the project.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This project uses [pnpm](https://pnpm.js.org/) to manage dependencies, but should work by replacing the `pnpm` comamnds with `npm` if you have [npm](https://www.npmjs.com/).

For example, installing the dependencies can work with either:

```bash
pnpm install
```

or

```bash
npm install
```

The same can apply to `pnpx` to `npx` commands. `pnpm` and `pnpx` are recommended, however.

### Installing

Once you have your package manager of choice up and running, get the packages needed for this project with the following command:

```bash
pnpm install
```

### Code style fixing / checking

To keep our code consistent we use some style fixers and checkers.

Run the style fixers with:

```bash
pnpm run autofix
```

This'll fix everything that can be fixed automatically. It runs `prettier`, `stylelint --fix` and `tslint --fix` on the source files.

Linters can be run with:

```bash
pnpm run lint
```

This'll do code style checks for code that can't automatically be fixed-
be sure to read the errors and fix anything before committing. This runs `stylelint` and `tslint`.

## Running the tests

Automated testing isn't set up yet, but there's a simple manual html test, which will compile the code that'll re-compile on changes and run a `test.html` file on a local server.

Run the test with the following command:

```bash
pnpm run test
```

## Deployment

Building this ready for deployment is as easy as:

```bash
pnpm run build
```

From there, the files in the `dist` folder must be uploaded to the same
directory, and then include the `video-tag.js` file in your code with a
`<script>` tag and the `video-tag.css` file in your code with a `<link rel="stylesheet">` tag.

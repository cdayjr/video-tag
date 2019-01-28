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

```bash
pnpm run lint
```

This'll do code style checks for code and fix that which can be automatically
fixed- be sure to read the errors and fix anything before committing. This runs
`tsc`, `prettier`, `stylelint` and `eslint`.

## Tests

We're using jest to run automated tests. Run them with the following command:

```
pnpm run test
```

You can also check test coverage with the following command:

```
pnpm run test-coverage
```

## Demonstrating the code in your browser

You can test out various embed codes with the provided demo code.
The code in the `demo` directory is used for this- code in that directory is not
built when the build command is run.

Run the demo with the following command:

```bash
pnpm run demo
```

and load it up in your browser(s) of choice to see the code in action.

## Deployment

Building this ready for deployment is as easy as:

```bash
pnpm run build
```

From there, the files in the `dist` folder must be uploaded to the same
directory, and then include the `video-tag.js` file in your code with a
`<script>` tag and the `video-tag.css` file in your code with a `<link rel="stylesheet">` tag.

## Adding a new provider

If you're interested in adding a new video provider, you'll want to
do a few steps first:

- Add relevant entries for it in the `demoTags` array in the `demo/index.ts` file so you can see the provider in action
  in your browser.
- Add tests; I recommend building the tests out first as a test-driven-design strategy. Tests are in the following
  directories- don't be afraid to look at the other providers in the directories
  for some guidance:
  - `tests/unit/classes/providers` - Unit tests
  - `tests/integration/providers` - Integration tests
  - `tests/snapshots/providers` - Snapshot tests
- Finally the provider code itself; make sure to extend the `VideoProvider` abstract class and add your provider in the
  `src/classes/providers/` directory and update
  the array in the `src/classes/VideoProviderFactory.ts` to include
  your provider so the code can make use of it.

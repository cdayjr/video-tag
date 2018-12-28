# Video Tag

JavaScript for making video bbcodes and similar things as simple as they can get. Currently supports Twitch, Vimeo, and YouTube videos.

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

## Running the tests

Automated testing isn't set up yet, but there's a simple manual html test, which will compile the code that'll re-compile on changes and run a `test.html` file on a local server.

Run the test with the following command:

```bash
pnpm run test
```

### And coding style tests

Explain what these tests test and why

```bash
Give an example
```

## Deployment

Building this ready for deployment is as easy as:

```bash
pnpm run build
```

From there, the files in the `dist` folder must be uploaded to the same
directory, and then include the `video-tag.js` file in your code with a
`<script>` tag and the `video-tag.css` file in your code with a `<link rel="stylesheet">` tag.

## Usage

Once the code has been deployed to your site, it'll look for `div` tags with the `video-tag` class. If the tag has a `data-content` attribute with a URL in it. An example would be:

```html
    <div class="video-tag" data-content="https://www.youtube.com/watch?v=g4Hbz2jLxvQ"></div>
```

This is the bare minimum, of course, so a fallback link to the content is recommended like so:

```html
    <div class="video-tag" data-content="https://www.youtube.com/watch?v=g4Hbz2jLxvQ"><a class="video-tag-fallback" href="https://www.youtube.com/watch?v=58OabCRCx_Q">https://www.youtube.com/watch?v=58OabCRCx_Q</a></div>
```

For [Jcink Forum Hosting](https://jcink.net), a 1 paramater video tag with the following content:

```html
<div class="video-tag" data-content="(PARAM1)"><a class="video-tag-fallback" href="(PARAM1)">(PARAM1)</a></div>
```

should be sufficient if you have the JavaScript and CSS loaded in your board wrappers. It's recommend you style the `video-tag` class in your own stylesheet to how you'd like, a sample is:

```css
.video-tag {
  margin: 1em 1em 1em 0;
  max-width: 100%;
}
```

## Built With

- [Babel](https://babeljs.io/)
- [Bootstrap](https://getbootstrap.com/) - Bootstrap responsive 16:9 embed CSS used
- [PostCSS](https://postcss.org/)
- [SCSS](https://sass-lang.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [parcel](https://parceljs.org/) - The bundler that brings it all together
- [pnpm](https://pnpm.js.org/) - JavaScript package management
- [prettier](https://prettier.io/)
- [stylelint](https://stylelint.io/)
- [tslint](https://palantir.github.io/tslint/)

## Contributing

Contributing information coming soon! Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before submitting an issue.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/cdayjr/video-tag/tags).

## Authors

- **Chad Wade Day, Jr.** - _Initial work_ - [@cdayjr](https://github.com/cdayjr)

See also the list of [contributors](https://github.com/cdayjr/video-tag/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Many video bbcode tags I've seen in the past inspiring me to take my own swing at it.

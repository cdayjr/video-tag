# Video Tag

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/cdayjr/video-tag.svg?branch=master)](https://travis-ci.org/cdayjr/video-tag)
[![Coverage Status](https://coveralls.io/repos/github/cdayjr/video-tag/badge.svg)](https://coveralls.io/github/cdayjr/video-tag)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/62571b6fd46f4ea0b7550359cdb93e03)](https://app.codacy.com/app/cdayjr/video-tag?utm_source=github.com&utm_medium=referral&utm_content=cdayjr/video-tag&utm_campaign=Badge_Grade_Dashboard)

JavaScript for making video bbcodes and similar things as simple as they can get.

## Supports

- YouTube videos (with timestamps)
- YouTube playlists
  - YouTube playlists that start from a specific video (with timestamps)
  - YouTube user uploads list
  - YouTube playlists that are just comma separated video IDs
- Vimeo videos (with timestamps)
- Vimeo albums
- Twitch videos (VODs) (with timestamps)
- Twitch channels
- Twitch collections
- Twitch clips
- Mixer channels
- Mixer videos (VODs)

## Usage

See the [github wiki](https://github.com/cdayjr/video-tag/wiki) for
platform-specific installation instructions.

Here's a simple installation guide:

Run the build script (`pnpm run build`) and upload the files from the `dist`
folder or the contents of a release zip file and include `video-tag.js` and
`video-tag.css` with a `<script>` and `<link>` tag, respectively.

Once the code has been deployed to your site, it'll look for `div` tags with
the `video-tag` class. If the tag has a `data-source` attribute with a URL in
it. An example would be:

```html
<div
  class="video-tag"
  data-source="https://www.youtube.com/watch?v=g4Hbz2jLxvQ"
></div>
```

This is the bare minimum, of course, so a fallback link to the source is
recommended like so:

```html
<div
  class="video-tag"
  data-source="https://www.youtube.com/watch?v=g4Hbz2jLxvQ"
>
  <a
    class="video-tag-fallback"
    href="https://www.youtube.com/watch?v=58OabCRCx_Q"
    >https://www.youtube.com/watch?v=58OabCRCx_Q</a
  >
</div>
```

For [Jcink Forum Hosting](https://jcink.net), a 1 paramater video tag with the
following content:

```html
<div class="video-tag" data-source="(PARAM1)">
  <a class="video-tag-fallback" href="(PARAM1)">(PARAM1)</a>
</div>
```

should be sufficient if you have the JavaScript and CSS loaded in your board
wrappers. It's recommend you style the `video-tag` class in your own stylesheet
to how you'd like, a sample is:

```css
.video-tag {
  margin: 1em 1em 1em 0;
  max-width: 100%;
}
```

### Available functions

You can also call bits of the JavaScript from a third party script. We export
the following functions:

- `getVideoTags` - Returns a `HTMLDivElement` `NodeList` containing all HTML
  tags that match the format that haven't been parsed.
- `parseVideoTag` - Takes an `HTMLDivElement` that matches the format and parses
  it through our code, removing the contents and placing an iframe or error
  message in there.
- `parseVideoTags` - Gets all the tags via `getVideoTags` and parses each of
  them with `parseVideoTag`.
- `urlToEmbedUrl` - Take a video URL and get just the embed URL for it.

## Notes

- YouTube links that include both a playlist and video ID will embed the video
  and not the playlist. YouTube playlist embedding does not support
  starting from a specific video and it's probably more likely a user wants to
  embed the video they have a link to and not the playlist it belongs to.
- Twitch embeds don't work on Internet Explorer 11. This seems to be an issue
  on their end, let them know since they appareltny say they should support
  Internet Explorer 11.
- ID-only sources only work for video IDs and Twitch channels- everything else
  will require a full URL as the source parameter even with the provider param
  set.
  - For Mixer, only channel IDs work. This is because Mixer requires the
    correct channel to embed a VOD.

## Built With

- [Babel](https://babeljs.io/)
- [Bootstrap](https://getbootstrap.com/) responsive 16:9 embed CSS
- [PostCSS](https://postcss.org/)
- [SCSS](https://sass-lang.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [eslint](https://eslint.org/)
- [jest](https://jestjs.io/) - Tests
- [parcel](https://parceljs.org/) - The bundler that brings it all together
- [pnpm](https://pnpm.js.org/) - JavaScript package management
- [prettier](https://prettier.io/)
- [stylelint](https://stylelint.io/)

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for information on how to
contribute, as well as details getting this up and running for development.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available,
see the [tags on this repository](https://github.com/cdayjr/video-tag/tags).

## Authors

- **Chad Wade Day, Jr.** - _Initial work_ - [@cdayjr](https://github.com/cdayjr)

See also the list of [contributors](https://github.com/cdayjr/video-tag/contributors)
who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md)
file for details

## Acknowledgments

- Many video bbcode tags I've seen in the past inspiring me to take my own
  swing at it.

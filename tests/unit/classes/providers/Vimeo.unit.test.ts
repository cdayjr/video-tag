/**
 * @file Vimeo unit tests
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import Vimeo from "../../../../src/classes/providers/Vimeo";

test("getProviderString is vimeo", () => {
  expect(Vimeo.getProviderString()).toBe("vimeo");

  // test non-static variant
  const vimeo = new Vimeo("");
  expect(vimeo.getProviderString()).toBe("vimeo");
});

test("empty source returns an empty getElement", () => {
  const vimeo = new Vimeo("");

  expect(vimeo.getElement()).toBeNull();
});

interface Options {
  id: string;
  timestamp?: string;
}

interface AlbumOptions {
  album: string;
}

const vimeoExpect =
  "https://player.vimeo.com/video/16679115?autoplay=0&byline=0&color=ffffff&portrait=0&title=0";
const vimeoWithStartExpect =
  "https://player.vimeo.com/video/16679115?autoplay=0&byline=0&color=ffffff&portrait=0&title=0#t=0h10m0s";
const vimeoAlbumExpect = "https://vimeo.com/album/1719434/embed";
const vimeoOptions: Options = {
  id: "16679115",
};

const vimeoOptionsWithStart: Options = {
  id: "16679115",
  timestamp: "0h10m0s",
};

const vimeoAlbumOptions: AlbumOptions = {
  album: "1719434",
};

const inputs: {
  source: string;
  expect: string;
  options: Options | AlbumOptions;
}[] = [
  // video embed url
  {
    source: vimeoExpect,
    expect: vimeoExpect,
    options: vimeoOptions,
  },
  // video url
  {
    source: "https://vimeo.com/16679115",
    expect: vimeoExpect,
    options: vimeoOptions,
  },
  // video url with /video
  {
    source: "https://vimeo.com/video/16679115",
    expect: vimeoExpect,
    options: vimeoOptions,
  },
  // video url with http
  {
    source: "http://vimeo.com/16679115",
    expect: vimeoExpect,
    options: vimeoOptions,
  },
  // video url with www
  {
    source: "http://www.vimeo.com/16679115",
    expect: vimeoExpect,
    options: vimeoOptions,
  },
  // video url with useless param
  {
    source: "https://vimeo.com/16679115#nontimestampparam=true",
    expect: vimeoExpect,
    options: vimeoOptions,
  },
  // video url with timestamp
  {
    source: "https://vimeo.com/16679115#t=0h10m0s",
    expect: vimeoWithStartExpect,
    options: vimeoOptionsWithStart,
  },
  // video embed url with timestamp
  {
    source: vimeoWithStartExpect,
    expect: vimeoWithStartExpect,
    options: vimeoOptionsWithStart,
  },
  // video id
  {
    source: "16679115",
    expect: vimeoExpect,
    options: vimeoOptions,
  },
  // album url
  {
    source: "https://vimeo.com/album/1719434",
    expect: vimeoAlbumExpect,
    options: vimeoAlbumOptions,
  },
  // album embed url
  {
    source: vimeoAlbumExpect,
    expect: vimeoAlbumExpect,
    options: vimeoAlbumOptions,
  },
];

inputs.forEach((input) => {
  test(`${input.source} is handled correctly`, () => {
    const vimeo = new Vimeo(input.source);

    expect(vimeo.getEmbedURL()).toBe(input.expect);

    const vimeoElementHTML = vimeo.getElement() as HTMLElement;

    expect(vimeoElementHTML.getAttribute("src")).toBe(input.expect);
  });
});

const invalidInputs: string[] = [
  "https://www.youtube.com/watch?v=g4Hbz2jLxvQ",
  "https://youtu.be/g4Hbz2jLxvQ",
  "https://www.twitch.tv/videos/355193670",
  "https://www.twitch.tv/videos/355193670?t=02h16m51s",
  "https://www.twitch.tv/impactwrestling",
  "impactwrestling",
];

invalidInputs.forEach((input) => {
  test(`Incorrect Source: ${input}`, () => {
    const vimeo = new Vimeo(input);
    expect(vimeo.getEmbedURL()).toBeFalsy();
    expect(vimeo.getElement()).toBeNull();
  });
});

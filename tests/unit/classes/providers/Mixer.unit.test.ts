/**
 * @file Mixer unit tests
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import Mixer from "../../../../src/classes/providers/Mixer";

const paramStringToObject = (input: string): { [key: string]: string } => {
  const output: { [key: string]: string } = {};
  new URLSearchParams(input).forEach((value, key) => {
    output[key] = value;
  });
  return output;
};

test("getProviderString is mixer", () => {
  expect(Mixer.getProviderString()).toBe("mixer");

  // test non-static variant
  const mixer = new Mixer("");
  expect(mixer.getProviderString()).toBe("mixer");
});

test("Test empty source returns an empty getElement", () => {
  const mixer = new Mixer("");

  expect(mixer.getElement()).toBeNull();
});

test("Test importOptions and exportOptions with ? prefix", () => {
  const mixer = new Mixer("");

  const initialString = "test=test&test2=2&test3=true&test4&test5=&test6=test";

  mixer.importOptions(`?${initialString}`);

  expect(paramStringToObject(mixer.exportOptions())).toEqual({
    test: "test",
    test2: "2",
    test3: "true",
    test4: "",
    test5: "",
    test6: "test",
  });
});

test("Test importOptions and exportOptions without ? prefix and duplicate keys", () => {
  const mixer = new Mixer("");

  const initialString =
    "test=test&test2=2&test3=true&test4&test5=&test6=test&test=test2&test4=4";

  mixer.importOptions(initialString);

  expect(paramStringToObject(mixer.exportOptions())).toEqual({
    test: "test2",
    test2: "2",
    test3: "true",
    test4: "4",
    test5: "",
    test6: "test",
  });
});

interface Options {
  channel: string;
  vod?: string;
  t?: string;
}

const mixerChannelExpect = "https://mixer.com/embed/player/Mixer?";
const mixerVODExpect = "https://mixer.com/embed/player/Mixer?vod=34749442";
const mixerVODWithTimestampExpect =
  "https://mixer.com/embed/player/Mixer?vod=34749442&t=1m";

const mixerChannelOptions: Options = {
  channel: "Mixer",
};
const mixerVODOptions: Options = {
  channel: "Mixer",
  vod: "34749442",
};
const mixerVODWithTimestampOptions: Options = {
  channel: "Mixer",
  vod: "34749442",
  t: "1m",
};

const inputs: {
  source: string;
  expect: string;
  options: Options;
}[] = [
  // Regular channel URL
  {
    source: "https://www.mixer.com/Mixer",
    expect: mixerChannelExpect,
    options: mixerChannelOptions,
  },
  // Regular channel URL (http)
  {
    source: "http://www.mixer.com/Mixer",
    expect: mixerChannelExpect,
    options: mixerChannelOptions,
  },
  // Regular channel URL (no www)
  {
    source: "https://mixer.com/Mixer",
    expect: mixerChannelExpect,
    options: mixerChannelOptions,
  },
  // Channel name
  {
    source: "Mixer",
    expect: mixerChannelExpect,
    options: mixerChannelOptions,
  },
  // Embed channel URL
  {
    source: mixerChannelExpect,
    expect: mixerChannelExpect,
    options: mixerChannelOptions,
  },
  // Regular VOD URL
  {
    source: "https://mixer.com/Mixer?vod=34749442",
    expect: mixerVODExpect,
    options: mixerVODOptions,
  },
  // Embed VOD URL
  {
    source: mixerVODExpect,
    expect: mixerVODExpect,
    options: mixerVODOptions,
  },
  // Regular VOD URL with timestamp
  {
    source: "https://mixer.com/Mixer?vod=34749442&t=1m",
    expect: mixerVODWithTimestampExpect,
    options: mixerVODWithTimestampOptions,
  },
  // Embed VOD URL with timestamp
  {
    source: mixerVODWithTimestampExpect,
    expect: mixerVODWithTimestampExpect,
    options: mixerVODWithTimestampOptions,
  },
];

inputs.forEach((input) => {
  test(`${input.source} is handled correctly`, () => {
    const mixer = new Mixer(input.source);

    expect(mixer.getEmbedUrl()).toBe(input.expect);
    expect(paramStringToObject(mixer.exportOptions())).toEqual(input.options);

    const mixerElement = mixer.getElement() as HTMLElement;

    expect(mixerElement.getAttribute("src")).toBe(input.expect);
  });
});

const invalidInputs: string[] = [
  "A+C=E#G%I^K",
  "https://mixer.com/",
  "https://www.youtube.com/watch?v=g4Hbz2jLxvQ",
  "https://vimeo.com/16679115#t=600s",
  "https://www.twitch.tv/videos/355193670?t=02h16m51s",
  "https://www.twitch.tv/impactwrestling",
];

invalidInputs.forEach((input) => {
  test(`Incorrect Source: ${input}`, () => {
    const mixer = new Mixer(input);
    expect(mixer.getEmbedUrl()).toBeFalsy();
    expect(mixer.exportOptions()).toBeFalsy();
    expect(mixer.getElement()).toBeNull();
  });
});

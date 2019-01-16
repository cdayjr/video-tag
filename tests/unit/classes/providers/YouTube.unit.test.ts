import YouTube from "../../../../src/classes/providers/YouTube";

const paramStringToObject = (input: string): { [key: string]: string } => {
  const output: { [key: string]: string } = {};
  new URLSearchParams(input).forEach((value, key) => {
    output[key] = value;
  });
  return output;
};

test("getProviderString is YouTube", () => {
  expect(YouTube.getProviderString()).toBe("YouTube");

  // test non-static variant
  const youtube = new YouTube("");
  expect(youtube.getProviderString()).toBe("YouTube");
});

test("Test empty source returns an empty getElement", () => {
  const youtube = new YouTube("");

  expect(youtube.getElement()).toBeNull();
});

test("Test importOptions and exportOptions with ? prefix", () => {
  const youtube = new YouTube("");

  const initialString = "test=test&test2=2&test3=true&test4&test5=&test6=test";

  youtube.importOptions(`?${initialString}`);

  expect(paramStringToObject(youtube.exportOptions())).toEqual({
    test: "test",
    test2: "2",
    test3: "true",
    test4: "",
    test5: "",
    test6: "test"
  });
});

test("Test importOptions and exportOptions without ? prefix and duplicate keys", () => {
  const youtube = new YouTube("");

  const initialString =
    "test=test&test2=2&test3=true&test4&test5=&test6=test&test=test2&test4=4";

  youtube.importOptions(initialString);

  expect(paramStringToObject(youtube.exportOptions())).toEqual({
    test: "test2",
    test2: "2",
    test3: "true",
    test4: "4",
    test5: "",
    test6: "test"
  });
});

interface Options {
  id: string;
  start?: string;
}

const youtubeExpect = "https://www.youtube-nocookie.com/embed/g4Hbz2jLxvQ";
const youtubeWithStartExpect =
  "https://www.youtube-nocookie.com/embed/g4Hbz2jLxvQ?start=10";
const youtubeOptions: Options = {
  id: "g4Hbz2jLxvQ"
};

const youtubeOptionsWithStart: Options = {
  id: "g4Hbz2jLxvQ",
  start: "10"
};

const inputs: {
  source: string;
  expect: string;
  options: Options;
}[] = [
  // regular url
  {
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ",
    expect: youtubeExpect,
    options: youtubeOptions
  },
  // http
  {
    source: "http://www.youtube.com/watch?v=g4Hbz2jLxvQ",
    expect: youtubeExpect,
    options: youtubeOptions
  },
  // no www
  {
    source: "https://youtube.com/watch?v=g4Hbz2jLxvQ",
    expect: youtubeExpect,
    options: youtubeOptions
  },
  // extra param
  {
    source: "https://youtube.com/watch?v=g4Hbz2jLxvQ&test=test",
    expect: youtubeExpect,
    options: youtubeOptions
  },
  // youtu.be
  {
    source: "https://youtu.be/g4Hbz2jLxvQ",
    expect: youtubeExpect,
    options: youtubeOptions
  },
  // embed url
  {
    source: "https://www.youtube-nocookie.com/embed/g4Hbz2jLxvQ",
    expect: youtubeExpect,
    options: youtubeOptions
  },
  // id alone
  {
    source: "g4Hbz2jLxvQ",
    expect: youtubeExpect,
    options: youtubeOptions
  },
  // with timestamp
  {
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=0m10s",
    expect: youtubeWithStartExpect,
    options: youtubeOptionsWithStart
  },
  // with start only
  {
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&start=10",
    expect: youtubeWithStartExpect,
    options: youtubeOptionsWithStart
  },
  // with start and timestamps (start will take precedence)
  {
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=10m&start=10&t=10m",
    expect: youtubeWithStartExpect,
    options: youtubeOptionsWithStart
  },
  // embed url with timestamp
  {
    source: "https://www.youtube-nocookie.com/embed/g4Hbz2jLxvQ?start=10",
    expect: youtubeWithStartExpect,
    options: youtubeOptionsWithStart
  }
];

inputs.forEach(input => {
  test(`${input.source} is handled correctly`, () => {
    const youtube = new YouTube(input.source);

    expect(paramStringToObject(youtube.exportOptions())).toEqual(input.options);

    const youtubeElement = youtube.getElement();

    expect(youtubeElement).toBeInstanceOf(HTMLElement);

    expect(youtubeElement.tagName).toBe("IFRAME");
    expect(youtubeElement.getAttribute("allowfullscreen")).toBe("");
    expect(youtubeElement.getAttribute("allow")).toBe(
      "accelerometer; encrypted-media; gyroscope; picture-in-picture"
    );

    expect(youtubeElement.getAttribute("src")).toBe(input.expect);
  });
});

const invalidInputs: string[] = [
  "abcdefghijklmnopqrstuvwxyz",
  "abc",
  "A+C=E#G%I^K",
  "https://www.youtube.com/watch?z=g4Hbz2jLxvQ",
  "https://www.youtube.com/embeg/g4Hbz2jLxvQ?t=0m10s",
  "https://vimeo.com/16679115#t=600s",
  "https://www.twitch.tv/videos/355193670?t=02h16m51s",
  "https://www.twitch.tv/impactwrestling"
];

invalidInputs.forEach(input => {
  test(`Incorrect Source: ${input}`, () => {
    const youtube = new YouTube(input);
    expect(youtube.exportOptions()).toBeFalsy();
    expect(youtube.getElement()).toBeNull();
  });
});

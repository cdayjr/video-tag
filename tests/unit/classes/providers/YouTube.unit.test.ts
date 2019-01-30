/**
 * @file YouTube unit tests
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import YouTube from "../../../../src/classes/providers/YouTube";

const paramStringToObject = (input: string): { [key: string]: string } => {
  const output: { [key: string]: string } = {};
  new URLSearchParams(input).forEach((value, key) => {
    output[key] = value;
  });
  return output;
};

test("getProviderString is youtube", () => {
  expect(YouTube.getProviderString()).toBe("youtube");

  // test non-static variant
  const youtube = new YouTube("");
  expect(youtube.getProviderString()).toBe("youtube");
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
  id?: string;
  listType?: string;
  list?: string;
  playlist?: string;
  start?: string;
}

const youtubeVideoExpect =
  "https://www.youtube-nocookie.com/embed/g4Hbz2jLxvQ?";
const youtubeVideoWithStartExpect =
  "https://www.youtube-nocookie.com/embed/g4Hbz2jLxvQ?start=10";
const youtubePlaylistExpect =
  "https://www.youtube-nocookie.com/embed?listType=playlist&list=PLUXSZMIiUfFSe4gpc8PLDECqViWi-2we3";
const youtubePlaylistWithStartVideoExpect =
  "https://www.youtube-nocookie.com/embed/wge7JK0JV0Q?listType=playlist&list=PLUXSZMIiUfFSe4gpc8PLDECqViWi-2we3";
const youtubePlaylistWithStartVideoAndTimestampExpect =
  "https://www.youtube-nocookie.com/embed/wge7JK0JV0Q?listType=playlist&list=PLUXSZMIiUfFSe4gpc8PLDECqViWi-2we3&start=300";
const youtubeUserUploadsExpect =
  "https://www.youtube-nocookie.com/embed?listType=user_uploads&list=jonbois";
const youtubePlaylistIDsExpect =
  "https://www.youtube-nocookie.com/embed?playlist=1BZs005Hbgs%2CJZmQmJl6ek4%2CdoZzrsDJo-4";

const youtubeVideoOptions: Options = {
  id: "g4Hbz2jLxvQ"
};
const youtubeVideoOptionsWithStart: Options = {
  id: "g4Hbz2jLxvQ",
  start: "10"
};
const youtubePlaylistOptions: Options = {
  listType: "playlist",
  list: "PLUXSZMIiUfFSe4gpc8PLDECqViWi-2we3"
};
const youtubePlaylistWithStartVideoOptions: Options = {
  id: "wge7JK0JV0Q",
  listType: "playlist",
  list: "PLUXSZMIiUfFSe4gpc8PLDECqViWi-2we3"
};
const youtubePlaylistWithStartVideoAndTimestampOptions: Options = {
  id: "wge7JK0JV0Q",
  listType: "playlist",
  list: "PLUXSZMIiUfFSe4gpc8PLDECqViWi-2we3",
  start: "300"
};
const youtubeUserUploadsOptions: Options = {
  listType: "user_uploads",
  list: "jonbois"
};
const youtubePlaylistIDsOptions: Options = {
  playlist: "1BZs005Hbgs,JZmQmJl6ek4,doZzrsDJo-4"
};

const inputs: {
  source: string;
  expect: string;
  options: Options;
}[] = [
  // regular url
  {
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ",
    expect: youtubeVideoExpect,
    options: youtubeVideoOptions
  },
  // http
  {
    source: "http://www.youtube.com/watch?v=g4Hbz2jLxvQ",
    expect: youtubeVideoExpect,
    options: youtubeVideoOptions
  },
  // no www
  {
    source: "https://youtube.com/watch?v=g4Hbz2jLxvQ",
    expect: youtubeVideoExpect,
    options: youtubeVideoOptions
  },
  // extra param
  {
    source: "https://youtube.com/watch?v=g4Hbz2jLxvQ&test=test",
    expect: youtubeVideoExpect,
    options: youtubeVideoOptions
  },
  // youtu.be
  {
    source: "https://youtu.be/g4Hbz2jLxvQ",
    expect: youtubeVideoExpect,
    options: youtubeVideoOptions
  },
  // embed url
  {
    source: "https://www.youtube-nocookie.com/embed/g4Hbz2jLxvQ",
    expect: youtubeVideoExpect,
    options: youtubeVideoOptions
  },
  // id alone
  {
    source: "g4Hbz2jLxvQ",
    expect: youtubeVideoExpect,
    options: youtubeVideoOptions
  },
  // with bogus timestamp
  {
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=bogus",
    expect: youtubeVideoExpect,
    options: youtubeVideoOptions
  },
  // with timestamp
  {
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=0m10s",
    expect: youtubeVideoWithStartExpect,
    options: youtubeVideoOptionsWithStart
  },
  // with timestamp of seconds only
  {
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=10",
    expect: youtubeVideoWithStartExpect,
    options: youtubeVideoOptionsWithStart
  },
  // with bogus start only
  {
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&start=bogus",
    expect: youtubeVideoExpect,
    options: youtubeVideoOptions
  },
  // with start only
  {
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&start=10",
    expect: youtubeVideoWithStartExpect,
    options: youtubeVideoOptionsWithStart
  },
  // with start and timestamps (start will take precedence)
  {
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=10m&start=10&t=10m",
    expect: youtubeVideoWithStartExpect,
    options: youtubeVideoOptionsWithStart
  },
  // embed url with timestamp
  {
    source: "https://www.youtube-nocookie.com/embed/g4Hbz2jLxvQ?start=10",
    expect: youtubeVideoWithStartExpect,
    options: youtubeVideoOptionsWithStart
  },
  // embed url with bogus timestamp
  {
    source: "https://www.youtube-nocookie.com/embed/g4Hbz2jLxvQ?start=bogus",
    expect: youtubeVideoExpect,
    options: youtubeVideoOptions
  },
  // embed url with t timestamp parameter
  {
    source: "https://www.youtube.com/embed/g4Hbz2jLxvQ?t=0m10s",
    expect: youtubeVideoWithStartExpect,
    options: youtubeVideoOptionsWithStart
  },
  // playlist url
  {
    source:
      "https://www.youtube.com/playlist?list=PLUXSZMIiUfFSe4gpc8PLDECqViWi-2we3",
    expect: youtubePlaylistExpect,
    options: youtubePlaylistOptions
  },
  // embed playlist url
  {
    source: youtubePlaylistExpect,
    expect: youtubePlaylistExpect,
    options: youtubePlaylistOptions
  },
  // playlist with start video url
  {
    source:
      "https://www.youtube.com/playlist?list=PLUXSZMIiUfFSe4gpc8PLDECqViWi-2we3&v=wge7JK0JV0Q",
    expect: youtubePlaylistWithStartVideoExpect,
    options: youtubePlaylistWithStartVideoOptions
  },
  // embed playlist with start video url
  {
    source: youtubePlaylistWithStartVideoExpect,
    expect: youtubePlaylistWithStartVideoExpect,
    options: youtubePlaylistWithStartVideoOptions
  },
  // playlist with start video url and timestamp
  {
    source:
      "https://www.youtube.com/playlist?list=PLUXSZMIiUfFSe4gpc8PLDECqViWi-2we3&v=wge7JK0JV0Q&t=5m",
    expect: youtubePlaylistWithStartVideoAndTimestampExpect,
    options: youtubePlaylistWithStartVideoAndTimestampOptions
  },
  // embed playlist with start video url and timestamp
  {
    source: youtubePlaylistWithStartVideoAndTimestampExpect,
    expect: youtubePlaylistWithStartVideoAndTimestampExpect,
    options: youtubePlaylistWithStartVideoAndTimestampOptions
  },
  // user uploads
  {
    source: "https://www.youtube.com/embed?listType=user_uploads&list=jonbois",
    expect: youtubeUserUploadsExpect,
    options: youtubeUserUploadsOptions
  },
  // embed user uploads
  {
    source: youtubeUserUploadsExpect,
    expect: youtubeUserUploadsExpect,
    options: youtubeUserUploadsOptions
  },
  // embed playlist video ID list
  {
    source:
      "https://www.youtube-nocookie.com/embed?playlist=1BZs005Hbgs%2CJZmQmJl6ek4%2CdoZzrsDJo-4",
    expect: youtubePlaylistIDsExpect,
    options: youtubePlaylistIDsOptions
  },
  // embed playlist video ID list
  {
    source: youtubePlaylistIDsExpect,
    expect: youtubePlaylistIDsExpect,
    options: youtubePlaylistIDsOptions
  }
];

inputs.forEach(input => {
  test(`${input.source} is handled correctly`, () => {
    const youtube = new YouTube(input.source);

    expect(youtube.getEmbedUrl()).toBe(input.expect);
    expect(paramStringToObject(youtube.exportOptions())).toEqual(input.options);

    const youtubeElement = youtube.getElement() as HTMLElement;

    expect(youtubeElement.getAttribute("src")).toBe(input.expect);
  });
});

const invalidInputs: string[] = [
  "abcdefghijklmnopqrstuvwxyz",
  "abc",
  "A+C=E#G%I^K",
  "https://www.youtube.com/watch?z=g4Hbz2jLxvQ",
  "https://www.youtube.com/embed/videoseries",
  "https://www.youtube.com/playlist?nolist=PLUXSZMIiUfFSe4gpc8PLDECqViWi-2we3",
  "https://youtu.be/",
  "https://vimeo.com/16679115#t=600s",
  "https://www.twitch.tv/videos/355193670?t=02h16m51s",
  "https://www.twitch.tv/impactwrestling"
];

invalidInputs.forEach(input => {
  test(`Incorrect Source: ${input}`, () => {
    const youtube = new YouTube(input);
    expect(youtube.getEmbedUrl()).toBeFalsy();
    expect(youtube.exportOptions()).toBeFalsy();
    expect(youtube.getElement()).toBeNull();
  });
});

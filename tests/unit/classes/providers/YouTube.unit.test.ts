import YouTube from "../../../../src/classes/providers/YouTube";

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

  const query = new URLSearchParams(youtube.exportOptions());
  const queryObject: { [key: string]: string } = {};
  query.forEach((value, key) => {
    queryObject[key] = value;
  });

  expect(queryObject).toEqual({
    test: "test",
    test2: "2",
    test3: "true",
    test4: "",
    test5: "",
    test6: "test"
  });
});

test("Test importOptions and exportOptions without ? prefix", () => {
  const youtube = new YouTube("");

  const initialString = "test=test&test2=2&test3=true&test4&test5=&test6=test";

  youtube.importOptions(initialString);

  const query = new URLSearchParams(youtube.exportOptions());
  const queryObject: { [key: string]: string } = {};
  query.forEach((value, key) => {
    queryObject[key] = value;
  });

  expect(queryObject).toEqual({
    test: "test",
    test2: "2",
    test3: "true",
    test4: "",
    test5: "",
    test6: "test"
  });
});

const inputs: { [key: string]: string }[] = [
  // regular url
  {
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ",
    id: "g4Hbz2jLxvQ"
  },
  // http
  {
    source: "http://www.youtube.com/watch?v=g4Hbz2jLxvQ",
    id: "g4Hbz2jLxvQ"
  },
  // no www
  {
    source: "https://youtube.com/watch?v=g4Hbz2jLxvQ",
    id: "g4Hbz2jLxvQ"
  },
  // extra param
  {
    source: "https://youtube.com/watch?v=g4Hbz2jLxvQ&test=test",
    id: "g4Hbz2jLxvQ"
  },
  // youtu.be
  {
    source: "https://youtu.be/g4Hbz2jLxvQ",
    id: "g4Hbz2jLxvQ"
  },
  // with timestamp
  {
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=0m10s",
    id: "g4Hbz2jLxvQ",
    t: "0m10s",
    start: "10"
  },
  // with start only
  {
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&start=10",
    id: "g4Hbz2jLxvQ",
    start: "10"
  },
  // with start and timestamps (start will take precedence)
  {
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=10m&start=10&t=10m",
    id: "g4Hbz2jLxvQ",
    start: "10"
  },
  // embed url
  {
    source: "https://www.youtube-nocookie.com/embed/g4Hbz2jLxvQ",
    id: "g4Hbz2jLxvQ"
  },
  // embed url with timestamp
  {
    source: "https://www.youtube-nocookie.com/embed/g4Hbz2jLxvQ?start=10",
    id: "g4Hbz2jLxvQ",
    start: "10"
  },
  // id alone
  {
    source: "g4Hbz2jLxvQ",
    id: "g4Hbz2jLxvQ"
  }
];

inputs.forEach(input => {
  test(`${input.source} is handled correctly`, () => {
    const youtube = new YouTube(input.source);

    const inputOptions: { [key: string]: string } = {
      id: input.id
    };

    if (undefined !== input.start) {
      inputOptions.start = input.start;
    }

    const query = new URLSearchParams(youtube.exportOptions());
    const queryObject: { [key: string]: string } = {};
    query.forEach((value, key) => {
      queryObject[key] = value;
    });

    expect(queryObject).toEqual(inputOptions);

    const youtubeElement = youtube.getElement();

    expect(youtubeElement).toBeInstanceOf(HTMLElement);

    expect(youtubeElement.tagName).toBe("IFRAME");
    expect(youtubeElement.getAttribute("allowfullscreen")).toBe("");
    expect(youtubeElement.getAttribute("allow")).toBe(
      "accelerometer; encrypted-media; gyroscope; picture-in-picture"
    );

    let regexString = `^https:\\/\\/www\\.youtube-nocookie\\.com\\/embed\\/${
      input.id
    }`;

    if (undefined !== input.start) {
      regexString += `\\?start=${input.start}$`;
    } else {
      regexString += "$";
    }

    expect(youtubeElement.getAttribute("src")).toMatch(new RegExp(regexString));
  });
});

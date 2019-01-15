import YouTube from "../../../../src/classes/providers/YouTube";

test("getProviderString is YouTube", (): void => {
  expect(YouTube.getProviderString()).toBe("YouTube");

  // test non-static variant
  const youtube = new YouTube("");
  expect(youtube.getProviderString()).toBe("YouTube");
});

test("Test empty source returns an empty getElement", (): void => {
  const youtube = new YouTube("");

  expect(youtube.getElement()).toBeNull();
});

test("Test importOptions and exportOptions with ? prefix", (): void => {
  const youtube = new YouTube("");

  const initialString = "test=test&test2=2&test3=true&test4&test5=&test6=test";

  youtube.importOptions(`?${initialString}`);

  expect(youtube.exportOptions()).toBe(
    "test=test&test2=2&test3=true&test4=&test5=&test6=test"
  );
});

test("Test importOptions and exportOptions without ? prefix", (): void => {
  const youtube = new YouTube("");

  const initialString = "test=test&test2=2&test3=true&test4&test5=&test6=test";

  youtube.importOptions(initialString);

  expect(youtube.exportOptions()).toBe(
    "test=test&test2=2&test3=true&test4=&test5=&test6=test"
  );
});

test("Classic URL", (): void => {
  const videoID = "g4Hbz2jLxvQ";
  const youtube = new YouTube(`https://www.youtube.com/watch?v=${videoID}`);

  expect(youtube.exportOptions()).toBe(`id=${videoID}`);

  const youtubeElement = youtube.getElement();

  expect(youtubeElement instanceof HTMLElement).toBeTruthy();
  if (youtubeElement) {
    expect(youtubeElement.tagName).toBe("IFRAME");
    expect(youtubeElement.getAttribute("allowfullscreen")).toBe("");
    expect(youtubeElement.getAttribute("allow")).toBe(
      "accelerometer; encrypted-media; gyroscope; picture-in-picture"
    );
    expect(youtubeElement.getAttribute("src")).toBe(
      `https://www.youtube-nocookie.com/embed/${videoID}`
    );
  }
});

test("Youtu.be URL", (): void => {
  const videoID = "g4Hbz2jLxvQ";
  const youtube = new YouTube(`https://youtu.be/${videoID}`);

  expect(youtube.exportOptions()).toBe(`id=${videoID}`);

  const youtubeElement = youtube.getElement();

  expect(youtubeElement instanceof HTMLElement).toBeTruthy();
  if (youtubeElement) {
    expect(youtubeElement.tagName).toBe("IFRAME");
    expect(youtubeElement.getAttribute("allowfullscreen")).toBe("");
    expect(youtubeElement.getAttribute("allow")).toBe(
      "accelerometer; encrypted-media; gyroscope; picture-in-picture"
    );
    expect(youtubeElement.getAttribute("src")).toBe(
      `https://www.youtube-nocookie.com/embed/${videoID}`
    );
  }
});

test("URL with timestamp", (): void => {
  const videoID = "g4Hbz2jLxvQ";
  const timestampString = "0m10s";
  const timestampSeconds = "10";
  const youtube = new YouTube(
    `https://www.youtube.com/watch?v=${videoID}&t=${timestampString}`
  );

  expect(youtube.exportOptions()).toBe(
    `id=${videoID}&start=${timestampSeconds}`
  );

  const youtubeElement = youtube.getElement();

  expect(youtubeElement instanceof HTMLElement).toBeTruthy();
  if (youtubeElement) {
    expect(youtubeElement.tagName).toBe("IFRAME");
    expect(youtubeElement.getAttribute("allowfullscreen")).toBe("");
    expect(youtubeElement.getAttribute("allow")).toBe(
      "accelerometer; encrypted-media; gyroscope; picture-in-picture"
    );
    expect(youtubeElement.getAttribute("src")).toBe(
      `https://www.youtube-nocookie.com/embed/${videoID}?start=${timestampSeconds}`
    );
  }
});

test("Video ID", (): void => {
  const videoID = "g4Hbz2jLxvQ";
  const youtube = new YouTube(videoID);

  expect(youtube.exportOptions()).toBe(`id=${videoID}`);

  const youtubeElement = youtube.getElement();

  expect(youtubeElement instanceof HTMLElement).toBeTruthy();
  if (youtubeElement) {
    expect(youtubeElement.tagName).toBe("IFRAME");
    expect(youtubeElement.getAttribute("allowfullscreen")).toBe("");
    expect(youtubeElement.getAttribute("allow")).toBe(
      "accelerometer; encrypted-media; gyroscope; picture-in-picture"
    );
    expect(youtubeElement.getAttribute("src")).toBe(
      `https://www.youtube-nocookie.com/embed/${videoID}`
    );
  }
});

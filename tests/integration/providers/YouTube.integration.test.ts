import Video from "../../../src/classes/Video";

import YouTube from "../../../src/classes/providers/YouTube";

test("getProvider returns provider string from provider", () => {
  const video = new Video(
    "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=0m10s"
  );

  expect(video.getProvider()).toBe(YouTube.getProviderString());
});

test("getProvider returns provider string if provider is set", () => {
  const video = new Video(
    "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=0m10s",
    YouTube.getProviderString()
  );

  expect(video.getProvider()).toBe(YouTube.getProviderString());
});

test("ID only does not set provider", () => {
  const video = new Video("g4Hbz2jLxvQ");

  expect(video.getProvider()).toBe("Invalid");
});

test("importOptions and exportOptions work as intended", () => {
  const video = new Video(
    "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=0m10s"
  );
  const youtube = new YouTube(
    "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=0m10s"
  );

  expect(video.getProvider()).toBe(YouTube.getProviderString());
  expect(video.exportOptions()).toBe(youtube.exportOptions());

  // should clear provider and options
  video.importOptions("", "");

  expect(video.getProvider()).toBe("Invalid");
  expect(video.exportOptions()).toBe("");

  // setting the options back
  video.importOptions(YouTube.getProviderString(), youtube.exportOptions());

  expect(video.getProvider()).toBe(YouTube.getProviderString());
  expect(video.exportOptions()).toBe(youtube.exportOptions());
});

import Video from "../../src/classes/Video";

test("getProvider returns YouTube", () => {
  const video = new Video(
    "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=0m10s"
  );

  expect(video.getProvider()).toBe("YouTube");
});

test("getProvider returns YouTube if provider is set", () => {
  const video = new Video(
    "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=0m10s",
    "youtube"
  );

  expect(video.getProvider()).toBe("YouTube");
});

test("ID only does not set provider", () => {
  const video = new Video("g4Hbz2jLxvQ");

  expect(video.getProvider()).toBe("Invalid");
});

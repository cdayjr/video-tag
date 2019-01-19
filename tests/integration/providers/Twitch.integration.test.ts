import Video from "../../../src/classes/Video";

import Twitch from "../../../src/classes/providers/Twitch";

test("getProvider returns provider string from provider", () => {
  const video = new Video("https://www.twitch.tv/videos/355193670?t=02h16m51s");

  expect(video.getProvider()).toBe(Twitch.getProviderString());
});

test("getProvider returns provider string if provider is set", () => {
  const video = new Video(
    "https://www.twitch.tv/videos/355193670?t=02h16m51s",
    Twitch.getProviderString()
  );

  expect(video.getProvider()).toBe(Twitch.getProviderString());
});

test("ID only does not set provider", () => {
  const video = new Video("355193670");

  expect(video.getProvider()).toBe("Invalid");
});

test("importOptions and exportOptions work as intended", () => {
  const video = new Video("https://www.twitch.tv/videos/355193670?t=02h16m51s");
  const twitch = new Twitch(
    "https://www.twitch.tv/videos/355193670?t=02h16m51s"
  );

  expect(video.getProvider()).toBe(Twitch.getProviderString());
  expect(video.exportOptions()).toBe(twitch.exportOptions());

  // should clear provider and options
  video.importOptions("", "");

  expect(video.getProvider()).toBe("Invalid");
  expect(video.exportOptions()).toBe("");

  // setting the options back
  video.importOptions(Twitch.getProviderString(), twitch.exportOptions());

  expect(video.getProvider()).toBe(Twitch.getProviderString());
  expect(video.exportOptions()).toBe(twitch.exportOptions());
});

/**
 * @file Twitch integration tests
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import Video from "../../../src/classes/Video";
import VideoProviderFactory from "../../../src/classes/VideoProviderFactory";

import Twitch from "../../../src/classes/providers/Twitch";

test("Factory creates Twitch objects", () => {
  const video1 = VideoProviderFactory.createProvider("", "Twitch");

  expect(video1).toBeInstanceOf(Twitch);

  const video2 = VideoProviderFactory.createProvider(
    "https://www.twitch.tv/videos/355193670?t=02h16m51s"
  );

  expect(video2).toBeInstanceOf(Twitch);
});

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

  // Compare elements
  const videoElement = video.getElement();
  const twitchElement = twitch.getElement();

  // remove classes
  const videoElementIFrame = videoElement.querySelector("iframe");
  if (videoElementIFrame) {
    videoElementIFrame.removeAttribute("class");
  }

  expect(videoElement.querySelector("iframe")?.outerHTML).toBe(
    twitchElement?.outerHTML
  );
});

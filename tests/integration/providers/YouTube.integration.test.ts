/**
 * @file YouTube integration tests
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import Video from "../../../src/classes/Video";
import VideoProviderFactory from "../../../src/classes/VideoProviderFactory";

import YouTube from "../../../src/classes/providers/YouTube";

test("Factory creates YouTube objects", () => {
  const video1 = VideoProviderFactory.createProvider("", "YouTube");

  expect(video1).toBeInstanceOf(YouTube);

  const video2 = VideoProviderFactory.createProvider(
    "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=0m10s"
  );

  expect(video2).toBeInstanceOf(YouTube);
});

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

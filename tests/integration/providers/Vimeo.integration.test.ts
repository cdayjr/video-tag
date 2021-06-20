/**
 * @file Vimeo integration tests
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import Video from "../../../src/classes/Video";
import VideoProviderFactory from "../../../src/classes/VideoProviderFactory";

import Vimeo from "../../../src/classes/providers/Vimeo";

test("Factory creates Vimeo objects", () => {
  const video1 = VideoProviderFactory.createProvider("", "Vimeo");

  expect(video1).toBeInstanceOf(Vimeo);

  const video2 = VideoProviderFactory.createProvider(
    "https://vimeo.com/16679115#t=600s"
  );

  expect(video2).toBeInstanceOf(Vimeo);
});

test("getProvider returns provider string from provider", () => {
  const video = new Video("https://vimeo.com/16679115#t=600s");

  expect(video.getProvider()).toBe(Vimeo.getProviderString());
});

test("getProvider returns provider string if provider is set", () => {
  const video = new Video(
    "https://vimeo.com/16679115#t=600s",
    Vimeo.getProviderString()
  );

  expect(video.getProvider()).toBe(Vimeo.getProviderString());
});

test("ID only does not set provider", () => {
  const video = new Video("16679115");

  expect(video.getProvider()).toBe("Invalid");
});

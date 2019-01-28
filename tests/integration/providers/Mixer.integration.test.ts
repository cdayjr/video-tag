/**
 * @file Mixer integration tests
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import Video from "../../../src/classes/Video";
import VideoProviderFactory from "../../../src/classes/VideoProviderFactory";

import Mixer from "../../../src/classes/providers/Mixer";

test("Factory creates Mixer objects", () => {
  const video1 = VideoProviderFactory.createProvider("", "Mixer");

  expect(video1).toBeInstanceOf(Mixer);

  const video2 = VideoProviderFactory.createProvider("https://mixer.com/Mixer");

  expect(video2).toBeInstanceOf(Mixer);
});

test("getProvider returns provider string from provider", () => {
  const video = new Video("https://mixer.com/Mixer");

  expect(video.getProvider()).toBe(Mixer.getProviderString());
});

test("getProvider returns provider string if provider is set", () => {
  const video = new Video("https://mixer.com/Mixer", Mixer.getProviderString());

  expect(video.getProvider()).toBe(Mixer.getProviderString());
});

test("Channel only does not set provider", () => {
  const video = new Video("Mixer");

  expect(video.getProvider()).toBe("Invalid");
});

test("importOptions and exportOptions work as intended", () => {
  const video = new Video("https://mixer.com/Mixer?vod=34749442&t=1m");
  const mixer = new Mixer("https://mixer.com/Mixer?vod=34749442&t=1m");

  expect(video.getProvider()).toBe(Mixer.getProviderString());
  expect(video.exportOptions()).toBe(mixer.exportOptions());

  // should clear provider and options
  video.importOptions("", "");

  expect(video.getProvider()).toBe("Invalid");
  expect(video.exportOptions()).toBe("");

  // setting the options back
  video.importOptions(Mixer.getProviderString(), mixer.exportOptions());

  expect(video.getProvider()).toBe(Mixer.getProviderString());
  expect(video.exportOptions()).toBe(mixer.exportOptions());

  // Compare elements
  const videoElement = video.getElement();
  const mixerElement = mixer.getElement();

  // remove classes
  videoElement.querySelector("iframe").removeAttribute("class");

  expect(videoElement.querySelector("iframe").outerHTML).toBe(
    mixerElement.outerHTML
  );
});

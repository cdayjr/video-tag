/**
 * @file VideoProvider unit tests
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import VideoProvider from "../../../src/classes/VideoProvider";

test("isProvider returns false", () => {
  expect(VideoProvider.isProvider("")).toBe(false);
  expect(VideoProvider.isProvider("https://youtu.be/whatever")).toBe(false);
});

test("getProviderString returns Invalid", () => {
  expect(VideoProvider.getProviderString()).toBe("Invalid");
});

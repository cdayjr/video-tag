/**
 * @file Video snapshot tests
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import Video from "../../src/classes/Video";

// Currently we only test for this because the contents of a valid
// video tag is just what would be in the snapshots of each provider
it("Creates video container that contains Invalid Video text", () => {
  const video = new Video("");

  const videoElement = video.getElement();

  expect(videoElement).toMatchSnapshot();
});

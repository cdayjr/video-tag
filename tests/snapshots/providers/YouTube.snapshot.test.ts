/**
 * @file YouTube snapshot tests
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import YouTube from "../../../src/classes/providers/YouTube";

it("Creates YouTube embed element", () => {
  // The only thing that changes between valid inputs is the
  // `src` attribute, so we'll leave that to unit tests
  const youtube = new YouTube(
    "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=0m10s"
  );

  const youtubeElement = youtube.getElement();

  expect(youtubeElement).toMatchSnapshot();
});

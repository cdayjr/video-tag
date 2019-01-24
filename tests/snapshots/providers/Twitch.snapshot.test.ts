/**
 * @file Twitch snapshot tests
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import Twitch from "../../../src/classes/providers/Twitch";

it("Creates Twitch embed element", () => {
  // The only thing that changes between valid inputs is the
  // `src` attribute, so we'll leave that to unit tests
  const twitch = new Twitch(
    "https://www.twitch.tv/videos/355193670?t=02h16m51s"
  );

  const twitchElement = twitch.getElement();

  expect(twitchElement).toMatchSnapshot();
});

/**
 * @file YouTube snapshot tests
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import Mixer from "../../../src/classes/providers/Mixer";

it("Creates Mixer embed element", () => {
  // The only thing that changes between valid inputs is the
  // `src` attribute, so we'll leave that to unit tests
  const mixer = new Mixer("https://mixer.com/Mixer");

  const mixerElement = mixer.getElement();

  expect(mixerElement).toMatchSnapshot();
});

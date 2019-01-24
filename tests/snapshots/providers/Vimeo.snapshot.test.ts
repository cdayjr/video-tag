/**
 * @file Vimeo snapshot tests
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import Vimeo from "../../../src/classes/providers/Vimeo";

it("Creates Vimeo embed element", () => {
  // The only thing that changes between valid inputs is the
  // `src` attribute, so we'll leave that to unit tests
  const vimeo = new Vimeo("https://vimeo.com/16679115#t=600s");

  const vimeoElement = vimeo.getElement();

  expect(vimeoElement).toMatchSnapshot();
});

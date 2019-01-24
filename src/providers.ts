/**
 * @file List all the providers here in the export so they can be used
 *  by our Video class.
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import Twitch from "./classes/providers/Twitch";
import Vimeo from "./classes/providers/Vimeo";
import YouTube from "./classes/providers/YouTube";

/**
 * An array of available providers
 */
export default [Twitch, Vimeo, YouTube];

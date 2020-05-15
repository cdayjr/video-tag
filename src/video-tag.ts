/**
 * @file Video tag code suitable to be used by browsers.
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import {
  getVideoTags,
  parseVideoTag,
  parseVideoTags,
  urlToEmbedUrl,
} from "./module";

/**
 * Parse all video tags on current page
 */
document.addEventListener("DOMContentLoaded", parseVideoTags);

export { getVideoTags, parseVideoTag, parseVideoTags, urlToEmbedUrl };

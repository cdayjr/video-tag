/**
 * @file Video tag code suitable to be used as a moudle by other scripts.
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import Video from "./classes/Video";
import VideoProviderFactory from "./classes/VideoProviderFactory";

/**
 * Video tags are `div` elements (`HTMLDivElement`) with the `video-tag` class,
 * a `data-source` attribute, and no `data-parsed` attribute (`data-parsed`
 * means the tag has already been parsed so we can ignore it).
 */
const selector = "div.video-tag[data-source]:not([data-parsed])";

/**
 * Grab the video tags to parse from the HTML page.
 *
 * @return An HTMLDivElement array.
 */
export const getVideoTags = (): NodeListOf<HTMLDivElement> =>
  document.querySelectorAll(selector);

/**
 * Parse a video tag and fill it with the video embed code.
 * Note- its contents will be cleared.
 *
 * @param tag A video tag.
 */
export const parseVideoTag = (tag: HTMLDivElement): void => {
  if (!tag.dataset.source) {
    return;
  }
  const video: Video = new Video(tag.dataset.source, tag.dataset.provider);

  // Remove child elements from tag
  while (tag.lastChild) {
    tag.removeChild(tag.lastChild);
  }

  // Add video element
  tag.appendChild(video.getElement());

  // Update data
  tag.setAttribute("data-provider", video.getProvider());
  tag.setAttribute("data-parsed", video.getProvider());
};

/**
 * Find all the video tags on the page and parse each of them.
 */
export const parseVideoTags = (): void => {
  const videoTags = getVideoTags();
  videoTags.forEach((videoTag: HTMLDivElement): void => {
    parseVideoTag(videoTag);
  });
};

/**
 * Get the embed URL for an appropriate URL
 *
 * @param url The URL input
 *
 * @return The embed URL
 */
export const urlToEmbedUrl = (url: string): string => {
  const video = VideoProviderFactory.createProvider(url);

  if (video) {
    return video.getEmbedURL();
  }

  return "";
};

import Video from "./classes/Video.ts";

(() => {
  /**
   * Video tags are `div` elements (`HTMLDivElement`) with the `video-tag` class,
   * a `data-source` attribute, and no `data-options` attribute (`data-options`
   * means the tag has already been parsed so we can ignore it).
   */
  const selector = "div.video-tag[data-source]:not([data-options])";

  /**
   * Grab the video tags to parse from the HTML page.
   *
   * @return An HTMLDivElement array.
   */
  const getVideoTags = (): HTMLDivElement[] => {
    return document.querySelectorAll(selector);
  };

  /**
   * Parse a video tag and fill it with the video embed code.
   * Note- its contents will be cleared.
   *
   * @param A video tag.
   */
  const parseVideoTag = (tag: HTMLDivElement): void => {
    const video: Video = new Video(tag.dataset.source, tag.dataset.provider);

    // Remove child elements from tag
    while (tag.lastChild) {
      tag.removeChild(tag.lastChild);
    }

    // Add video element
    tag.appendChild(video.getElement());

    // Update data
    tag.dataset.provider = video.getProvider();
    tag.dataset.options = video.exportOptions();
  };

  /**
   * Find all the video tags on the page and parse each of them.
   */
  const parseVideoTags = (): void => {
    getVideoTags().forEach(parseVideoTag);
  };

  document.addEventListener("DOMContentLoaded", parseVideoTags);
})();

import Video from './video.ts';

/**
 * Grab the video tags to parse from the HTML page.
 *
 * @return An HTMLDivElement array.
 */
const getVideoTags = (): HTMLDivElement[] => {
  return document.querySelectorAll('div.video-tag:not([data-options])');
};

/**
 * Parse a video tag and fill it with the video embed code.
 * Note- its contents will be cleared.
 *
 * @param A video tag.
 */
const parseVideoTag = (tag: HTMLDivElement): void => {
  if (undefined !== tag.dataset.content) {
    if (undefined !== tag.dataset.source) {
      const video: Video = new Video(tag.dataset.content, tag.dataset.source);
    } else {
      const video: Video = new Video(tag.dataset.content);
    }
    while (tag.lastChild) {
      tag.removeChild(tag.lastChild);
    }
    tag.appendChild(video.getElement());
    tag.dataset.source = video.getSource();
    tag.dataset.options = video.exportOptions();
  } else {
    // Leave no options, this is an invalid tag.
    tag.dataset.source = 'Invalid';
    tag.dataset.options = '';
  }
};

/**
 * Find all the video tags on the page and parse each of them.
 */
const parseVideoTags = (): void => {
  getVideoTags().forEach(parseVideoTag);
};

document.addEventListener('DOMContentLoaded', parseVideoTags);

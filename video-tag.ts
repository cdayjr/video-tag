import Video from "./video.ts";

const getVideoTags = (): HTMLDivElement[] => {
  return document.querySelectorAll("div.video-tag:not([data-options])");
};

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
    tag.dataset.source = "Invalid";
    tag.dataset.options = "";
  }
};

const parseVideoTags = (): void => {
  getVideoTags().forEach(parseVideoTag);
};

document.addEventListener("DOMContentLoaded", parseVideoTags);

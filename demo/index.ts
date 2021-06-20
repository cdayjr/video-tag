/**
 * @file Demo code- stores and generates the video tag examples
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import { parseVideoTag } from "../src/module";
import {
  code,
  navigation,
  navigationButton,
  navigationList,
  navigationListItem,
} from "./index.scss";

/**
 * Define how we want our demo tags to be structured
 */
interface DemoTag {
  title: string;
  source: string;
  provider?: string;
}

/**
 * An array of every tag we want to demonstrate
 */
const demoTags: DemoTag[] = [
  {
    title: "YouTube Video Link",
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ",
  },
  {
    title: "YouTu.be Video Link",
    source: "https://youtu.be/g4Hbz2jLxvQ",
  },
  {
    title: "YouTube Video Link with Timestamp",
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=0m10s",
  },
  {
    title: "YouTube Video ID",
    source: "g4Hbz2jLxvQ",
    provider: "YouTube",
  },
  {
    title: "YouTube Playlist Link",
    source:
      "https://www.youtube.com/playlist?list=PLUXSZMIiUfFSe4gpc8PLDECqViWi-2we3",
  },
  {
    title: "YouTube Playlist Link with start video",
    source:
      "https://www.youtube.com/playlist?list=PLUXSZMIiUfFSe4gpc8PLDECqViWi-2we3&v=wge7JK0JV0Q",
  },
  {
    title: "YouTube Playlist Link with start video with timestamp",
    source:
      "https://www.youtube.com/playlist?list=PLUXSZMIiUfFSe4gpc8PLDECqViWi-2we3&v=wge7JK0JV0Q&t=5m",
  },
  {
    title: "YouTube User Uploads Link",
    source: "https://www.youtube.com/embed?listType=user_uploads&list=jonbois",
  },
  {
    title: "YouTube Playlist Video ID list",
    source:
      "https://www.youtube.com/embed?playlist=1BZs005Hbgs,JZmQmJl6ek4,doZzrsDJo-4",
  },
  {
    title: "Vimeo Video Link",
    source: "https://vimeo.com/16679115",
  },
  {
    title: "Vimeo Video Link with Timestamp",
    source: "https://vimeo.com/16679115#t=0h10m0s",
  },
  {
    title: "Vimeo Album",
    source: "https://vimeo.com/album/1719434",
  },
  {
    title: "Vimeo Video ID",
    source: "16679115",
    provider: "Vimeo",
  },
  {
    title: "Twitch Video",
    source: "https://www.twitch.tv/videos/355193670",
  },
  {
    title: "Twitch Video with Timestamp",
    source: "https://www.twitch.tv/videos/355193670?t=02h16m51s",
  },
  {
    title: "Twitch Video ID",
    source: "355193670",
    provider: "Twitch",
  },
  {
    title: "Twitch Channel Link",
    source: "https://www.twitch.tv/impactwrestling",
  },
  {
    title: "Twitch Channel ID",
    source: "impactwrestling",
    provider: "Twitch",
  },
  {
    title: "Twitch Clip Link",
    source:
      "https://www.twitch.tv/renzoandknuckles/clip/ViscousSpicyBeeCoolStoryBob",
  },
  {
    title: "Twitch Collection Link",
    source: "https://www.twitch.tv/collections/BXjdJSCmeRVEpQ",
  },
];

// Create the element to store the buttons for users to select which tag
// to display
const navElement: HTMLElement = document.createElement("nav");
navElement.classList.add(navigation);
const navElementList: HTMLElement = document.createElement("ul");
navElementList.classList.add(navigationList);
navElement.appendChild(navElementList);

// Create the area where the videos themselves will be shown
const showcase: HTMLElement = document.createElement("section");

// store elements to add to page
const elements = Object.create(null);

// Iterate through each demotag and create the buttons for them
demoTags.forEach((demoTag) => {
  const bbcode =
    typeof demoTag.provider === "undefined"
      ? `[video]${demoTag.source}[/video]`
      : `[video=${demoTag.provider}]${demoTag.source}[/video]`;

  const element: HTMLDivElement = document.createElement("div");
  element.classList.add("video-tag");
  element.setAttribute("data-source", demoTag.source);
  if (typeof demoTag.provider !== "undefined") {
    element.setAttribute("data-provider", demoTag.provider);
  }
  elements[demoTag.title] = element;

  const fallbackElement: HTMLAnchorElement = document.createElement("a");
  fallbackElement.classList.add("video-tag-fallback");
  fallbackElement.setAttribute("href", demoTag.source);
  fallbackElement.textContent = demoTag.source;
  element.appendChild(fallbackElement);

  const button: HTMLButtonElement = document.createElement("button");
  button.classList.add(navigationButton);
  button.textContent = demoTag.title;
  button.setAttribute("data-title", demoTag.title);
  // eslint-disable-next-line xss/no-mixed-html
  button.setAttribute("data-element", element.outerHTML);
  button.setAttribute("data-bbcode", bbcode);
  button.classList.add("demo-button");
  parseVideoTag(element);

  const navElementItem: HTMLElement = document.createElement("li");
  navElementItem.classList.add(navigationListItem);
  navElementItem.appendChild(button);

  navElementList.appendChild(navElementItem);
});

// Showcase HTML for a given button
const showcaseHTML = (button: HTMLButtonElement): void => {
  const title = button.dataset["data-title"];
  if (typeof title !== "string") {
    return;
  }
  // eslint-disable-next-line security/detect-object-injection
  const element = elements[title];
  if (!(element instanceof HTMLDivElement)) {
    return;
  }

  while (showcase.lastChild) {
    showcase.removeChild(showcase.lastChild);
  }

  showcase.appendChild(element);

  const bbcodeTitle = document.createElement("h1");
  bbcodeTitle.textContent = "BBCode";
  showcase.appendChild(bbcodeTitle);

  const bbcodeContainer = document.createElement("code");
  bbcodeContainer.classList.add(code);
  bbcodeContainer.textContent = button.dataset.bbcode as string;
  showcase.appendChild(bbcodeContainer);

  const markupTitle = document.createElement("h1");
  markupTitle.textContent = "HTML";
  showcase.appendChild(markupTitle);

  const markupContainer = document.createElement("code");
  markupContainer.classList.add(code);
  markupContainer.textContent = button.dataset.element as string;
  showcase.appendChild(markupContainer);
};

// When clicking a button, activate our sample code.
// Disables xss/no-mixed-html since it seems like a false positive for a void
// function
// eslint-disable-next-line xss/no-mixed-html
const displaySample = (event: Event): void => {
  const button = event?.target;

  if (
    !(button instanceof HTMLButtonElement) ||
    !button.classList.contains("demo-button")
  ) {
    // not an element we can work with
    return;
  }

  showcaseHTML(button);

  button.remove();
  if (document.querySelectorAll(".demo-button").length < 1) {
    document.removeEventListener("click", displaySample);
  }
};
// eslint-disable-next-line scanjs-rules/call_addEventListener
document.addEventListener("click", displaySample, false);

// When the page is loaded replace all content in the body tag with our
// navigation and showcase
//
const loadContent = (): void => {
  while (document.body.lastChild) {
    document.body.removeChild(document.body.lastChild);
  }
  document.body.appendChild(navElement);
  document.body.appendChild(showcase);
  document.removeEventListener("DOMContentLoaded", loadContent);
};
// eslint-disable-next-line scanjs-rules/call_addEventListener
document.addEventListener("DOMContentLoaded", loadContent, false);

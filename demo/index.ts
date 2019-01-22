import { parseVideoTag } from "../src/video-tag";
import * as style from "./index.scss";

interface DemoTag {
  title: string;
  source: string;
  provider?: string;
}

// Every tag to demonstrate
const demoTags: DemoTag[] = [
  {
    title: "YouTube Video Link",
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ"
  },
  {
    title: "YouTu.be Video Link",
    source: "https://youtu.be/g4Hbz2jLxvQ"
  },
  {
    title: "YouTube Video Link with Timestamp",
    source: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=0m10s"
  },
  {
    title: "YouTube Video ID",
    source: "g4Hbz2jLxvQ",
    provider: "YouTube"
  },
  {
    title: "Vimeo Video Link",
    source: "https://vimeo.com/16679115"
  },
  {
    title: "Vimeo Video Link with Timestamp",
    source: "https://vimeo.com/16679115#t=600s"
  },
  {
    title: "Vimeo Video ID",
    source: "16679115",
    provider: "Vimeo"
  },
  {
    title: "Twitch Video",
    source: "https://www.twitch.tv/videos/355193670"
  },
  {
    title: "Twitch Video with Timestamp",
    source: "https://www.twitch.tv/videos/355193670?t=02h16m51s"
  },
  {
    title: "Twitch Video ID",
    source: "355193670",
    provider: "Twitch"
  },
  {
    title: "Twitch Channel Link",
    source: "https://www.twitch.tv/impactwrestling"
  },
  {
    title: "Twitch Channel ID",
    source: "impactwrestling",
    provider: "Twitch"
  }
];

const navElement: HTMLElement = document.createElement("nav");
navElement.classList.add(style.navigation);
const navElementList: HTMLElement = document.createElement("ul");
navElementList.classList.add(style.navigationList);
navElement.appendChild(navElementList);

const showcase: HTMLElement = document.createElement("section");

demoTags.forEach(demoTag => {
  const bbcode =
    undefined === demoTag.provider
      ? `[video]${demoTag.source}[/video]`
      : `[video=${demoTag.provider}]${demoTag.source}[/video]`;

  const element: HTMLDivElement = document.createElement("div");
  element.classList.add("video-tag");
  element.setAttribute("data-source", demoTag.source);
  if (undefined !== demoTag.provider) {
    element.setAttribute("data-provider", demoTag.provider);
  }

  const fallbackElement: HTMLAnchorElement = document.createElement("a");
  fallbackElement.classList.add("video-tag-fallback");
  fallbackElement.href = demoTag.source;
  fallbackElement.textContent = demoTag.source;
  element.appendChild(fallbackElement);

  const button: HTMLButtonElement = document.createElement("button");
  button.classList.add(style.navigationButton);
  button.textContent = demoTag.title;
  button.setAttribute("data-element", element.outerHTML);
  button.setAttribute("data-bbcode", bbcode);
  parseVideoTag(element);

  button.addEventListener("click", () => {
    while (showcase.lastChild) {
      showcase.removeChild(showcase.lastChild);
    }

    showcase.appendChild(element);

    const bbcodeTitle = document.createElement("h1");
    bbcodeTitle.textContent = "BBCode";
    showcase.appendChild(bbcodeTitle);

    const bbcodeContainer = document.createElement("code");
    bbcodeContainer.classList.add(style.code);
    bbcodeContainer.textContent = button.dataset.bbcode as string;
    showcase.appendChild(bbcodeContainer);

    const htmlTitle = document.createElement("h1");
    htmlTitle.textContent = "HTML";
    showcase.appendChild(htmlTitle);

    const htmlContainer = document.createElement("code");
    htmlContainer.classList.add(style.code);
    htmlContainer.textContent = button.dataset.element as string;
    showcase.appendChild(htmlContainer);
  });

  const navElementItem: HTMLElement = document.createElement("li");
  navElementItem.classList.add(style.navigationListItem);
  navElementItem.appendChild(button);

  navElementList.appendChild(navElementItem);
});

document.addEventListener("DOMContentLoaded", () => {
  while (document.body.lastChild) {
    document.body.removeChild(document.body.lastChild);
  }
  document.body.appendChild(navElement);
  document.body.appendChild(showcase);
});

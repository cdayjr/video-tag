import Video from "../../../src/classes/Video";
import style from "../../../src/classes/Video.style.scss";

test("Video can be created with no arguments", () => {
  const video = new Video();

  expect(video).toBeInstanceOf(Video);
});

test("getProvider returns valid string", () => {
  const video = new Video();

  expect(video.getProvider()).toBe("Invalid");
});

test('getElement returns "Invalid Video"', () => {
  const video = new Video();
  const videoElement = video.getElement();

  expect(videoElement.tagName).toBe("DIV");
  expect(videoElement.classList.contains(style.videoContainer)).toBeTruthy();

  const errorMessage = videoElement.querySelector(`*`);

  expect(errorMessage).toBeInstanceOf(HTMLElement);

  expect(errorMessage.tagName).toBe("P");
  expect(errorMessage.classList.contains(style.errorMessage)).toBeTruthy();
  expect(errorMessage.textContent).toBe("Invalid Video");
});

test("exportOptions returns nothing", () => {
  const video = new Video();

  expect(video.exportOptions()).toBeFalsy();
});

import Video from "../../../src/classes/Video";
import style from "../../../src/classes/Video.style.scss";

test("Video can be created with no arguments", (): void => {
  const video = new Video();

  expect(video instanceof Video).toBeTruthy();
});

test("getProvider returns valid string", (): void => {
  const video = new Video();

  expect(video.getProvider()).toBe("Invalid");
});

test('getElement returns "Invalid Video"', (): void => {
  const video = new Video();
  const videoElement = video.getElement();

  expect(videoElement.tagName).toBe("DIV");
  expect(videoElement.classList.contains(style.videoContainer)).toBeTruthy();

  const errorMessage = videoElement.querySelector(`*`);

  expect(errorMessage instanceof HTMLElement).toBeTruthy();
  if (errorMessage) {
    expect(errorMessage.tagName).toBe("P");
    expect(errorMessage.classList.contains(style.errorMessage)).toBeTruthy();
    expect(errorMessage.textContent).toBe("Invalid Video");
  }
});

test("exportOptions returns nothing", (): void => {
  const video = new Video();

  expect(video.exportOptions()).toBeFalsy();
});

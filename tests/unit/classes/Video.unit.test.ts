import Video from "../../../src/classes/Video";
import style from "../../../src/classes/Video.style.scss";

test("Video can be created with no arguments", (): void => {
  const video = new Video();

  expect(video.constructor).toBe(Video);
});

test("getProvider returns valid string", (): void => {
  const video = new Video();

  expect(video.getProvider()).toBe("Invalid");
});

test('getElement returns "Invalid Video"', (): void => {
  const video = new Video();

  expect(video.getElement().tagName).toBe("DIV");
  expect(video.getElement().classList.contains(style.videoContainer)).toBe(
    true
  );
  expect(video.getElement().children[0].tagName).toBe("P");
  expect(video.getElement().children[0].textContent).toBe("Invalid Video");
});

test("exportOptions returns empty string", (): void => {
  const video = new Video();

  expect(video.exportOptions()).toBe("");
});

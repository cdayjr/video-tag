import Video from "../../../src/classes/Video";

test("Video can be created with no arguments", () => {
  const video = new Video();

  expect(video).toBeInstanceOf(Video);
});

test("getProvider returns Invalid", () => {
  const video = new Video();

  expect(video.getProvider()).toBe("Invalid");
});

test("exportOptions returns nothing", () => {
  const video = new Video();

  expect(video.exportOptions()).toBeFalsy();
});

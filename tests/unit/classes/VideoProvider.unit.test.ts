import VideoProvider from "../../../src/classes/VideoProvider";

test("isProvider returns false", (): void => {
  expect(VideoProvider.isProvider("")).toBe(false);
  expect(VideoProvider.isProvider("https://youtu.be/whatever")).toBe(false);
});

test("getProviderString returns Invalid", (): void => {
  expect(VideoProvider.getProviderString()).toBe("Invalid");
});

import Video from "../../src/classes/Video";

it("Creates video container that contains Invalid Video text", () => {
  const video = new Video("");

  const videoElement = video.getElement();

  expect(videoElement).toMatchSnapshot();
});

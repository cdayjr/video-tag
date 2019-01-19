import YouTube from "../../../src/classes/providers/YouTube";

it("Creates YouTube embed element", () => {
  const youtube = new YouTube(
    "https://www.youtube.com/watch?v=g4Hbz2jLxvQ&t=0m10s"
  );

  const youtubeElement = youtube.getElement();

  expect(youtubeElement).toMatchSnapshot();
});

import Video from "../../../src/classes/Video";

test("getProvider returns valid string", () => {
  const video1 = new Video("");

  expect(video1.getProvider()).toBe("Invalid");
});

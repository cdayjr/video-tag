import YouTube from "../../../../src/classes/providers/YouTube";

test("getProviderString is YouTube", (): void => {
  expect(YouTube.getProviderString()).toBe("YouTube");

  // test non-static variant
  const youtube = new YouTube("");
  expect(youtube.getProviderString()).toBe("YouTube");
});

test("Test empty source returns an empty getElement", (): void => {
  const youtube = new YouTube("");

  expect(youtube.getElement()).toBe(null);
});

import Video from "../../../src/classes/Video";

import Vimeo from "../../../src/classes/providers/Vimeo";

test("getProvider returns provider string from provider", () => {
  const video = new Video("https://vimeo.com/16679115#t=600s");

  expect(video.getProvider()).toBe(Vimeo.getProviderString());
});

test("getProvider returns provider string if provider is set", () => {
  const video = new Video(
    "https://vimeo.com/16679115#t=600s",
    Vimeo.getProviderString()
  );

  expect(video.getProvider()).toBe(Vimeo.getProviderString());
});

test("ID only does not set provider", () => {
  const video = new Video("16679115");

  expect(video.getProvider()).toBe("Invalid");
});

test("importOptions and exportOptions work as intended", () => {
  const video = new Video("https://vimeo.com/16679115#t=600s");
  const vimeo = new Vimeo("https://vimeo.com/16679115#t=600s");

  expect(video.getProvider()).toBe(Vimeo.getProviderString());
  expect(video.exportOptions()).toBe(vimeo.exportOptions());

  // should clear provider and options
  video.importOptions("", "");

  expect(video.getProvider()).toBe("Invalid");
  expect(video.exportOptions()).toBe("");

  // setting the options back
  video.importOptions(Vimeo.getProviderString(), vimeo.exportOptions());

  expect(video.getProvider()).toBe(Vimeo.getProviderString());
  expect(video.exportOptions()).toBe(vimeo.exportOptions());
});

import Vimeo from "../../../../src/classes/providers/Vimeo";

const paramStringToObject = (input: string): { [key: string]: string } => {
  const output: { [key: string]: string } = {};
  new URLSearchParams(input).forEach((value, key) => {
    output[key] = value;
  });
  return output;
};

test("getProviderString is Vimeo", () => {
  expect(Vimeo.getProviderString()).toBe("Vimeo");

  // test non-static variant
  const vimeo = new Vimeo("");
  expect(vimeo.getProviderString()).toBe("Vimeo");
});

test("Test empty source returns an empty getElement", () => {
  const vimeo = new Vimeo("");

  expect(vimeo.getElement()).toBeNull();
});

test("Test importOptions and exportOptions with ? prefix", () => {
  const vimeo = new Vimeo("");

  const initialString = "test=test&test2=2&test3=true&test4&test5=&test6=test";

  vimeo.importOptions(`?${initialString}`);

  expect(paramStringToObject(vimeo.exportOptions())).toEqual({
    test: "test",
    test2: "2",
    test3: "true",
    test4: "",
    test5: "",
    test6: "test"
  });
});

test("Test importOptions and exportOptions without ? prefix and duplicate keys", () => {
  const vimeo = new Vimeo("");

  const initialString =
    "test=test&test2=2&test3=true&test4&test5=&test6=test&test=test2&test4=4";

  vimeo.importOptions(initialString);

  expect(paramStringToObject(vimeo.exportOptions())).toEqual({
    test: "test2",
    test2: "2",
    test3: "true",
    test4: "4",
    test5: "",
    test6: "test"
  });
});

interface Options {
  id: string;
  start?: string;
}

const vimeoExpect =
  "https://player.vimeo.com/video/16679115?color=ffffff&title=0&byline=0&portrait=0&autoplay=0";
const vimeoWithStartExpect =
  "https://player.vimeo.com/video/16679115?color=ffffff&title=0&byline=0&portrait=0&autoplay=0#t=0h10m0s";
const vimeoOptions: Options = {
  id: "16679115"
};

const vimeoOptionsWithStart: Options = {
  id: "16679115",
  start: "600"
};

const inputs: {
  source: string;
  expect: string;
  options: Options;
}[] = [
  {
    source: vimeoExpect,
    expect: vimeoExpect,
    options: vimeoOptions
  },
  {
    source: "https://vimeo.com/16679115",
    expect: vimeoExpect,
    options: vimeoOptions
  },
  {
    source: "https://vimeo.com/video/16679115",
    expect: vimeoExpect,
    options: vimeoOptions
  },
  {
    source: "http://vimeo.com/16679115",
    expect: vimeoExpect,
    options: vimeoOptions
  },
  {
    source: "http://www.vimeo.com/16679115",
    expect: vimeoExpect,
    options: vimeoOptions
  },
  {
    source: "https://vimeo.com/16679115#t=600s",
    expect: vimeoWithStartExpect,
    options: vimeoOptionsWithStart
  },
  {
    source: vimeoWithStartExpect,
    expect: vimeoWithStartExpect,
    options: vimeoOptionsWithStart
  },
  {
    source: "16679115",
    expect: vimeoExpect,
    options: vimeoOptions
  }
];

inputs.forEach(input => {
  test(`${input.source} is handled correctly`, () => {
    const vimeo = new Vimeo(input.source);

    expect(paramStringToObject(vimeo.exportOptions())).toEqual(input.options);

    const vimeoElement = vimeo.getElement();

    expect(vimeoElement).toBeInstanceOf(HTMLElement);

    expect(vimeoElement.tagName).toBe("IFRAME");
    expect(vimeoElement.getAttribute("allowfullscreen")).toBe("");
    expect(vimeoElement.getAttribute("webkitallowfullscreen")).toBe("");
    expect(vimeoElement.getAttribute("mozallowfullscreen")).toBe("");

    expect(vimeoElement.getAttribute("src")).toBe(input.expect);
  });
});

const invalidInputs: string[] = [
  "https://www.youtube.com/watch?v=g4Hbz2jLxvQ",
  "https://youtu.be/g4Hbz2jLxvQ",
  "https://www.twitch.tv/videos/355193670",
  "https://www.twitch.tv/videos/355193670?t=02h16m51s",
  "https://www.twitch.tv/impactwrestling",
  "impactwrestling"
];

invalidInputs.forEach(input => {
  test(`Incorrect Source: ${input}`, () => {
    const vimeo = new Vimeo(input);
    expect(vimeo.exportOptions()).toBeFalsy();
    expect(vimeo.getElement()).toBeNull();
  });
});
import Twitch from "../../../../src/classes/providers/Twitch";

const paramStringToObject = (input: string): { [key: string]: string } => {
  const output: { [key: string]: string } = {};
  new URLSearchParams(input).forEach((value, key) => {
    output[key] = value;
  });
  return output;
};

test("getProviderString is Twitch", () => {
  expect(Twitch.getProviderString()).toBe("Twitch");

  // test non-static variant
  const twitch = new Twitch("");
  expect(twitch.getProviderString()).toBe("Twitch");
});

test("Test empty source returns an empty getElement", () => {
  const twitch = new Twitch("");

  expect(twitch.getElement()).toBeNull();
});

test("Test importOptions and exportOptions with ? prefix", () => {
  const twitch = new Twitch("");

  const initialString = "test=test&test2=2&test3=true&test4&test5=&test6=test";

  twitch.importOptions(`?${initialString}`);

  expect(paramStringToObject(twitch.exportOptions())).toEqual({
    test: "test",
    test2: "2",
    test3: "true",
    test4: "",
    test5: "",
    test6: "test"
  });
});

test("Test importOptions and exportOptions without ? prefix and duplicate keys", () => {
  const twitch = new Twitch("");

  const initialString =
    "test=test&test2=2&test3=true&test4&test5=&test6=test&test=test2&test4=4";

  twitch.importOptions(initialString);

  expect(paramStringToObject(twitch.exportOptions())).toEqual({
    test: "test2",
    test2: "2",
    test3: "true",
    test4: "4",
    test5: "",
    test6: "test"
  });
});

interface VODOptions {
  id: string;
  start?: string;
}

interface ChannelOptions {
  channel: string;
}

const twitchExpect =
  "https://player.twitch.tv/?autoplay=false&video=v355193670";
const twitchWithStartExpect =
  "https://player.twitch.tv/?autoplay=false&video=v355193670&t=2h16m51s";
const twitchChannelExpect =
  "https://player.twitch.tv/?autoplay=false&channel=impactwrestling";
const twitchOptions: VODOptions = {
  id: "v355193670"
};

const twitchOptionsWithStart: VODOptions = {
  id: "v355193670",
  start: "8211"
};

const twitchOptionsWithChannel: ChannelOptions = {
  channel: "impactwrestling"
};

const inputs: {
  source: string;
  expect: string;
  options: VODOptions | ChannelOptions;
}[] = [
  {
    source: twitchExpect,
    expect: twitchExpect,
    options: twitchOptions
  },
  {
    source: "https://www.twitch.tv/videos/355193670",
    expect: twitchExpect,
    options: twitchOptions
  },
  {
    source: "http://www.twitch.tv/videos/355193670",
    expect: twitchExpect,
    options: twitchOptions
  },
  {
    source: "http://twitch.tv/videos/355193670",
    expect: twitchExpect,
    options: twitchOptions
  },
  {
    source: "http://twitch.tv/?video=v355193670",
    expect: twitchExpect,
    options: twitchOptions
  },
  {
    source: "https://www.twitch.tv/videos/355193670?t=02h16m51s",
    expect: twitchWithStartExpect,
    options: twitchOptionsWithStart
  },
  {
    source: twitchWithStartExpect,
    expect: twitchWithStartExpect,
    options: twitchOptionsWithStart
  },
  {
    source: "355193670",
    expect: twitchExpect,
    options: twitchOptions
  },
  {
    source: "v355193670",
    expect: twitchExpect,
    options: twitchOptions
  },
  {
    source: "https://www.twitch.tv/impactwrestling",
    expect: twitchChannelExpect,
    options: twitchOptionsWithChannel
  },
  {
    source: "https://www.twitch.tv/?channel=impactwrestling",
    expect: twitchChannelExpect,
    options: twitchOptionsWithChannel
  },
  {
    source: "impactwrestling",
    expect: twitchChannelExpect,
    options: twitchOptionsWithChannel
  },
  {
    source: twitchChannelExpect,
    expect: twitchChannelExpect,
    options: twitchOptionsWithChannel
  }
];

inputs.forEach(input => {
  test(`${input.source} is handled correctly`, () => {
    const twitch = new Twitch(input.source);

    expect(paramStringToObject(twitch.exportOptions())).toEqual(input.options);

    const twitchElement = twitch.getElement();

    expect(twitchElement).toBeInstanceOf(HTMLElement);

    expect(twitchElement.tagName).toBe("IFRAME");
    expect(twitchElement.getAttribute("allowfullscreen")).toBe("");
    expect(twitchElement.getAttribute("scrolling")).toBe("no");

    expect(twitchElement.getAttribute("src")).toBe(input.expect);
  });
});

const invalidInputs: string[] = [
  "https://twitch.tv/",
  "https://twitch.tv/?novideorchannel=true",
  "https://www.youtube.com/watch?v=g4Hbz2jLxvQ",
  "https://youtu.be/g4Hbz2jLxvQ",
  "https://vimeo.com/16679115#t=600s",
  ":%#$#$#$"
];

invalidInputs.forEach(input => {
  test(`Incorrect Source: ${input}`, () => {
    const twitch = new Twitch(input);
    expect(twitch.exportOptions()).toBeFalsy();
    expect(twitch.getElement()).toBeNull();
  });
});

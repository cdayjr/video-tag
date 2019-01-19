import Twitch from "../../../src/classes/providers/Twitch";

it("Creates Twitch embed element", () => {
  const twitch = new Twitch(
    "https://www.twitch.tv/videos/355193670?t=02h16m51s"
  );

  const twitchElement = twitch.getElement();

  expect(twitchElement).toMatchSnapshot();
});

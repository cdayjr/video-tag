import Vimeo from "../../../src/classes/providers/Vimeo";

it("Creates Vimeo embed element", () => {
  const vimeo = new Vimeo("https://vimeo.com/16679115#t=600s");

  const vimeoElement = vimeo.getElement();

  expect(vimeoElement).toMatchSnapshot();
});

/**
 * @file ParameterMap Unit Tests
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import ParameterMap from "../../../src/classes/ParameterMap";

const paramStringToObject = (input: string): { [key: string]: string } => {
  const output: Map<string, string> = new Map();
  new URLSearchParams(input).forEach((value, key) => {
    output.set(key, value);
  });
  return Object.fromEntries(output.entries());
};

test("Create ParameterMap with no arguments", () => {
  const map = new ParameterMap();

  expect(map).toBeInstanceOf(ParameterMap);
  expect(map.toString()).toBe("");
});

test("Create ParameterMap with arguments and ? prefix", () => {
  const initialString = "test=test&test2=2&test3=true&test4&test5=&test6=test";

  const map = new ParameterMap(`?${initialString}`);

  expect(paramStringToObject(map.toString())).toEqual({
    test: "test",
    test2: "2",
    test3: "true",
    test4: "",
    test5: "",
    test6: "test",
  });
});

test("Create ParameterMap with arguments", () => {
  const initialString = "test=test&test2=2&test3=true&test4&test5=&test6=test";

  const map = new ParameterMap(initialString);

  expect(paramStringToObject(map.toString())).toEqual({
    test: "test",
    test2: "2",
    test3: "true",
    test4: "",
    test5: "",
    test6: "test",
  });
});

test("Create ParameterMap with arguments and import new ones", () => {
  const initialString = "test=test&test2=2&test3=true&test4&test5=&test6=test";

  const map = new ParameterMap(initialString);

  expect(paramStringToObject(map.toString())).toEqual({
    test: "test",
    test2: "2",
    test3: "true",
    test4: "",
    test5: "",
    test6: "test",
  });

  map.importParams("test5=11&test7=12");

  expect(paramStringToObject(map.toString())).toEqual({
    test: "test",
    test2: "2",
    test3: "true",
    test4: "",
    test5: "11",
    test6: "test",
    test7: "12",
  });
});

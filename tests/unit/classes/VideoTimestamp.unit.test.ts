/**
 * @file VideoTimestamp unit tests
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import VideoTimestamp from "../../../src/classes/VideoTimestamp";

test("Create VideoTimestamp with no arguments", () => {
  const timestamp = new VideoTimestamp();

  expect(timestamp.getSeconds()).toBe(0);
  expect(timestamp.toString()).toBe("0h0m0s");
});

test("Create VideoTimestamp with incorrect arguments", () => {
  const timestamp = new VideoTimestamp("bingo");

  expect(timestamp.getSeconds()).toBe(0);
  expect(timestamp.toString()).toBe("0h0m0s");
});

test("Create VideoTimestamp with integer argument", () => {
  const timestamp = new VideoTimestamp(15);

  expect(timestamp.getSeconds()).toBe(15);
  expect(timestamp.toString()).toBe("0h0m15s");
});

test("Create VideoTimestamp with decimal argument", () => {
  const timestamp = new VideoTimestamp(15.5);

  expect(timestamp.getSeconds()).toBe(15);
  expect(timestamp.toString()).toBe("0h0m15s");

  const timestamp2 = new VideoTimestamp(15.4);

  expect(timestamp2.getSeconds()).toBe(15);
  expect(timestamp2.toString()).toBe("0h0m15s");
});

test("Create VideoTimestamp with integer string argument", () => {
  const timestamp = new VideoTimestamp("15");

  expect(timestamp.getSeconds()).toBe(15);
  expect(timestamp.toString()).toBe("0h0m15s");
});

test("Create VideoTimestamp with only seconds", () => {
  const timestamp = new VideoTimestamp("15s");

  expect(timestamp.getSeconds()).toBe(15);
  expect(timestamp.toString()).toBe("0h0m15s");
});

test("Create VideoTimestamp with only minutes", () => {
  const timestamp = new VideoTimestamp("15m");

  expect(timestamp.getSeconds()).toBe(900);
  expect(timestamp.toString()).toBe("0h15m0s");
});

test("Create VideoTimestamp with only hours", () => {
  const timestamp = new VideoTimestamp("15h");

  expect(timestamp.getSeconds()).toBe(54000);
  expect(timestamp.toString()).toBe("15h0m0s");
});

test("Create VideoTimestamp with hours, minutes and seconds", () => {
  const timestamp = new VideoTimestamp("15h15m15s");

  expect(timestamp.getSeconds()).toBe(54915);
  expect(timestamp.toString()).toBe("15h15m15s");
});

test("Create VideoTimestamp with 0 hours, 0 minutes and 0 seconds", () => {
  const timestamp = new VideoTimestamp("0h0m0s");

  expect(timestamp.getSeconds()).toBe(0);
  expect(timestamp.toString()).toBe("0h0m0s");
});

/**
 * @file A Map of URL params
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

/**
 * A map with extra functionality to be created from a string and
 * produce a string.
 */
export default class ParameterMap extends Map<string, string> {
  /**
   * Build a new ParameterMap object
   *
   * @param parameters An url parameter string such as "id=777&start=15"
   */
  public constructor(parameters?: string) {
    super();

    if (parameters) {
      this.importParams(parameters);
    }
  }

  /**
   * Import parameter options from a string.
   *
   * @param input An URL param string such as "id=777&start=15"
   */
  public importParams(input: string): void {
    const paramString = input.substr(0, 1) === "?" ? input.substr(1) : input;

    const items = paramString.split("&");
    items.forEach((item) => {
      if (item.search("=") > -1) {
        const [key, value] = item.split("=");
        this.set(decodeURIComponent(key), decodeURIComponent(value));
      } else {
        this.set(decodeURIComponent(item), "");
      }
    });
  }

  /**
   * Get a string from a ParameterMap object
   *
   * @return An URL param string such as "id=777&start=15"
   */
  public toString(): string {
    let paramString = "";
    this.forEach((value, key) => {
      paramString += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
    });
    if (paramString.length > 0) {
      paramString = paramString.slice(0, -1);
    }

    return paramString;
  }
}

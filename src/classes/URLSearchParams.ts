/**
 * Very simple implementation of URLSearchParams as a polyfill that
 * only uses the features I use for browsers that don't have it
 * built-in
 */
export default window.URLSearchParams ||
  class URLSearchParams extends Map {
    /**
     * Build the object from a string
     *
     * @param inputString A string formatted like "hello=world&foo=bar"
     */
    constructor(inputString?: string) {
      super();

      if (inputString) {
        const paramString =
          inputString.substr(0, 1) === "?"
            ? inputString.substr(1)
            : inputString;

        const items = paramString.split("&");
        items.forEach(item => {
          if (item.search("=") > -1) {
            const [key, value] = item.split("=");
            this.set(decodeURIComponent(key), decodeURIComponent(value));
          } else {
            this.set(decodeURIComponent(item), "");
          }
        });
      }
    }

    /**
     * Build the string from an object
     *
     * @return A string formatted like "hello=world&foo=bar"
     */
    public toString(): string {
      let paramString = "";
      this.forEach((value, key) => {
        paramString +=
          encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
      });
      if (0 < paramString.length) {
        paramString = paramString.slice(0, -1);
      }

      return paramString;
    }
  };

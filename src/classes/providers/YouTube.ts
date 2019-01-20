import VideoProvider from "../VideoProvider";

/**
 * YouTube video provider
 */
export default class YouTube extends VideoProvider {
  /**
   * Build an object from the source string
   *
   * @param source The video source- usually an URL
   */
  public constructor(source: string) {
    super(source);

    if ((this.constructor as typeof VideoProvider).getHostName(source)) {
      const link = document.createElement("a");
      link.setAttribute("href", source.trim());

      // embed URLs- typically people won't have these but good to check.
      const match = source.match(
        /https?:\/\/(?:.+\.)?youtube(?:-nocookie)?\.com\/embed\/(.+?)(?:\?|$)/
      );
      if (match) {
        const [, idMatch] = match;

        this.options.set("id", idMatch);

        const params = (this.constructor as typeof VideoProvider).mapFromString(
          link.search
        );

        if (params.get("start")) {
          const timeCount = parseInt(String(params.get("start")), 10);
          if (timeCount > 0) {
            this.options.set("start", String(timeCount));
          }
        }

        return;
      }

      // Regular URL, what most people will have.
      const match2 = source.match(/https?:\/\/(?:.+\.)?youtube\.com\/watch\?/);
      if (match2) {
        const params = (this.constructor as typeof VideoProvider).mapFromString(
          link.search
        );
        if (params.get("v")) {
          this.options.set("id", String(params.get("v")));
        }
        if (params.get("start")) {
          // start parameter overrides t and is always pure seconds.
          const timeCount = parseInt(String(params.get("start")), 10);
          if (timeCount > 0) {
            this.options.set("start", String(timeCount));
          }
        } else if (params.get("t")) {
          // parse time...
          const timeCount = (this
            .constructor as typeof VideoProvider).timeToSeconds(
            String(params.get("t"))
          );
          if (timeCount === 0) {
            // Sometimes it could just be a string of raw seconds.
            const seconds = parseInt(String(params.get("t")), 10);
            if (seconds > 0) {
              this.options.set("start", String(seconds));
            }
          } else {
            this.options.set("start", String(timeCount));
          }
        }

        return;
      }

      // youtu.be short URLs.
      const match3 = source.match(/https?:\/\/youtu\.be\/(.+$)/);
      if (match3) {
        const [, idMatch] = match3;

        this.options.set("id", idMatch);
      }
    } else if (source.match(/^[a-zA-Z0-9_-]{11}$/)) {
      // With no URL to go off of maybe it's a video ID?
      // https://stackoverflow.com/a/4084332

      this.options.set("id", source);
    }
  }

  /**
   * Let us know if this is a valid provider for the source
   *
   * @param source The source URL of the video
   *
   * @return `true` if it's a valid source, `false` otherwise.
   */
  public static isProvider(source: string): boolean {
    // First test if it's an URL
    const hostName: string = this.getHostName(source);

    return !!hostName.match(/^(?:.+\.)?youtu(?:be(?:-nocookie)?\.com|\.be)$/);
  }

  /**
   * Get the provider string.
   */
  public static getProviderString(): string {
    return "YouTube";
  }

  /**
   * Return the video element
   */
  public getElement(): HTMLIFrameElement | null {
    if (!this.options.get("id")) {
      return null;
    }

    let sourceAddress = `https://www.youtube-nocookie.com/embed/${this.options.get(
      "id"
    )}`;
    /* istanbul ignore else: Only difference in the end result is the `src`
     * attribute, no need to do an additional screenshot. */
    if (this.options.get("start")) {
      sourceAddress += `?start=${this.options.get("start")}`;
    }

    const iframe = document.createElement("iframe");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute(
      "allow",
      "accelerometer; encrypted-media; gyroscope; picture-in-picture"
    );

    iframe.src = sourceAddress;

    return iframe;
  }
}

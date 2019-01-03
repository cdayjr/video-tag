import VideoProvider from "../VideoProvider.ts";

/**
 * YouTube video provider
 */
export default class YouTube extends VideoProvider {
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
   * Build an object from the source string
   *
   * @param source The video source- usually an URL
   */
  constructor(source: string) {
    super();

    if (YouTube.getHostName(source)) {
      const link = document.createElement("a");
      link.setAttribute("href", source.trim());

      // embed URLs- typically people won't have these but good to check.
      const match = source.match(
        /https?:\/\/(?:.+\.)?youtube(?:-nocookie)?\.com\/embed\/(?<id>.+)(?:\?|$)/
      );
      if (match && match.groups.id) {
        this.options.set("id", match.groups.id);
        // No more options to set.
        return;
      }

      // Regular URL, what most people will have.
      const match2 = source.match(/https?:\/\/(?:.+\.)?youtube\.com\/watch\?/);
      if (match2) {
        const params = new URLSearchParams(link.search);
        if (params.get("v")) {
          this.options.set("id", params.get("v"));
        }
        if (params.get("start")) {
          // start parameter overrides t and is always pure seconds.
          const timeCount = parseInt(params.get("start"), 10);
          if (timeCount > 0) {
            this.options.set("start", timeCount);
          }
        } else if (params.get("t")) {
          // parse time...
          let timeCount = this.timeToSeconds(params.get("t"));
          if (0 >= timeCount) {
            // Sometimes it could just be a string of raw seconds.
            timeCount = 0;
            const seconds = parseInt(params.get("t"), 10);
            if (seconds > 0) {
              timeCount += seconds;
            }
          }
          if (timeCount > 0) {
            this.options.set("start", "" + timeCount);
          }
        }

        return;
      }

      // youtu.be short URLs.
      const match3 = source.match(/https?:\/\/youtu\.be\/(?<id>.+$)/);
      if (match3 && match3.groups.id) {
        this.options.set("id", match3.groups.id);
      }
    } else if (source.match(/^[a-zA-Z0-9_-]{11}$/)) {
      // With no URL to go off of maybe it's a video ID?
      // https://stackoverflow.com/a/4084332

      this.options.set("id", source);
    }
  }

  public getElement(): HTMLIFrameElement {
    let sourceAddress = `https://www.youtube-nocookie.com/embed/${this.options.get(
      "id"
    )}`;
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

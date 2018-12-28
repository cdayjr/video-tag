import style from './style.scss';

enum Source {
  Twitch,
  Vimeo,
  YouTube,
  Invalid
}

export class Video {
  // basicaly whatever the options are
  private options: Map<string, string> = new Map<string, string>();

  // Video source; Twitch, Vimeo, YouTube, etc.
  private source: Source = Source.Invalid;

  constructor(content: string, sourceString?: string) {
    if (sourceString) {
      this.source = this.parseSourceString(sourceString);
    } else {
      this.source = this.guessSource(content);
    }

    content = content.trim();

    switch (this.source) {
      case Source.Twitch:
        const match = content.match(/https?:\/\/(?:.+\.)?twitch\.tv\/(?:(?:videos\/(\d+))|embed\/)?(\w+)?/);
        if (match) {
          if (undefined !== match[2]) {
            this.options.set("channel", match[2]);
          } else if (undefined !== match[1]) {
            // if video ID is gathered this way, we need to
            // manually add a v in front
            this.options.set("id", `v${match[1]}`);
          }
          const querySplit = content.split("?");
          if (undefined !== querySplit[1]) {
            const queryString = querySplit[1];
            const query = this.parseQuery(queryString);
            if (!this.options.get("channel") && !this.options.get("id")) {
              if (query.get("channel")) {
                this.options.set("channel", query.get("channel"));
              } else if (query.get("video")) {
                this.options.set("id", query.get("video"));
              }
            }
            if (query.get("t")) {
              this.options.set("start", this.timeToSeconds(query.get("t")));
            }
          }

          if (!this.options.get("id") && !this.options.get("channel")) {

            // Invalid URL
            this.source = Source.Invalid;

            return;
          }
        }


        if (!this.options.get("id") && !this.options.get("channel")) {
          // Cound just be a video id
          if (content.match(/^\d+$/)) {
            this.options.set('id', `v${content}`);

            return;
          } else if (content.match(/^v\d+$/)) {
            this.options.set('id', content);

            return;
          } else {
            // Just assume it's a channel I guess?
            this.options.set('channel', content);

            return;
          }

          return;
        }
        break;

      case Source.Vimeo:
        const match = content.match(/^https?:\/\/(?:.+\.)?vimeo\.com\/(?:video\/)?(\d+)\??(.*)?$/);
        if (match && undefined !== match[1]) {
          this.options.set('id', match[1]);

          const querySplit = content.split("#");
          if (undefined !== querySplit[1]) {
            const queryString = querySplit[1];
            const query = this.parseQuery(queryString);
            if (query.get("t")) {
              this.options.set("start", this.timeToSeconds(query.get("t")));
            }
          }


          return;
        }

        // Could just be a video ID
        if (content.match(/^\d+$/)) {
          this.options.set('id', content);

          return;
        }

        // If we can't find a match, it's invalid.
        if (!this.options.get("id")) {
          this.source = Source.Invalid;

          return;
        }
        break;

      case Source.YouTube:
        // embed URLs- typically people won't have these but good to check
        const match = content.match(
          /https?:\/\/(?:.+\.)?youtube(?:-nocookie)?\.com\/embed\/(.*)(?:&|\?|$)/
        );
        if (match && undefined !== match[1]) {
          this.options.set("id", match[1]);
          // no more options to set.
          return;
        }

        // Regular URL, what most people will have
        const match = content.match(
          /https?:\/\/(?:.+\.)?youtube\.com\/watch\?/
        );
        if (match) {
          const queryString = content.split("?")[1];
          const query = this.parseQuery(queryString);
          if (query.get("v")) {
            this.options.set("id", query.get("v"));
          }
          if (query.get("start")) {
            // start parameter overrides t and is always pure seconds
            const timeCount = parseInt(query.get("start"), 10);
            if (timeCount > 0) {
              this.options.set("start", timeCount);
            }
          } else if (query.get("t")) {
            // parse time...
            let timeCount = this.timeToSeconds(query.get("t"));
            if (0 >= timeCount) {
              // Sometimes it could just be a string of raw seconds
              timeCount = 0;
              const seconds = parseInt(query.get("t"), 10);
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

        // youtu.be short urls
        const match = content.match(/https?:\/\/youtu\.be\/(.+$)/);
        if (match && undefined !== match[1]) {
          this.options.set('id', match[1]);

          return;
        }

        // With no URL to go off of maybe it's a video ID?
        // https://stackoverflow.com/a/4084332
        if (content.match(/^[a-zA-Z0-9_-]{11}$/)) {
          this.options.set('id', content);

          return;
        }

        // If we can't find a match, it's invalid.
        if (!this.options.get("id")) {
          this.source = Source.Invalid;

          return;
        }
        break;

      case Source.Invalid:
      default:
        return;
    }
  }

  public importOptions(sourceString: string, optionsString: string): void {
    this.source = parseSourceString(sourceString);
    this.options = this.parseQuery(optionsString);
  }

  public getElement(): HTMLDivElement {
    const container: HTMLDivElemenet = document.createElement("div");
    container.classList.add(style.container);

    switch (this.source) {
      case Source.Twitch:
        let sourceAddress = "";
        if (this.options.get("channel")) {
          // stream embed
          sourceAddress = `https://player.twitch.tv/?autoplay=false&channel=${this.options.get("channel")}`;
        } else if (this.options.get("id")) {
          // vod embed
          sourceAddress = `https://player.twitch.tv/?autoplay=false&video=${this.options.get("id")}`;
          if (this.options.get("start")) {
            sourceAddress += `&t=${this.secondsToTime(this.options.get("start"))}`;
          }
        }
        if (sourceAddress) {
          container.appendChild(this.createIFrame(sourceAddress));
        }
        break;
      case Source.Vimeo:
        const sourceAddress = `https://player.vimeo.com/video/${this.options.get("id")}?color=ffffff&title=0&byline=0&portrait=0&autoplay=0`

        if (this.options.get("start")) {
          sourceAddress += `#t=${this.secondsToTime(this.options.get("start"))}`;
        }


        container.appendChild(this.createIFrame(sourceAddress));

        const scriptTag = document.createElement("script");
        scriptTag.setAttribute("src", "https://player.vimeo.com/api/player.js");
        container.appendChild(scriptTag);

        break;
      case Source.YouTube:
        let sourceAddress = `https://www.youtube-nocookie.com/embed/${this.options.get(
          "id"
        )}`;
        if (this.options.get('start') {
          sourceAddress += `?start=${this.options.get('start')}`
        }

        container.appendChild(this.createIFrame(sourceAddress));
        break;
      default:
        break;
    }

    if (0 >= container.children.length) {
      const message = document.createElement("p");
      message.textContent = "Invalid Video";
      container.appendChild(message);
    }

    return container;
  }

  public exportOptions(): string {
    return this.createQueryString(this.options);
  }

  public getSource(): string {
    return this.sourceToString(this.source);
  }

  private sourceToString(source: Source): string {
    switch (source) {
      case Source.Invalid:
        return "Invalid";
      case Source.Twitch:
        return "Twitch";
      case Source.Vimeo:
        return "Vimeo";
      case Source.YouTube:
        return "YouTube";
      default:
        return "";
    }
  }

  private guessSource(content: string): Source {
    // First test if it's an URL
    const host: string = this.getHost(content);
    if (0 < host.length) {
      if (host.match(/^(?:.+\.)?twitch\.tv$/)) {
        return Source.Twitch;
      }
      if (host.match(/^(?:.+\.)?vimeo\.com$/)) {
        return Source.Vimeo;
      }
      if (host.match(/^(?:.+\.)?youtu(?:be(?:-nocookie)?\.com|\.be)$/)) {
        return Source.YouTube;
      }
    }

    return Source.Invalid;
  }

  private parseSourceString(sourceString: string): Source {
    sourceString = sourceString.trim().toLowerCase();
    switch (sourceString) {
      case "twitch":
        return Source.Twitch;
      case "vimeo":
        return Source.Vimeo;
      case "youtube":
        return Source.YouTube;
      default:
        return Source.Invalid;
    }

    return source;
  }

  private parseQuery(
    queryString: string,
    itemSeparator?: string,
    valueSeparator?: string
  ): Map<string, string> {
    if (!itemSeparator) {
      itemSeparator = "&";
    }
    if (!valueSeparator) {
      valueSeparator = "=";
    }

    const query = new Map<string, string>();
    const items: string[] = queryString.split(itemSeparator);
    items.forEach(item => {
      if (item) {
        if (item.search(valueSeparator) > -1) {
          const [key, value] = item.split(valueSeparator);
          query.set(decodeURIComponent(key), decodeURIComponent(value));
        } else {
          query.set(decodeURIComponent(item), "");
        }
      }
    });

    return query;
  }

  private createQueryString(query: Map<string, string>): string {
    let queryString: string = "";
    query.forEach((value, key) => {
      queryString +=
        encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
    });
    if (0 < queryString.length) {
      queryString = queryString.slice(0, -1);
    }

    return queryString;
  }

  private getHost(content: string): string {
    const test: HTMLAElement = document.createElement("a");
    test.setAttribute("href", content);

    if (
      content.startsWith(window.location.protocol) ||
      test.protocol !== window.location.protocol ||
      content.search(window.location.host) > -1
    ) {
      return test.host;
    }

    return "";
  }

  private timeToSeconds(time: string): number {
    const match = time.match(/(\d+h)?(\d+m)?(\d+s)?/);
    let count = 0;
    if (match[0]) {
      if (match[1]) {
        const hours = parseInt(match[1], 10);
        if (hours > 0) {
          count += hours * 60 * 60;
        }
      }
      if (match[2]) {
        const minutes = parseInt(match[2], 10);
        if (minutes > 0) {
          count += minutes * 60;
        }
      }
      if (match[3]) {
        const seconds = parseInt(match[3], 10);
        if (seconds > 0) {
          count += seconds;
        }
      }
    }

    return count;
  }

  private secondsToTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / (60 * 60));
    const minutes = Math.floor((totalSeconds - (hours * 60 * 60)) / 60);
    const seconds = Math.floor((totalSeconds - ((hours * 60 * 60) + (minutes * 60)));
    return `${hours}h${minutes}m${seconds}s`;
  }

  private createIFrame(src: string): HTMLIFrameElement {
    const iframe = document.createElement("iframe");
    // twitch, vimeo, and youtube all have this
    iframe.setAttribute(
      "allowfullscreen",
      ""
    );

    // only twitch has this but it doesn't look like it'd hurt
    iframe.setAttribute(
      "scrolling",
      "no"
    );

    // only vimeo has these but it doesn't look like it'd hurt
    iframe.setAttribute(
      "webkitallowfullscreen",
      ""
    );
    iframe.setAttribute(
      "mozallowfullscreen",
      ""
    );

    // only youtube has this but it doesn't look like it'd hurt
    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    );

    // Our custom styles
    iframe.classList.add(style.videoContent);

    // Finally, throw that source address in there
    iframe.src = src;

    return iframe;
  }
}

export default Video;

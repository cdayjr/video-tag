import style from './style.scss';

/**
 * Store the different kinds of sources for video we support.
 */
enum Source {
  Twitch,
  Vimeo,
  YouTube,
  Invalid
}

/**
 * Class for handling all functions related towards parsing Video URLs
 * into their embed URLs.
 */
export class Video {
  /**
   * All options related to the video, including its ID.
   */
  private options: Map<string, string> = new Map<string, string>();

  /**
   * Stores what video source this object contains.
   */
  private source: Source = Source.Invalid;

  /**
   * Build a Video object. All you need is an URL, but providng a source
   * means you can get by with just a video ID.
   *
   * @param content - The video URL or ID.
   * @param source - We can figure this out form an URL, but if an ID is
   *  provided, you'll want to share this. A string like "YouTube" or "Vimeo".
   *
   */
  constructor(content: string, sourceString?: string) {
    if (sourceString) {
      this.source = this.parseSourceString(sourceString);
    } else {
      this.source = this.guessSource(content);
    }

    content = content.trim();

    switch (this.source) {
      case Source.Twitch:
        const match = content.match(
          /https?:\/\/(?:.+\.)?twitch\.tv\/(?:(?:videos\/(\d+))|embed\/)?(\w+)?/
        );
        if (match) {
          if (undefined !== match[2]) {
            this.options.set('channel', match[2]);
          } else if (undefined !== match[1]) {
            // If video ID is gathered this way, we need to
            // manually add a `v` in front.
            this.options.set('id', `v${match[1]}`);
          }
          const querySplit = content.split('?');
          if (undefined !== querySplit[1]) {
            const queryString = querySplit[1];
            const query = this.parseQuery(queryString);
            if (!this.options.get('channel') && !this.options.get('id')) {
              if (query.get('channel')) {
                this.options.set('channel', query.get('channel'));
              } else if (query.get('video')) {
                this.options.set('id', query.get('video'));
              }
            }
            if (query.get('t')) {
              this.options.set('start', this.timeToSeconds(query.get('t')));
            }
          }

          if (!this.options.get('id') && !this.options.get('channel')) {
            // Invalid URL.
            this.source = Source.Invalid;

            return;
          }
        }

        if (!this.options.get('id') && !this.options.get('channel')) {
          // Could just be a video ID.
          if (content.match(/^\d+$/)) {
            this.options.set('id', `v${content}`);

            return;
          } else if (content.match(/^v\d+$/)) {
            this.options.set('id', content);

            return;
          } else {
            // Just assume it's a channel?
            this.options.set('channel', content);

            return;
          }

          return;
        }
        break;

      case Source.Vimeo:
        const match = content.match(
          /^https?:\/\/(?:.+\.)?vimeo\.com\/(?:video\/)?(\d+)\??(.*)?$/
        );
        if (match && undefined !== match[1]) {
          this.options.set('id', match[1]);

          const querySplit = content.split('#');
          if (undefined !== querySplit[1]) {
            const queryString = querySplit[1];
            const query = this.parseQuery(queryString);
            if (query.get('t')) {
              this.options.set('start', this.timeToSeconds(query.get('t')));
            }
          }

          return;
        }

        // Could just be a video ID?
        if (content.match(/^\d+$/)) {
          this.options.set('id', content);

          return;
        }

        // If we can't find a match, it's invalid.
        if (!this.options.get('id')) {
          this.source = Source.Invalid;

          return;
        }
        break;

      case Source.YouTube:
        // embed URLs- typically people won't have these but good to check.
        const match = content.match(
          /https?:\/\/(?:.+\.)?youtube(?:-nocookie)?\.com\/embed\/(.*)(?:&|\?|$)/
        );
        if (match && undefined !== match[1]) {
          this.options.set('id', match[1]);
          // No more options to set.
          return;
        }

        // Regular URL, what most people will have.
        const match = content.match(
          /https?:\/\/(?:.+\.)?youtube\.com\/watch\?/
        );
        if (match) {
          const queryString = content.split('?')[1];
          const query = this.parseQuery(queryString);
          if (query.get('v')) {
            this.options.set('id', query.get('v'));
          }
          if (query.get('start')) {
            // start parameter overrides t and is always pure seconds.
            const timeCount = parseInt(query.get('start'), 10);
            if (timeCount > 0) {
              this.options.set('start', timeCount);
            }
          } else if (query.get('t')) {
            // parse time...
            let timeCount = this.timeToSeconds(query.get('t'));
            if (0 >= timeCount) {
              // Sometimes it could just be a string of raw seconds.
              timeCount = 0;
              const seconds = parseInt(query.get('t'), 10);
              if (seconds > 0) {
                timeCount += seconds;
              }
            }
            if (timeCount > 0) {
              this.options.set('start', '' + timeCount);
            }
          }

          return;
        }

        // youtu.be short URLs.
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
        if (!this.options.get('id')) {
          this.source = Source.Invalid;

          return;
        }
        break;

      case Source.Invalid:
      default:
        return;
    }
  }

  /**
   * If you already have parsed out options, you can call this to
   * rebuild the object based on those parameters.
   *
   * @param sourceString - A string representing the source, ex. "YouTube" or "Vimeo".
   * @param optionsString - A string representing the options, ex. "id=666&start=15".
   */
  public importOptions(sourceString: string, optionsString: string): void {
    this.source = parseSourceString(sourceString);
    this.options = this.parseQuery(optionsString);
  }

  /**
   * Get the HTML element that embeds the video from its source.
   *
   * @return An HTMLDivElement containing the iframe or other embed code
   *  for the video.
   */
  public getElement(): HTMLDivElement {
    const container: HTMLDivElemenet = document.createElement('div');
    container.classList.add(style.container);

    switch (this.source) {
      case Source.Twitch:
        let sourceAddress = '';
        if (this.options.get('channel')) {
          // stream embed
          sourceAddress = `https://player.twitch.tv/?autoplay=false&channel=${this.options.get(
            'channel'
          )}`;
        } else if (this.options.get('id')) {
          // vod embed
          sourceAddress = `https://player.twitch.tv/?autoplay=false&video=${this.options.get(
            'id'
          )}`;
          if (this.options.get('start')) {
            sourceAddress += `&t=${this.secondsToTime(
              this.options.get('start')
            )}`;
          }
        }
        if (sourceAddress) {
          container.appendChild(this.createIFrame(sourceAddress));
        }
        break;
      case Source.Vimeo:
        const sourceAddress = `https://player.vimeo.com/video/${this.options.get(
          'id'
        )}?color=ffffff&title=0&byline=0&portrait=0&autoplay=0`;

        if (this.options.get('start')) {
          sourceAddress += `#t=${this.secondsToTime(
            this.options.get('start')
          )}`;
        }

        container.appendChild(this.createIFrame(sourceAddress));

        const scriptTag = document.createElement('script');
        scriptTag.setAttribute('src', 'https://player.vimeo.com/api/player.js');
        container.appendChild(scriptTag);

        break;
      case Source.YouTube:
        let sourceAddress = `https://www.youtube-nocookie.com/embed/${this.options.get(
          'id'
        )}`;
        if (this.options.get('start')) {
          sourceAddress += `?start=${this.options.get('start')}`;
        }

        container.appendChild(this.createIFrame(sourceAddress));
        break;
      default:
        break;
    }

    if (0 >= container.children.length) {
      const message = document.createElement('p');
      message.textContent = 'Invalid Video';
      container.appendChild(message);
    }

    return container;
  }

  /**
   * Get an options string compatible with our `importOptions` function.
   *
   * @return An options string such as 'id=7&start=15'.
   */
  public exportOptions(): string {
    return this.createQueryString(this.options);
  }

  /**
   * Get a string representation of this video's source.
   *
   * @return A string such as "YouTube" or "Vimeo".
   */
  public getSource(): string {
    return this.sourceToString(this.source);
  }

  /**
   * Convert a Source value to a string representation of it.
   *
   * @param source The source value you want a string of.
   *
   * @return A string such as "YouTube" or "Vimeo".
   */
  private sourceToString(source: Source): string {
    switch (source) {
      case Source.Invalid:
        return 'Invalid';
      case Source.Twitch:
        return 'Twitch';
      case Source.Vimeo:
        return 'Vimeo';
      case Source.YouTube:
        return 'YouTube';
      default:
        return '';
    }
  }

  /**
   * Make an educated guess for what a source should be from a provided URL-
   * useful when source isn't manually provided.
   *
   * @param content - A string, usually a URL, to figure out the source from.
   *
   * @return Source - A Source enum value.
   */
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

  /**
   * Parse a source string such as "YouTube" into a Source enum value.
   *
   * @param sourceString - A string such as "YouTube" or "Vimeo".
   *
   * @return - A Source enum value.
   */
  private parseSourceString(sourceString: string): Source {
    sourceString = sourceString.trim().toLowerCase();
    switch (sourceString) {
      case 'twitch':
        return Source.Twitch;
      case 'vimeo':
        return Source.Vimeo;
      case 'youtube':
        return Source.YouTube;
      default:
        return Source.Invalid;
    }

    return source;
  }

  /**
   * Parse a query string into a key->value map.
   *
   * @param queryString - A string of keys and values to convert to a Map.
   * @param itemSeparator - What separates each item, defaults to "&".
   * @param valueSeparator - What separates keys from values, defaults to "=".
   *
   * @return A Map object holding values associated with each key.
   */
  private parseQuery(
    queryString: string,
    itemSeparator?: string,
    valueSeparator?: string
  ): Map<string, string> {
    if (!itemSeparator) {
      itemSeparator = '&';
    }
    if (!valueSeparator) {
      valueSeparator = '=';
    }

    const query = new Map<string, string>();
    const items: string[] = queryString.split(itemSeparator);
    items.forEach(item => {
      if (item) {
        if (item.search(valueSeparator) > -1) {
          const [key, value] = item.split(valueSeparator);
          query.set(decodeURIComponent(key), decodeURIComponent(value));
        } else {
          query.set(decodeURIComponent(item), '');
        }
      }
    });

    return query;
  }

  /**
   * Create a query string from a Map object.
   *
   * @param query - The Query map object to convert to a string.
   *
   * @return A query string such as "id=7&start=50".
   */
  private createQueryString(query: Map<string, string>): string {
    let queryString: string = '';
    query.forEach((value, key) => {
      queryString +=
        encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
    });
    if (0 < queryString.length) {
      queryString = queryString.slice(0, -1);
    }

    return queryString;
  }

  /**
   * Get the host from a URL.
   *
   * @param content - A URL to figure out the host from.
   *
   * @return The host string, defaults to "" if host can't be found.
   */
  private getHost(content: string): string {
    const test: HTMLAElement = document.createElement('a');
    test.setAttribute('href', content);

    if (
      content.startsWith(window.location.protocol) ||
      test.protocol !== window.location.protocol ||
      content.search(window.location.host) > -1
    ) {
      return test.host;
    }

    return '';
  }

  /**
   * Convert a time string to a number of seconds.
   *
   * @param time - The time string, such as "0h1m5s".
   *
   * @return The number of seconds in the time string, such as "65".
   */
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

  /**
   * Convert seconds to a time string.
   *
   * @param totalSeconds - The seconds to convert, such as 65.
   *
   * @return The time string, such as "0h1m5s".
   */
  private secondsToTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / (60 * 60));
    const minutes = Math.floor((totalSeconds - hours * 60 * 60) / 60);
    const seconds = Math.floor(totalSeconds - (hours * 60 * 60 + minutes * 60));
    return `${hours}h${minutes}m${seconds}s`;
  }

  /**
   * Create an IFrame object to hold video embeds
   *
   * @param src - The `src` attribute of the iframe; the embed URL of the video.
   *
   * @return The HTMLIFrameElement with appropriate embed attributes set.
   */
  private createIFrame(src: string): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    // Twitch, Vimeo, and YouTube embed codes contain this.
    iframe.setAttribute('allowfullscreen', '');

    // Twitch embed code contains this.
    iframe.setAttribute('scrolling', 'no');

    // Vimeo embed code contains this.
    iframe.setAttribute('webkitallowfullscreen', '');

    // Vimeo embed code contains this.
    iframe.setAttribute('mozallowfullscreen', '');

    // YouTube embed code contains this.
    iframe.setAttribute(
      'allow',
      'accelerometer; encrypted-media; gyroscope; picture-in-picture'
    );

    // Our custom styles.
    iframe.classList.add(style.videoContent);

    // Finally, throw that source address in there.
    iframe.src = src;

    return iframe;
  }
}

export default Video;

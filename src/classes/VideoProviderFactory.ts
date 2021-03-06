/**
 * @file Create the correct VideoProvider object based on the given URL.
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import VideoProvider from "./VideoProvider";

import Mixer from "./providers/Mixer";
import Twitch from "./providers/Twitch";
import Vimeo from "./providers/Vimeo";
import YouTube from "./providers/YouTube";

/**
 * An array of available providers
 */
const providers = [Mixer, Twitch, Vimeo, YouTube];

export default class VideoProviderFactory {
  /**
   * Create a new provider
   *
   * @param The source URL
   * @param The provider name
   *
   * @return A new VideoProvider object of the appropriate provider or undefined.
   */
  public static createProvider(
    source: string,
    providerName?: string
  ): VideoProvider | undefined {
    let Provider;

    const providerNameLowerCase =
      providerName && providerName.trim().toLowerCase();

    for (let i = 0; i < providers.length; i += 1) {
      const currentProvider = providers[i];
      if (
        (providerNameLowerCase &&
          providerNameLowerCase === currentProvider.getProviderString()) ||
        currentProvider.isProvider(source)
      ) {
        Provider = currentProvider;
        break;
      }
    }

    if (Provider) {
      return new Provider(source);
    }

    return undefined;
  }
}

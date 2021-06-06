/**
 * @file Create the correct VideoProvider object based on the given URL.
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import VideoProvider from "./VideoProvider";

import Twitch from "./providers/Twitch";
import Vimeo from "./providers/Vimeo";
import YouTube from "./providers/YouTube";

/**
 * An array of available providers
 */
const providers = [Twitch, Vimeo, YouTube];

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
    const providerNameLowerCase =
      providerName && providerName.trim().toLowerCase();

    const Provider = providers.find(
      (provider): boolean =>
        (providerNameLowerCase &&
          providerNameLowerCase === provider.getProviderString()) ||
        provider.isProvider(source)
    );

    if (Provider !== undefined) {
      return new Provider(source);
    }

    return undefined;
  }
}

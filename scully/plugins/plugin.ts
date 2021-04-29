
import { registerPlugin, getPluginConfig, configValidator } from '@scullyio/scully';

export const myPlugin = 'myPlugin';

const myFunctionPlugin = async (html: string): Promise<string> => {
  return html;
};

const validator = async () => [];

registerPlugin('render', myPlugin, myFunctionPlugin, validator);

// This is the void plugin that seeks to exclude routes
// https://github.com/scullyio/scully/commit/35a22c41cbe3f0e55e8b300f084e33c733381a3e
const voidPlugin = async (route, options) => {
  /**
   * I don't do anything here,
   * just return an empty array
   * as that will effectively remove the route from the list
   * */
  return [];
};

voidPlugin[configValidator] = async conf => [];
registerPlugin('router', 'void', voidPlugin);
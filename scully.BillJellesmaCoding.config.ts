import { ScullyConfig } from '@scullyio/scully';

//custom plugin to skip some routes
require('./scully/plugins/extraplugin/skip');

export const config: ScullyConfig = {
  projectRoot: "./src",
  projectName: "BillJellesmaCoding",
  outDir: './dist/BillJellesmaCoding',
  routes: {
    '/blog/20210413_merge_conflict': { type: 'skip'},
    '/blog/:slug': {
      type: 'contentFolder',
      slug: {
        folder: "./blog"
      }
    },
  }
};
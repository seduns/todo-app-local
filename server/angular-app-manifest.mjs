
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/todo-app-local/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 1455, hash: '810018a40ac9660394ab088278082edaf7301f2d5ab8f0682bfe699777387e71', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1024, hash: '6a066462d23c830ce571e556fb741cfe45333dec5e6322692976888c0d149903', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-PSIHPAQB.css': {size: 1562, hash: 'Jo6/zU8zB7E', text: () => import('./assets-chunks/styles-PSIHPAQB_css.mjs').then(m => m.default)}
  },
};

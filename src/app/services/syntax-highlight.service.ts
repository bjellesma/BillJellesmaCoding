import { Injectable, Inject } from '@angular/core';

import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import 'clipboard';
import 'prismjs';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/plugins/show-language/prism-show-language';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-latex';
// ... probably more, check out node_modules/prismjs/components

declare var Prism: any;

@Injectable({ providedIn: 'root' })
export class SyntaxHighlightService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  highlightAll() {
    if (isPlatformBrowser(this.platformId)) {
      Prism.highlightAll();
    }
  }
}
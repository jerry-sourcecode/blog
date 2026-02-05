import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

// 编辑和预览使用
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// 安装 katex
import katex from 'katex';
import 'katex/dist/katex.min.js';
import 'katex/dist/katex.min.css';
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/npm';

// 安装 highlightjs
import hljs from 'highlight.js/lib/core';
// 按需引入语言包
import json from 'highlight.js/lib/languages/json';
import cpp from 'highlight.js/lib/languages/cpp';
// 注册
hljs.registerLanguage('json', json);
hljs.registerLanguage('cpp', cpp);

// 安装赋值代码插件
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

// 使用主题和 KaTeX 插件[citation:3]
VMdEditor.use(githubTheme, {
    Hljs: hljs,
});
VMdPreview.use(githubTheme, {
    Hljs: hljs,
});
VMdEditor.use(createKatexPlugin(katex)); // 关键：传入 KaTeX 实例
VMdPreview.use(createKatexPlugin(katex));
VMdEditor.use(createCopyCodePlugin());
VMdPreview.use(createCopyCodePlugin());

import { createPinia } from 'pinia';

const pinia = createPinia();

const app = createApp(App);
app.use(VMdEditor);
app.use(VMdPreview);
app.use(pinia);
app.mount('#app');

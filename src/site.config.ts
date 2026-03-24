import type { CardListData, Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

export const theme: ThemeUserConfig = {
  // [Basic]
  // 基础
  /** Title for your website. Will be used in metadata and as browser tab title. */
  // 您网站的标题。将用于元数据和浏览器标签标题。
  title: "Jerry's Blog",
  /** Will be used in index page & copyright declaration */
  // 将用于首页和版权声明
  author: 'Jerry',
  /** Description metadata for your website. Can be used in page metadata. */
  // 您网站的描述元数据。可用于页面元数据。
  description: 'Stay hungry, stay foolish',
  /** The default favicon for your site which should be a path to an image in the `public/` directory. */
  // 您网站的默认favicon，应为`public/`目录中的图像路径。
  favicon: '/favicon/favicon.ico',
  /** The default social card image for your site which should be a path to an image in the `public/` directory. */
  // 您网站的默认社交卡片图像，应为`public/`目录中的图像路径。
  socialCard: '/images/social-card.png',
  /** Specify the default language for this site. */
  // 指定此站点的默认语言。
  locale: {
    lang: 'en-US',
    attrs: 'en_US',
    // Date locale
    // 日期区域设置
    dateLocale: 'zh-cn',
    dateOptions: {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }
  },
  /** Set a logo image to show in the homepage. */
  // 设置要在主页中显示的徽标图像。
  logo: {
    src: '/src/assets/avatar.png',
    alt: 'Avatar'
  },

  titleDelimiter: '•',
  prerender: true, // pagefind search is not supported with prerendering disabled
  // 禁用预渲染时不支持pagefind搜索。
  npmCDN: 'https://cdn.jsdelivr.net/npm',

  // Still in test
  // 仍在测试中
  head: [
    /* Telegram channel */
    // Telegram频道
    // {
    //   tag: 'meta',
    //   attrs: { name: 'telegram:channel', content: '@cworld0_cn' },
    //   content: ''
    // }
  ],
  customCss: [],

  /** Configure the header of your site. */
  // 配置您站点的页眉。
  header: {
    menu: [
      { title: '博客', link: '/blog' },
      { title: '文档', link: '/docs' }
      // { title: 'Projects', link: '/projects' },
      // { title: 'Links', link: '/links' },
      // { title: 'About', link: '/about' }
    ]
  },

  /** Configure the footer of your site. */
  // 配置您站点的页脚。
  footer: {
    // Year format
    // 年份格式
    year: `© ${new Date().getFullYear()}`,
    // year: `© 2019 - ${new Date().getFullYear()}`,
    // links: [
    //   // Registration link
    //   {
    //     title: 'Moe ICP 114514',
    //     link: 'https://icp.gov.moe/?keyword=114514',
    //     style: 'text-sm' // Uno/TW CSS class
    //   },
    //   // Privacy Policy link
    //   {
    //     title: 'Site Policy',
    //     link: '/terms',
    //     pos: 2 // position set to 2 will be appended to copyright line
    //   }
    // ],
    /** Enable displaying a “Astro & Pure theme powered” link in your site’s footer. */
    // 启用显示“Astro & Pure主题驱动”链接在您站点的页脚。
    credits: true,
    /** Optional details about the social media accounts for this site. */
    // 关于此站点社交媒体账号的可选详细信息。
    social: { github: 'https://github.com/jerry-sourcecode' }
  },

  // [Content]
  // 内容
  content: {
    /** External links configuration */
    // 外部链接配置
    externalLinks: {
      content: ' ↗',
      /** Properties for the external links element */
      // 外部链接元素的属性
      properties: {
        style: 'user-select:none'
      }
    },
    /** Blog page size for pagination (optional) */
    // 分页的博客页面大小（可选）
    blogPageSize: 8,
    // Currently support weibo, x, bluesky
    // 目前支持微博、X、Bluesky
    share: ['weibo', 'x', 'bluesky']
  }
}

export const integ: IntegrationUserConfig = {
  // [Links]
  // 链接
  // https://astro-pure.js.org/docs/integrations/links
  // 链接集成文档
  links: {
    // Friend logbook
    // 友链表
    logbook: [
      // { date: '2025-03-16', content: 'Is there a leakage?' },
    ],
    // Yourself link info
    // 您自己的链接信息
    applyTip: [
      { name: 'Name', val: theme.title },
      { name: 'Desc', val: theme.description || 'Null' }
    ],
    // Cache avatars in `public/avatars/` to improve user experience.
    // 缓存头像在`public/avatars/`中以改善用户体验。
    cacheAvatar: false
  },
  // [Search]
  // 搜索
  pagefind: true,
  // Add a random quote to the footer (default on homepage footer)
  // 添加随机引语到页脚（默认在主页页脚）
  // See: https://astro-pure.js.org/docs/integrations/advanced#web-content-render
  // 参见：https://astro-pure.js.org/docs/integrations/advanced#web-content-render
  // [Quote]
  // 引语
  quote: {
    // - Hitokoto
    // Hitokoto（一言）
    // https://developer.hitokoto.cn/sentence/#%E8%AF%B7%E6%B1%82%E5%9C%B0%E5%9D%80
    // Hitokoto API文档：https://developer.hitokoto.cn/sentence/#%E8%AF%B7%E6%B1%82%E5%9C%B0%E5%9D%80
    // server: 'https://v1.hitokoto.cn/?c=i',
    // target: `(data) => (data.hitokoto || 'Error')`
    // - Quotable
    // Quotable
    // https://github.com/lukePeavey/quotable
    // Quotable GitHub仓库：https://github.com/lukePeavey/quotable
    // server: 'http://api.quotable.io/quotes/random?maxLength=60',
    // target: `(data) => data[0].content || 'Error'`
    // - DummyJSON
    // DummyJSON
    server: 'https://dummyjson.com/quotes/random',
    target: `(data) => (data.quote.length > 80 ? \`\${data.quote.slice(0, 80)}...\` : data.quote || 'Error')`
  },
  // [Typography]
  // 排版
  // https://unocss.dev/presets/typography
  // UnoCSS排版预设文档：https://unocss.dev/presets/typography
  typography: {
    class: 'prose text-base',
    // The style of blockquote font `normal` / `italic` (default to italic in typography)
    // 块引用字体的样式`normal`/`italic`（排版中默认为斜体）
    blockquoteStyle: 'italic',
    // The style of inline code block `code` / `modern` (default to code in typography)
    // 内联代码块的样式`code`/`modern`（排版中默认为代码样式）
    inlineCodeBlockStyle: 'modern'
  },
  // [Lightbox]
  // 灯箱
  // A lightbox library that can add zoom effect
  // 一个可以添加缩放效果的灯箱库
  // https://astro-pure.js.org/docs/integrations/others#medium-zoom
  // Medium Zoom集成文档：https://astro-pure.js.org/docs/integrations/others#medium-zoom
  mediumZoom: {
    enable: true, // disable it will not load the whole library 禁用它则不会加载整个库
    selector: '.prose .zoomable',
    options: {
      className: 'zoomable'
    }
  },
  // Comment system
  // 评论系统
  waline: {
    enable: true,
    // Server service link
    // 服务器服务链接
    server: 'https://astro-theme-pure-waline.arthals.ink/',
    // Show meta info for comments
    // 显示评论的元信息
    showMeta: false,
    // Refer https://waline.js.org/en/guide/features/emoji.html
    // 参考：https://waline.js.org/en/guide/features/emoji.html
    emoji: ['bmoji', 'weibo'],
    // Refer https://waline.js.org/en/reference/client/props.html
    // 参考：https://waline.js.org/en/reference/client/props.html
    additionalConfigs: {
      // search: false,
      pageview: true,
      comment: true,
      locale: {
        reaction0: 'Like',
        placeholder: 'Welcome to comment. (Email to receive replies. Login is unnecessary)'
      },
      imageUploader: false
    }
  }
}

export const terms: CardListData = {
  title: 'Terms content',
  list: [
    {
      title: 'Privacy Policy',
      link: '/terms/privacy-policy'
    },
    {
      title: 'Terms and Conditions',
      link: '/terms/terms-and-conditions'
    },
    {
      title: 'Copyright',
      link: '/terms/copyright'
    },
    {
      title: 'Disclaimer',
      link: '/terms/disclaimer'
    }
  ]
}

const config = { ...theme, integ } as Config
export default config

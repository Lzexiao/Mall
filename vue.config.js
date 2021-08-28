module.exports = {
  //是否开启eslint
  lintOnSave: false,

  configureWebpack: {
    resolve: {
      alias: {
        components: "@/components",
        content: "components/content",
        common: "components/common",
        assets: "@/assets",
        network: "@/network",
        views: "@/views",
      },
    },
  },
  pluginOptions: {
    svgSprite: {

        dir: 'src/assets/Icon',
        test: /\.(svg)(\?.*)?$/,
        loaderOptions: {
            extract: true,
            spriteFilename: 'img/icons.[hash:8].svg' // or 'img/icons.svg' if filenameHashing == false
        },
        pluginOptions: {
            plainSprite: true
        }    
    }    
},    


  chainWebpack: (config) => {
    config.module.rule("svg-sprite").use("svgo-loader").loader("svgo-loader");
  },
};

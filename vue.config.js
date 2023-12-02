module.exports = {
    publicPath: "/gestion-de-eventos-frontend/",
    pwa: {
        name: 'Gestion Eventos',
        themeColor: '#4DBA87',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
    
        // configure the workbox plugin
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
          // swSrc is required in InjectManifest mode.
          swSrc: 'dev/sw.js',
          // ...other Workbox options...
        }
    }
}
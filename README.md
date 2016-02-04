# webpack-angular-gettext

Webpack plugin & loader that extract translatable strings from your source files for [angular-gettext].

Based on [webpack-angular-translate] and [angular-gettext-extract-loader].

## Getting started

Install the plugin using npm:

```bash
npm install --save-dev webpack-angular-gettext
```

Configure the loader and the plugin in the webpack configuration.

```javascript
var WebpackAngularGettext = require('webpack-angular-gettext');

module.exports = {
  // ...
  module: {
    preLoaders: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: WebpackAngularGettext.loader()
      },
      {
        test: /\.js$/,
        loader: WebpackAngularGettext.loader()
      }
    ]
  }

  plugins: [
    new WebpackAngularGettext.Plugin()
  ]
};
```

The `Plugin()` accepts the following options in the constructor:

* fileName: The name of the file that contains all the translations, default `translations.pot`


[angular-gettext]: https://github.com/rubenv/angular-gettext
[webpack-angular-translate]: https://github.com/DatenMetzgerX/webpack-angular-translate
[angular-gettext-extract-loader]: https://github.com/wombleton/angular-gettext-extract-loader

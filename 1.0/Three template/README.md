# Installation

VOODOO THREEJS TEMPLATE

```
npm i
```

## Usage

### Development server

```bash
npm start
```

You can view the development server at `localhost:8080`.

### Production build

```bash
npm run build
```


Generates a productionBuild folder wich contains theses files: 

- main.min.js (final js file to upload on IC)
- custom.html (custom html file with your UI elements)
- config.json (config file for IC)
- gameIcon.png/jpg (icon for the game)


All the assets (images, gltf/glb models) are base64 encoded
main.min.js is compressed and minified ready for deploy




# Structure
## Assets
Assets files have to be in the folder src/assets
> Import texture file ing png/jpg format and include it in the js/assetsImport/textures.js file 
> add it in the TEXTURES variable

```
import CustomTextureName from "../../assets/images/texture.png";

export const TEXTURES =  {
    myTexture: {
        file: CustomTextureName
    },
}
```

> Follow same steps for importing a model !

## Components
- LoadingComponent (handles assets loading with promises)
- ManagerComponent (main setup(resize, mouseevents...), dispatching vsdkfunctions in scene/Scene.js file)

## Modules
A module can be a light, a model, cube, plane, etc...
Each module file have to use theses functions : 
  1. 3D Imported Model
  ____________________
  - build()
  - addToScene()
  - update()
  ____________________
  2. Geometry or light...
  - addToScene()
  - update()

In the constructor, specify the VSDKParameters as 
```
this.params = sdkParameters;
```

## Scene
Where the three logic is created (renderer, camera, sceneEntities...)

Import your modules in Scene.js file and create them in the sceneEntities Object

Pass as paramaters your vsdk paramaters (specify wich parameter object in the config.json file they use)
```
this.sceneEntities = {
      lights: new Lights(this.vsdkParameters.LightSettings),
      building: new Model(this.vsdkParameters.ModelExample, this.vsdkParameters.ModelExample.name),
  };
```
## Features

- [Webpack](https://webpack.js.org/)
- [Babel](https://babeljs.io/)
- [Sass](https://sass-lang.com/)
- [PostCSS](https://postcss.org/)
- [ESLint](https://eslint.org/)

## Dependencies

### Webpack

- [`webpack`](https://github.com/webpack/webpack) - Module and asset bundler.
- [`webpack-cli`](https://github.com/webpack/webpack-cli) - Command line interface for Webpack.
- [`webpack-dev-server`](https://github.com/webpack/webpack-dev-server) - Development server for Webpack.
- [`webpack-merge`](https://github.com/survivejs/webpack-merge) - Simplify development/production configuration
- [`cross-env`](https://github.com/kentcdodds/cross-env) - Cross platform configuration.

### Babel

- [`@babel/core`](https://www.npmjs.com/package/@babel/core) - Transpile ES6+ to backwards compatible JavaScript.
- [`@babel/plugin-proposal-class-properties`](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties) - Use properties directly on a class.
- [`@babel/preset-env`](https://babeljs.io/docs/en/babel-preset-env) - Smart defaults for Babel.
- [`babel-eslint`](https://github.com/babel/babel-eslint) - Lint Babel code.
  - [`eslint`](https://github.com/eslint/eslint) - ESLint.

### Loaders

- [`babel-loader`](https://webpack.js.org/loaders/babel-loader/) - Transpile files with Babel and Webpack.
- [`sass-loader`](https://webpack.js.org/loaders/sass-loader/) - Load SCSS and compile to CSS.
  - [`node-sass`](https://github.com/sass/node-sass) - Node Sass.
- [`postcss-loader`](https://webpack.js.org/loaders/postcss-loader/) - Process CSS with PostCSS.
  - [`cssnano`](https://github.com/cssnano/cssnano) - Optimize and compress PostCSS.
  - [`postcss-preset-env`](https://www.npmjs.com/package/postcss-preset-env) - Sensible defaults for PostCSS.
- [`css-loader`](https://webpack.js.org/loaders/css-loader/) - Resolves CSS imports into JS.
- [`style-loader`](https://webpack.js.org/loaders/style-loader/) - Inject CSS into the DOM.
- [`eslint-loader`](https://webpack.js.org/loaders/eslint-loader/) - Use ESLint with Webpack.
- [`file-loader`](https://webpack.js.org/loaders/file-loader/) - Copy files to build folder.
- [`url-loader`](https://webpack.js.org/loaders/url-loader/) - Encode and inline files. Falls back to file-loader.

### Plugins

- [`clean-webpack-plugin`](https://github.com/johnagan/clean-webpack-plugin) - Remove/clean build folders.
- [`copy-webpack-plugin`](https://github.com/webpack-contrib/copy-webpack-plugin) - Copy files to build directory.
- [`html-webpack-plugin`](https://github.com/jantimon/html-webpack-plugin) - Generate HTML files from template.
- [`mini-css-extract-plugin`](https://github.com/webpack-contrib/mini-css-extract-plugin) - Extract CSS into separate files.
- [`optimize-css-assets-webpack-plugin`](https://github.com/NMFR/optimize-css-assets-webpack-plugin) - Optimize and minimize CSS assets.
- [`terser-webpack-plugin`](https://github.com/webpack-contrib/terser-webpack-plugin) - Minify JavaScript.

## Author

- [Voodoo](https://www.voodoo.com)

## License

This project is open source and available under the [MIT License](LICENSE).

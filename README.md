# RV Block Editor

A modern and flexible editor for all occasions

## Project Structure

The project's code base is in the `src` folder

```
.
├── .github     # contains github workflow and related configs
├── .husky      # contains husky precommit configs
├── scripts
│   └── afterBuild.js # script for transforming ignored `scss` imports since `tsc` compiler ignores them
│
├── src         # project's source of truth!
│   ├── BlockEditor
│   │   └── ...
│   ├── Plugins
│   │   └── ...
│   ├── Demo
│   │   └── ...
│   ├── declarations.d.ts
│   └── index.ts    # main entry point for `tsc` to generate the `dist` folder structure
├── .babelrc
├── .gitignore
├── .huskyrc
├── .npmrc
├── .prettierignore
├── .prettierrc
├── package.json
├── tsconfig.json
└── yarn.lock

```

### Lint and code quality checks and enforcements :construction:

coming soon!

### IDE auto completion with typescript :construction:

Project property types and definitions are in a active review and construction.

## Installation

To install `RV-Block-Editor`, you'll need the proper **authentication/authorization** for the command below ([more info](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)):

```bash
npm login --scope=@sirraminyavari --registry=https://npm.pkg.github.com
```

## BlockEditor Usage

```tsx
import {BlockEditor,...} from '@sirraminyavari/rv-block-editor'; // default export is undefined

// BlockEditor customizations as needed

function App() {
  return <>
  {/* component's starting elements */}
  <BlockEditor />
  {/*  component's ending elements */}
  </>;
}
```

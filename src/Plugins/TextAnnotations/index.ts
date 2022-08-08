import { EditorPlugin } from '../../BlockEditor'

import getColorSelectComponent from './ColorSelect'
import { TextColorIcon, HighlightColorIcon } from './icons'

export interface ColorConfig {
  name: string
  color: string
}

export interface Config {
  textColors: ColorConfig[]
  highlightColors: ColorConfig[]
}

export default function createTextAnnotationsPlugin(
  config: Config
): EditorPlugin {
  const { textColors, highlightColors } = config
  return {
    id: 'text-annotations',

    inlineStyles: [
      {
        Component: getColorSelectComponent({
          entityName: 'TEXT-COLOR',
          Icon: TextColorIcon,
          colors: textColors,
        }),
      },
      {
        Component: getColorSelectComponent({
          entityName: 'HIGHLIGHT-COLOR',
          Icon: HighlightColorIcon,
          colors: highlightColors,
        }),
      },
    ],

    customStyleMap: {
      ...getStyleMap(textColors, 'TEXT-COLOR', 'color'),
      ...getStyleMap(highlightColors, 'HIGHLIGHT-COLOR', 'backgroundColor'),
    },
  }
}

function getStyleMap(colors: ColorConfig[], prefix: string, rule: string) {
  return colors
    .map((colorConfig) => ({
      [`${prefix}-${colorConfig.name}`]: {
        [rule]: colorConfig.color,
      },
    }))
    .reduce((acc, val) => ({ ...acc, ...val }), {})
}

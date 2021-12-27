import { CompositeDecorator } from 'draft-js'

import { EditorPlugin } from 'BlockEditor'
import makeEntityStrategy from 'BlockEditor/Utils/makeEntityStrategy'

import getColorSelectComponent from './ColorSelect'
import getDecoratorComponent from './DecoratorComponent'
import { TextColorIcon, HighlightColorIcon } from './icons'


const textColors = {
    red: { color: 'red' },
    green: { color: 'green' },
    blue: { color: 'blue' }
}

const highlightColors = {
    red: { backgroundColor: 'red', color: 'white' },
    green: { backgroundColor: 'green', color: 'white' },
    blue: { backgroundColor: 'blue', color: 'white' }
}

export default function createTextAnnotationsPlugin (): EditorPlugin {
    return {
        id: 'text-annotations',

        inlineStyles: [
            { Component: getColorSelectComponent ({
                entityName: 'TEXT-COLOR',
                Icon: TextColorIcon,
                colors: Object.keys ( textColors )
            }) },
            { Component: getColorSelectComponent ({
                entityName: 'HIGHLIHGT-COLOR',
                Icon: HighlightColorIcon,
                colors: Object.keys ( highlightColors )
            }) }
        ],

        decorators: [
            new CompositeDecorator ([
                {
                    strategy: makeEntityStrategy ( 'TEXT-COLOR' ),
                    component: getDecoratorComponent ({
                        getStyles: color => textColors [ color ]
                    })
                },
                {
                    strategy: makeEntityStrategy ( 'HIGHLIHGT-COLOR' ),
                    component: getDecoratorComponent ({
                        getStyles: color => highlightColors [ color ]
                    })
                }
            ])
        ]
    }
}

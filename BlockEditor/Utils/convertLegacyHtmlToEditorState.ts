import { EditorState, ContentState, ContentBlock, SelectionState, Modifier } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import Color from 'color'


interface ColorConfig { name: string, color: string }

interface Config {
    colors: {
        textColors: ColorConfig []
        highlightColors: ColorConfig []
    }
}

export function convertLegacyHtmlToEditorState ( html: string, config: Config ): EditorState {
    const modifiedHtml = modifyHtml ( html, config )
    const { contentBlocks, entityMap } = htmlToDraft ( modifiedHtml )
    const contentState = ContentState.createFromBlockArray ( contentBlocks, entityMap )
    const modifiedContentState = modifyContent ( contentState, config )
    const editorState = EditorState.createWithContent ( modifiedContentState )
    return editorState
}


function modifyHtml ( html: string, config: Config ): string {
    const elem = document.createElement ( 'div' )
    elem.innerHTML = html
    removeBreaksAndExtraSpaces ( elem )
    wrapTopLevelTextNodes ( elem )
    handleBlockquotes ( elem )
    replaceTags ( elem, { u: 'ins', s: 'del' } )
    return elem.innerHTML
}

function removeBreaksAndExtraSpaces ( elem: Element ) {
    elem.querySelectorAll ( 'br:not( code br )' ).forEach ( n => n.remove () )
    elem.innerHTML = elem.innerHTML.replaceAll ( /\s\s+/g, ' ' )
}

function wrapTopLevelTextNodes ( elem: Element ) {
    ; [ ...elem.childNodes ]
        .filter ( node => node.nodeType === 3 && node.textContent.trim().length > 1 )
        .forEach(node => {
            const span = document.createElement('p');
            node.after(span);
            span.appendChild(node);
        })
}

function handleBlockquotes ( elem: Element ) {
    ; [ ...elem.querySelectorAll ( 'blockquote' ) ].forEach ( bq => {
        bq.innerHTML = bq.textContent.trim ()
    } )
}

function renameElement ( elem: Element, name: string ) {
    const newElem = document.createElement ( name )
    ; [ ...elem.attributes ].forEach ( attr => newElem.setAttribute ( attr.name, attr.value ) )
    newElem.innerHTML = elem.innerHTML
    elem.after ( newElem )
    elem.remove ()
}
function replaceTags ( elem: Element, replaceTagsMap: object ) {
    ; [ ...elem.querySelectorAll ( Object.keys ( replaceTagsMap ).join () ) ]
        .forEach ( elem => renameElement ( elem, replaceTagsMap [ elem.localName ] ) )
}


function modifyContent ( contentState: ContentState, config: Config ): ContentState {
    let tempState = contentState
    tempState = convertColorStyles ( tempState, 'color', 'TEXT-COLOR', config.colors.textColors )
    tempState = convertColorStyles ( tempState, 'bgcolor', 'HIGHLIGHT-COLOR', config.colors.highlightColors )
    tempState = handleCodeBlocks ( tempState )
    tempState = handleAlignment ( tempState )
    tempState = handleMentionsAndLinks ( tempState )
    return tempState
}

const dist = ( p1, p2 ) => Math.sqrt ( p1.map ( ( v, i ) => ( v - p2 [ i ] ) ** 2 ).reduce ( ( acc, val ) => acc + val ) )
function findClosesColor ( colorArr, colors ) {
    const info = colors.reduce ( ( info, color ) => {
        const d = dist ( colorArr, color.color )
        return d < info.min ? { closest: color, min: d } : info
    }, { closest: null, min: Infinity } )
    return info.closest
}

function convertColorStyles ( contentState: ContentState, originalStlyePrefix: string, targetStylePrefix: string, targetColors: any [] ): ContentState {
    const computedColors = targetColors.map ( color => ({ ...color, color: ( new Color ( color.color ).array () ) }) )
    const blocks = contentState.getBlockMap ()
    const newContentState = blocks.reduce ( ( contentState, block, blockKey ) => {
        let newContentState = contentState
        block.findStyleRanges (
            char => char.getStyle ().valueSeq ().some ( style => style.startsWith ( originalStlyePrefix + '-' ) ),
            ( start, end ) => {
                const colorStyle = block.getInlineStyleAt ( start ).filter ( s => s.startsWith ( originalStlyePrefix + '-' ) ).toArray () [ 0 ]
                const color = new Color ( colorStyle.split ( '-' ) [ 1 ] )
                const closestColor = findClosesColor ( color.array (), computedColors )
                const selectionState = new SelectionState ({
                    anchorKey: blockKey, focusKey: blockKey,
                    anchorOffset: start, focusOffset: end
                })
                newContentState = Modifier.removeInlineStyle ( newContentState, selectionState, colorStyle )
                newContentState = Modifier.applyInlineStyle ( newContentState, selectionState, `${ targetStylePrefix }-${ closestColor.name }` )
            }
        )
        return newContentState
    }, contentState )
    return newContentState
}

function handleCodeBlocks ( contentState: ContentState ): ContentState {
    const blocks = contentState.getBlockMap ()
    const typeCorrectedBlocks = blocks.map ( block => {
        if ( block.getType () !== 'code' ) return block
        return block.set ( 'type', 'code-block' ) as ContentBlock
    } )
    const typeCorrectedContentState = ContentState.createFromBlockArray ( typeCorrectedBlocks.toArray (), contentState.getEntityMap () )
    const inlineStyleCorrectedContentState = typeCorrectedContentState.getBlockMap ().reduce ( ( contentState, block, blockKey ) => {
        let newContentState = contentState
        block.findEntityRanges (
            char => char.getStyle ().valueSeq ().some ( style => style === 'CODE' ),
            ( start, end ) => {
                const selectionState = new SelectionState ({
                    anchorKey: blockKey, focusKey: blockKey,
                    anchorOffset: start, focusOffset: end
                })
                newContentState = Modifier.removeInlineStyle ( newContentState, selectionState, 'CODE' )
            }
        )
        return newContentState
    }, typeCorrectedContentState )
    return inlineStyleCorrectedContentState
}

function handleAlignment ( contentState: ContentState ): ContentState {
    const blocks = contentState.getBlockMap ()
    const newBlocks = blocks.map ( block => {
        const align = block.getData ().get ( 'text-align' )
        if ( ! align ) return block
        const noAlignBlock = block.set ( 'data', block.getData ().remove ( 'text-align' ) ) as ContentBlock
        const standardAlignBlock = block.set ( 'data', noAlignBlock.getData ().set ( '_align', align ) ) as ContentBlock
        return standardAlignBlock
    } )
    const newContentState = ContentState.createFromBlockArray ( newBlocks.toArray (), contentState.getBlockMap () )
    return newContentState
}

const decodeUnicode = str => decodeURIComponent ( atob ( str ).split ( '' ).map ( c => '%' + ( '00' + c.charCodeAt ( 0 ).toString ( 16 ) ).slice ( -2 ) ).join ( '' ) ) // https://attacomsian.com/blog/javascript-base64-encode-decode
const MENTION_LINK_REGEXP = /(@)\[\[([a-zA-Z\d\-_]+):([\w\s\.\-]+):([0-9a-zA-Z\+\/\=]+)(:([0-9a-zA-Z\+\/\=]*))?\]\]/
function handleMentionsAndLinks ( contentState: ContentState ): ContentState {
    let tempState = contentState
    contentState.getBlockMap ().keySeq ().forEach ( blockKey => {
        while ( true ) {
            const match = MENTION_LINK_REGEXP.exec ( tempState.getBlockForKey ( blockKey ).getText () )
            if ( ! match ) break
            const [ subStr, , ...parts ] = match
            const { index: offset } = match
            const label = decodeUnicode ( parts [ 2 ] ).trim ()
            tempState = parts [ 0 ] === 'Link'
                ? tempState.createEntity (
                    'LINK', 'IMMUTABLE',
                    { href: decodeUnicode ( JSON.parse ( decodeUnicode ( parts [ 4 ] ) ).href ) }
                )
                : tempState.createEntity (
                    'mention', 'SEGMENTED',
                    { mention: { id: parts [ 0 ], type: parts [ 1 ], name: label } }
                )
            const entityKey = tempState.getLastCreatedEntityKey ()
            tempState = Modifier.replaceText (
                tempState,
                new SelectionState ({
                    anchorKey: blockKey, focusKey: blockKey,
                    anchorOffset: offset, focusOffset: offset + subStr.length
                }),
                ( parts [ 0 ] !== 'Link' ? '@' : '' ) + label,
                null, entityKey
            )
        }
    } )
    return tempState
}

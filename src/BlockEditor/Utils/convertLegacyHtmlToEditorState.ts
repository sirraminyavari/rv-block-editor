import {
  ContentState,
  ContentBlock,
  SelectionState,
  Modifier,
  convertToRaw,
  RawDraftContentState,
} from 'draft-js';
import htmlToDraft from 'html-to-draftjs';

interface ColorConfig {
  name: string;
  color: string;
}
type GetMentionLink = (mention: {
  type: string;
  id: string;
}) => string | Promise<string>;
interface Config {
  colors: {
    textColors: ColorConfig[];
    highlightColors: ColorConfig[];
  };
  getMentionLink?: GetMentionLink;
}

/**
 * Converts legacy HTML content to a format readalbe by the current block-editor.
 *
 * @returns The equivalent RawDraftContentState of the provided HTML string.
 *
 * * Caveat: It is not possible to return an EditorState instance because the class
 * * reference from which the object instanciates differs in the block-editor library
 * * from the class reference in the target project. Doing so will result in an error
 * * throwed by DraftJS.
 */
export function convertLegacyHtmlToEditorState(
  html: string,
  config: Config
): RawDraftContentState {
  const modifiedHtml = modifyHtml(html, config);
  const { contentBlocks, entityMap } = htmlToDraft(modifiedHtml);
  const contentState = ContentState.createFromBlockArray(
    contentBlocks,
    entityMap
  );
  const modifiedContentState = modifyContent(contentState, config);
  return convertToRaw(modifiedContentState);
}

/**
 * Performes some necessary modification on the initial HTML input
 * to make it work better and more predictable with 'html-to-draftjs'.
 */
function modifyHtml(html: string, config: Config): string {
  const elem = document.createElement('div');
  elem.innerHTML = html;
  removeBreaksAndExtraSpaces(elem);
  wrapTopLevelTextNodes(elem);
  handleBlockquotes(elem);
  replaceTags(elem, { u: 'ins', s: 'del' });
  return elem.innerHTML;
}

/**
 * Removes all BR element as well as subsequent empty spaces which are
 * normally ignored by the browser in contrast to 'html-to-draftjs' which
 * attempts to apply them.
 *
 * * Info: BR element are used in a very inconsistent way in the legacy HTML
 * * so to ensure consistency we need to remove them all!
 */
function removeBreaksAndExtraSpaces(elem: Element) {
  elem.querySelectorAll('br:not( code br )').forEach((n) => n.remove());
  elem.innerHTML = elem.innerHTML.replaceAll(/\s\s+/g, ' ');
}

/**
 * Wrapps all top-level orphan text nodes inside a paragraph element.
 */
function wrapTopLevelTextNodes(elem: Element) {
  [...elem.childNodes]
    .filter((node) => node.nodeType === 3 && node.textContent.trim().length > 1)
    .forEach((node) => {
      const wrapper = document.createElement('p');
      node.after(wrapper);
      wrapper.appendChild(node);
    });
}

/**
 * This method removes all the child elemnts in blockquote
 * elements, keeping the trimmed 'textContent' only.
 *
 * * Info: All blockquote contents in the legacy HTML are wrapped inside an
 * * unnecessary element which makes 'html-to-draftjs' think that its
 * * and entierly new block resulting in an empty blockquote and a block
 * * of unstyled text below it.
 */
function handleBlockquotes(elem: Element) {
  [...elem.querySelectorAll('blockquote')].forEach((bq) => {
    bq.innerHTML = bq.textContent.trim();
  });
}

/**
 * Renames a given set of tag-names while keeping all the attributes and innerHTML intact.
 *
 * * Info: There are a number of unsupported elements in 'html-to-draftjs' (like
 * * '<u>' for underlining text) which will only work with their alias names
 * * (like <ins>). So we need to rename all those elements before feeding the HTML
 * * string into 'html-to-draftjs'.
 */
function replaceTags(elem: Element, replaceTagsMap: object) {
  [...elem.querySelectorAll(Object.keys(replaceTagsMap).join())].forEach(
    (elem) => {
      const newElem = document.createElement(replaceTagsMap[elem.localName]);
      [...elem.attributes].forEach((attr) =>
        newElem.setAttribute(attr.name, attr.value)
      );
      newElem.innerHTML = elem.innerHTML;
      elem.after(newElem);
      elem.remove();
    }
  );
}

/**
 * Applies some necessary changes to the ContentState returned by 'html-to-draftjs'
 * to make it completely compatible with the current block-editor.
 */
function modifyContent(
  contentState: ContentState,
  config: Config
): ContentState {
  let tempState = contentState;
  tempState = convertColorStyles(
    tempState,
    'color',
    'TEXT-COLOR',
    config.colors.textColors
  );
  tempState = convertColorStyles(
    tempState,
    'bgcolor',
    'HIGHLIGHT-COLOR',
    config.colors.highlightColors
  );
  tempState = handleCodeBlocks(tempState);
  tempState = handleAlignment(tempState);
  tempState = handleMentionsAndLinks(tempState, config.getMentionLink);
  return tempState;
}

/**
 * Calculates the distance between two 3D points (i.e. RGB colors).
 */
const dist = (p1, p2) =>
  Math.sqrt(p1.map((v, i) => (v - p2[i]) ** 2).reduce((acc, val) => acc + val));
/**
 * Finds the closest color to an specified color from an array of predefined colors.
 */
function findClosesColor(colorArr, colors) {
  const info = colors.reduce(
    (info, color) => {
      const d = dist(colorArr, color.color);
      return d < info.min ? { closest: color, min: d } : info;
    },
    { closest: null, min: Infinity }
  );
  return info.closest;
}
/**
 * Parses color strings and return an RGB array.
 * Supports RGB and HEX formats.
 */
function toRgbArr(rgbStr) {
  return rgbStr[0] === '#'
    ? [
        parseInt(rgbStr.slice(1, 3), 16),
        parseInt(rgbStr.slice(3, 5), 16),
        parseInt(rgbStr.slice(5, 7), 16),
      ]
    : rgbStr
        .slice(4, rgbStr.length - 1)
        .split(',')
        .map((c) => parseInt(c, 10));
}
/**
 * Transforms a given ContentState in a way that color entites are compatible
 * with our current block-editor.
 */
function convertColorStyles(
  contentState: ContentState,
  originalStlyePrefix: string,
  targetStylePrefix: string,
  targetColors: any[]
): ContentState {
  if (!targetColors.length) return contentState;
  const computedColors = targetColors.map((color) => ({
    ...color,
    color: toRgbArr(color.color),
  }));
  const blocks = contentState.getBlockMap();
  const newContentState = blocks.reduce((contentState, block, blockKey) => {
    let newContentState = contentState;
    block.findStyleRanges(
      (char) =>
        char
          .getStyle()
          .valueSeq()
          .some((style) => style.startsWith(originalStlyePrefix + '-')),
      (start, end) => {
        const colorStyle = block
          .getInlineStyleAt(start)
          .filter((s) => s.startsWith(originalStlyePrefix + '-'))
          .toArray()[0];
        const color = toRgbArr(colorStyle.split('-')[1]);
        const closestColor = findClosesColor(color, computedColors);
        const selectionState = new SelectionState({
          anchorKey: blockKey,
          focusKey: blockKey,
          anchorOffset: start,
          focusOffset: end,
        });
        newContentState = Modifier.removeInlineStyle(
          newContentState,
          selectionState,
          colorStyle
        );
        newContentState = Modifier.applyInlineStyle(
          newContentState,
          selectionState,
          `${targetStylePrefix}-${closestColor.name}`
        );
      }
    );
    return newContentState;
  }, contentState);
  return newContentState;
}

/**
 * Transforms a given ContentState in a way that code blocks are compatible
 * with our current block-editor.
 */
function handleCodeBlocks(contentState: ContentState): ContentState {
  const blocks = contentState.getBlockMap();
  const typeCorrectedBlocks = blocks.map((block) => {
    if (block.getType() !== 'code') return block;
    return block.set('type', 'code-block') as ContentBlock;
  });
  const typeCorrectedContentState = ContentState.createFromBlockArray(
    typeCorrectedBlocks.toArray(),
    contentState.getEntityMap()
  );
  const inlineStyleCorrectedContentState = typeCorrectedContentState
    .getBlockMap()
    .reduce((contentState, block, blockKey) => {
      let newContentState = contentState;
      block.findEntityRanges(
        (char) =>
          char
            .getStyle()
            .valueSeq()
            .some((style) => style === 'CODE'),
        (start, end) => {
          const selectionState = new SelectionState({
            anchorKey: blockKey,
            focusKey: blockKey,
            anchorOffset: start,
            focusOffset: end,
          });
          newContentState = Modifier.removeInlineStyle(
            newContentState,
            selectionState,
            'CODE'
          );
        }
      );
      return newContentState;
    }, typeCorrectedContentState);
  return inlineStyleCorrectedContentState;
}

/**
 * Transforms a given ContentState in a way that alignment values are compatible
 * with our current block-editor.
 */
function handleAlignment(contentState: ContentState): ContentState {
  const blocks = contentState.getBlockMap();
  const newBlocks = blocks.map((block) => {
    const align = block.getData().get('text-align');
    if (!align) return block;
    const noAlignBlock = block.set(
      'data',
      block.getData().remove('text-align')
    ) as ContentBlock;
    const standardAlignBlock = block.set(
      'data',
      noAlignBlock.getData().set('_align', align)
    ) as ContentBlock;
    return standardAlignBlock;
  });
  const newContentState = ContentState.createFromBlockArray(
    newBlocks.toArray(),
    contentState.getBlockMap()
  );
  return newContentState;
}

/**
 * Decode a Base64 string with support for unicode characters.
 */
const decodeUnicode = (str) =>
  decodeURIComponent(
    atob(str)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  ); // https://attacomsian.com/blog/javascript-base64-encode-decode
// Regex to find all mentions and links
const MENTION_LINK_REGEXP =
  /(@)\[\[([a-zA-Z\d\-_]+):([\w\s\.\-]+):([0-9a-zA-Z\+\/\=]+)(:([0-9a-zA-Z\+\/\=]*))?\]\]/;
/**
 * Finds all legacy mention and link annotations and transform them to their
 * corresponding entities compatible with our current block-editor.
 */
function handleMentionsAndLinks(
  contentState: ContentState,
  getMentionLink: GetMentionLink
): ContentState {
  let tempState = contentState;
  contentState
    .getBlockMap()
    .keySeq()
    .forEach((blockKey) => {
      while (true) {
        const match = MENTION_LINK_REGEXP.exec(
          tempState.getBlockForKey(blockKey).getText()
        );
        if (!match) break;
        const [subStr, , ...parts] = match;
        const { index: offset } = match;
        const label = decodeUnicode(parts[2]).trim();
        tempState =
          parts[0] === 'Link'
            ? tempState.createEntity('LINK', 'IMMUTABLE', {
                href: decodeUnicode(JSON.parse(decodeUnicode(parts[4])).href),
              })
            : (() => {
                const m = { id: parts[0], type: parts[1] };
                return tempState.createEntity('mention', 'SEGMENTED', {
                  mention: {
                    ...m,
                    name: label,
                    ...(getMentionLink ? { href: getMentionLink(m) } : {}),
                  },
                });
              })();
        const entityKey = tempState.getLastCreatedEntityKey();
        tempState = Modifier.replaceText(
          tempState,
          new SelectionState({
            anchorKey: blockKey,
            focusKey: blockKey,
            anchorOffset: offset,
            focusOffset: offset + subStr.length,
          }),
          (parts[0] !== 'Link' ? '@' : '') + label,
          null,
          entityKey
        );
      }
    });
  return tempState;
}

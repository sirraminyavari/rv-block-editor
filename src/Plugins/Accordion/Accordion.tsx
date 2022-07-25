import { EditorBlock } from 'draft-js';
import cn from 'classnames';

import { AccordionIcon } from './icons';
import * as styles from './styles.module.scss';

export default function Accordion({ ...props }) {
  const { collapsed, toggleCollapsed } = props.blockProps;
  return (
    <div className={cn(styles.accordion, { [styles.collapsed]: collapsed })}>
      <div
        className={styles.chevronWrapper}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggleCollapsed()}
        contentEditable={false}>
        <AccordionIcon />
      </div>
      <EditorBlock {...props} />
    </div>
  );
}

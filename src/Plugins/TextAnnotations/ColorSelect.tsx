import { FC, useMemo } from 'react';
import { RichUtils } from 'draft-js';
import { IconType } from 'react-icons';

import { InlineStyleComponentProps } from '../../BlockEditor';
import Overlay from '../../BlockEditor/Ui/Overlay';
import Button from '../../BlockEditor/Ui/Button';

import { ColorConfig } from '.';

import * as styles from './styles.module.scss';
import NoColorSelectButton from './noColorSelectButton';

export interface HocProps {
  entityName: string;
  Icon: IconType;
  colors: ColorConfig[];
}

export default function getColorSelectComponent(hocProps: HocProps) {
  return (props) => <ColorSelect {...hocProps} {...props} />;
}

export interface ColorSelectProps extends InlineStyleComponentProps, HocProps {}

export const ColorSelect: FC<ColorSelectProps> = ({
  entityName,
  Icon,
  colors,
  editorState,
  setEditorState,
}) => {
  const styleEntities = useMemo(
    () => Object.values(colors).map(({ name }) => `${entityName}-${name}`),
    [entityName, colors]
  );
  return (
    <div className={styles.colorSelectWrapper}>
      <Button Icon={Icon} />
      <div className={styles.menu}>
        <Overlay className={styles.buttons}>
          {colors.map((color) => (
            <Button
              key={color.name}
              style={{ backgroundColor: color.color }}
              className={styles.button}
              onClick={() => {
                const newEditorState = RichUtils.toggleInlineStyle(
                  editorState,
                  `${entityName}-${color.name}`
                );
                setEditorState(newEditorState);
              }}
            />
          ))}
          <NoColorSelectButton
            styleEntities={styleEntities}
            editorState={editorState}
            setEditorState={setEditorState}
          />
        </Overlay>
      </div>
    </div>
  );
};

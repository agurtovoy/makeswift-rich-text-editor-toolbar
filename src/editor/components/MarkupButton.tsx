import React, { FC, MouseEvent } from "react";
import { ReactEditor, useSlate } from "slate-react";
import { Editor, Transforms, Text } from "slate";

import ToolbarButton, { ToolbarButtonProps } from "./ToolbarButton";

export interface MarkupButtonProps extends ToolbarButtonProps {
  format: string;
}


const isMarkupActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => n[format] === true,
    mode: 'all',
  });
  return !!match;
};

const toggleSelectedMarkup = (editor: Editor, format: string) => {
  const isActive = isMarkupActive(editor, format)
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true }
  )
}


const MarkupButton: FC<MarkupButtonProps> = ({ format, ...props }) => {
  const editor = useSlate();
  const toggleMarkup = (event: MouseEvent) => {
    toggleSelectedMarkup(editor, format);
    ReactEditor.focus(editor);
  };

  const isActive = isMarkupActive(editor, format);
  return (
    <ToolbarButton active={isActive} onClick={toggleMarkup} {...props} />
  )
}

export default MarkupButton;

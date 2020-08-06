import React, { FC } from "react";
import { useSlate } from "slate-react";
import { Editor, Transforms, Range, RangeRef } from "slate";
import { ReactEditor } from "slate-react";
import isUrl from 'is-url';

import ToolbarButton from "./ToolbarButton";

export const withLinks = (editor: ReactEditor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = element => element.type === 'link' || isInline(element);
  editor.insertText = text => {
    console.log('insertText', text);
    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertText(text)
    }
  }

  editor.insertData = (data: DataTransfer) => {
    const text = data.getData('text/plain');
    console.log('insertData', text);
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  }

  return editor;
};

const wrapLink = (editor: Editor, url: string, selection: Range | null = null) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }
  selection = selection || editor.selection;
  if (!selection)
    return;

  Transforms.select(editor, selection);
  const isCollapsed = Range.isCollapsed(selection);
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  console.log({ isCollapsed, link });

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
}


export const insertLink = (editor: Editor, selection: RangeRef | null, url: string) => {
  if (selection)
    wrapLink(editor, url, selection.unref());
}

const isLinkActive = (editor: Editor) => {
  const [link] = Editor.nodes(editor, { match: n => n.type === 'link' });
  return !!link;
}

const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, { match: n => n.type === 'link' });
}

export interface LinkButtonProps {
  onEnterLink: () => void;
}

const LinkButton: FC<LinkButtonProps> = ({ onEnterLink, ...props }) => {
  const editor = useSlate();
  const toggleLink = () => {
    if (isLinkActive(editor)) {
      unwrapLink(editor);
      ReactEditor.focus(editor);
    }
    else
      onEnterLink();
  };

  return (
    <ToolbarButton active={isLinkActive(editor)} onClick={toggleLink} {...props} />
  );
};

export default LinkButton;

import React, { useMemo } from "react";
import { createEditor, Node } from "slate";
import {
  Editable,
  withReact,
  Slate,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";

import { withHistory } from 'slate-history';

import { DefaultElement, LinkElement } from "./elements";
import { Toolbar } from "./Toolbar";
import { withLinks } from "./components/LinkButton";

function renderElement({ attributes, children, element }: RenderElementProps) {
  switch (element.type) {
    case 'link':
      return <LinkElement {...attributes} href={element.url}>{children}</LinkElement>;

    default:
      return <DefaultElement {...attributes}>{children}</DefaultElement>;
  }
}

function renderLeaf({ attributes, children, leaf }: RenderLeafProps) {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;

  return <span {...attributes}>{children}</span>;
}

export interface EditorProps {
  value: Node[];
  onChange: (value: Node[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  spellCheck?: boolean;
}

export function Editor(props: EditorProps) {
  const { value, onChange, ...other } = props;
  const editor = useMemo(() => withLinks(withHistory(withReact(createEditor()))), []);

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Toolbar />
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        {...other}
      />
    </Slate>
  );
}

export { Node };

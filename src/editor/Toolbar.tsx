import React, { FC, useEffect, useState, useRef } from "react";
import { Popper, ButtonGroup } from "@material-ui/core";
import { FormatBold, FormatItalic, FormatUnderlined, Link } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { ReactEditor, useSlate } from "slate-react";
import { Editor, Range, RangeRef, Transforms } from "slate";

import MarkupButton from "./components/MarkupButton";
import LinkEditor from "./components/LinkEditor";
import LinkButton, { insertLink } from "./components/LinkButton";

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.common.black,
    borderRadius: 4,
    marginBottom: 4,
  }
}));

export interface MarkupToolbarProps {
  onEnterLink: () => void;
}

const MarkupToolbar: FC<MarkupToolbarProps> = ({ onEnterLink }) =>
  <ButtonGroup variant="text" color="primary">
    <MarkupButton format="bold" >
      <FormatBold fontSize="small" />
    </MarkupButton>
    <MarkupButton format="italic">
      <FormatItalic fontSize="small" />
    </MarkupButton>
    <MarkupButton format="underline">
      <FormatUnderlined fontSize="small" />
    </MarkupButton>
    <LinkButton onEnterLink={onEnterLink}>
      <Link fontSize="small" />
    </LinkButton>
  </ButtonGroup>
  ;

const hasNonEmptySelection = (editor: Editor) => {
  const { selection } = editor;
  return selection !== null
    && !Range.isCollapsed(selection)
    && Editor.string(editor, selection) !== ''
    ;
}

const toolbarAnchor = (editor: ReactEditor, selection: Range) => {
  const boundingRect = ReactEditor.toDOMRange(editor, selection).getBoundingClientRect();
  return {
    clientWidth: boundingRect.width,
    clientHeight: boundingRect.height,
    getBoundingClientRect: () => boundingRect,
  };
};

const restoreSelectionAndFocus = (editor: ReactEditor, savedSelection: RangeRef | null) => {
  const selection = savedSelection?.unref();
  if (selection)
    Transforms.select(editor, selection);
  ReactEditor.focus(editor);
};

export const Toolbar = () => {
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const [enteringLink, setEnteringLink] = useState<boolean>(false);
  const savedSelection = useRef<RangeRef | null>(null);
  const anchorEl = useRef<any>(null);
  const editor = useSlate();
  const s = useStyles();

  const handleEnterLink = () => {
    savedSelection.current = editor.selection ? Editor.rangeRef(editor, editor.selection) : null;
    setEnteringLink(true);
  };

  const cancelEnterLink = () => {
    setEnteringLink(false);
    restoreSelectionAndFocus(editor, savedSelection.current);
  };

  const handleInsertLink = (url: string) => {
    setEnteringLink(false);
    insertLink(editor, savedSelection.current, url);
    ReactEditor.focus(editor);
  };

  useEffect(() => {
    const toolbarVisible = enteringLink || (ReactEditor.isFocused(editor) && hasNonEmptySelection(editor));
    setShowToolbar(toolbarVisible);
    if (toolbarVisible && editor.selection)
      anchorEl.current = toolbarAnchor(editor, editor.selection);
  });

  return (
    <Popper className={s.root} open={showToolbar} anchorEl={anchorEl.current} placement="top">
      {enteringLink
        ? <LinkEditor value={""} onSave={handleInsertLink} onCancel={cancelEnterLink} />
        : <MarkupToolbar onEnterLink={handleEnterLink} />}
    </Popper>
  );
}

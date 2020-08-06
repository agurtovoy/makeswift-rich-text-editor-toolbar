import React, { useState, FormEvent } from "react";
import { Input } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import isUrl from 'is-url';

const useStyles = makeStyles(theme => ({
  input: {
    color: theme.palette.common.white,
    padding: theme.spacing(0.25, 1),
  },
  close: {
    opacity: 0.75,
    cursor: "pointer",
    "&:hover": {
      opacity: 1,
    },
  }
}));

export interface LinkEditorProps {
  value: string;
  onSave: (link: string) => void;
  onCancel: () => void;
}

const LinkEditor = ({ value, onSave, onCancel }: LinkEditorProps) => {
  const s = useStyles();
  const [url, setUrl] = useState(value);
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const newValue = url.trim();
    if (newValue !== '')
      onSave(isUrl(newValue) ? newValue : `https://${newValue}`);
    else
      onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        className={s.input}
        value={url}
        onChange={e => setUrl(e.target.value)}
        endAdornment={
          <Close
            className={s.close}
            fontSize="small"
            onClick={onCancel}
          />
        }
        placeholder="Paste or type a link..."
        disableUnderline
        fullWidth
        autoFocus
      />
    </form>
  );
}

export default LinkEditor;

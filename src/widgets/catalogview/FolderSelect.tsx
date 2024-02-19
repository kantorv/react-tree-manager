import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type FolderSelectorProps = {
  folders: string[];
  onSelect: (folder: string) => void;
};

const FolderSelector = (props: FolderSelectorProps) => {
  const { folders, onSelect } = props;
  const [folder, setFolder] = React.useState<string>('/');

  const handleChange = (event: SelectChangeEvent) => {
    setFolder(event.target.value);
  };

  React.useEffect(() => {
    onSelect(folder);
  }, [folder]);

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-select-small-label">Path</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={folder}
        label="Path"
        onChange={handleChange}
      >
        <MenuItem value="/">/</MenuItem>
        {folders.map((f) => (
          <MenuItem key={f} value={f}>
            {f}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export { FolderSelector };

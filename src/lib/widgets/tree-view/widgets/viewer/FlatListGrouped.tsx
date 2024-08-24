import { useEffect, useState } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Typography } from '@mui/material';

import Divider from '@mui/material/Divider';
import ArticleIcon from '@mui/icons-material/Article';
import { TreeContentItem } from '../../types/lib.types';

import { bytesToSize, getFilePathWithoutFilename } from '../../helpers/utils';

type CatalogViewFlatListGroupedProps = {
  mdfiles: Array<TreeContentItem>;
  setActiveDoc: (path: string) => void;
};

const CatalogViewFlatListGrouped = (props: CatalogViewFlatListGroupedProps) => {
  const { mdfiles, setActiveDoc } = props;

  const [grouped, setGrouped] = useState<
    Record<string, Array<TreeContentItem>>
  >({});

  const selectedDocument = {
    sha: 'asdasdads',
  };
  useEffect(() => {
    if (!mdfiles.length) return;

    let groupedRecords: Record<string, Array<TreeContentItem>> = {};
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    mdfiles.sort((a, b) => (a.path.includes('/') ? 1 : -1));

    /* eslint-disable-next-line no-restricted-syntax */
    for (const i of mdfiles) {
      const path = getFilePathWithoutFilename(i.path);
      if (!(path in groupedRecords))
        groupedRecords = { ...groupedRecords, [path]: [] };
      groupedRecords[path].push(i);
    }

    setGrouped(groupedRecords);
  }, [mdfiles]);

  useEffect(() => {
    console.log('grouped updated', grouped);
  }, [grouped]);

  return Object.keys(grouped).map((path) => {
    const randomUuid = crypto.randomUUID();
    return (
      <List
        key={path.replace(/\//g, '')}
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby={`settings-list-subheader-${randomUuid}`}
        disablePadding
        subheader={
          <ListSubheader
            component="div"
            id={`settings-list-subheader-${randomUuid}`}
            sx={{
              p: 0,
              lineHeight: 'normal',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {path}
            </Typography>
            <Divider flexItem sx={{ p: 0 }} />
          </ListSubheader>
        }
      >
        {grouped[path].map((item) => (
          <ListItemButton
            selected={item.sha === selectedDocument?.sha}
            key={item.sha}
            onClick={() => setActiveDoc(item.path)}
            divider
          >
            <ListItemIcon>
              {/* <Avatar sx={{ bgcolor: deepPurple[500],  width: 24, height: 24, fontSize:14  }}>1</Avatar> */}
              <ArticleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={item.path.split('/').pop()}
              secondary={bytesToSize(item.size!)}
              primaryTypographyProps={{
                variant: 'subtitle2',
                sx: {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
              }}
              secondaryTypographyProps={{
                variant: 'body2',
              }}
            />
          </ListItemButton>
        ))}
      </List>
    );
  });
};

export { CatalogViewFlatListGrouped };

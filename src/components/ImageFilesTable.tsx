import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ImageIcon from '@material-ui/icons/Image';
import { useProjects, ImageFileMeta } from '../common/Context';
import { fileCallbackToPromise, humanFileSize } from '../common';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import BackdropComponent from '../common/Backdrop';
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableOptions } from 'mui-datatables';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actionColumn: {
      [theme.breakpoints.up('lg')]: {
        width: 175,
      },
      textAlign: 'center',
      borderBottom: '1px solid rgba(81, 81, 81, 1)',
      position: 'sticky',
      backgroundColor: theme.palette.background.paper,
      zIndex: 100,
      top: '0px'
    },
    button: {
      margin: theme.spacing(1)
    },
    input: {
      display: 'none'
    }
  })
);

const ImageFilesTable = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { currentProject, setCurrentProject } = useProjects();
  const { selectedImage, selectedVideo, imageFiles } = currentProject;
  const [isLoading, setIsLoading] = React.useState(false);

  const options: MUIDataTableOptions = {
    download: false,
    filter: false,
    pagination: false,
    print: false,
    search: false,
    viewColumns: false,
    selectableRows: 'none',
    fixedHeader: true,
    onRowClick: (_, { dataIndex }) => handleSelect(imageFiles[dataIndex]),
    tableBodyMaxHeight: '300px'
  };

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "Delete",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customHeadRender: () => {
          return (
            <td key="image-import" className={classes.actionColumn}>
              <label htmlFor="image-import">
                <Button
                  color="secondary"
                  variant="outlined"
                  className={classes.button}
                  component="span"
                  startIcon={<ImageIcon />}>
                  Add Images
                </Button>
              </label>
            </td>
          )
        },
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <Tooltip title={`Delete ${imageFiles[rowIndex].name}`} arrow>
              <IconButton onClick={(e) => handleRemove(e, rowIndex)}>
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          )
        }
      }
    },
    {
     name: "name",
     label: "Image Name",
     options: {
      sort: true,
      sortThirdClickReset: true,
     }
    },
    {
     name: "type",
     label: "Type",
     options: {
      sort: true,
      sortThirdClickReset: true,
     }
    },
    {
     name: "dimensions",
     label: "Dimensions",
     options: {
      sort: false,
     }
    },
    {
      name: "size",
      label: "Size",
      options: {
       sort: true,
       sortThirdClickReset: true,
       customBodyRenderLite: (dataIndex) => {
        return humanFileSize(imageFiles[dataIndex].size);
       }
      }
     },
     {
      name: "preview",
      label: "Preview",
      options: {
       sort: false,
      }
     },
  ];

  const data = imageFiles.map((image, index) => {
    return {
      index,
      name: image.name.replace(/\.[^/.]+$/, ""),
      type: image.name.split('.').pop(),
      dimensions: `${image.width}x${image.height}`,
      size: image.size,
      preview: <img src={image.src} width={50} height={50} alt={image.name}></img>
    }
  });

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    event.stopPropagation();
    if (selectedImage) {
      let selectedImageIndex = imageFiles.findIndex(file => file.name === selectedImage.name);
      if (index === selectedImageIndex) {
        setCurrentProject({ ...currentProject, imageFiles: imageFiles.filter((_, i) => i !== index), selectedImage: undefined });
      } else {
        setCurrentProject({ ...currentProject, imageFiles: imageFiles.filter((_, i) => i !== index) });
      }
    } else {
      setCurrentProject({ ...currentProject, imageFiles: imageFiles.filter((_, i) => i !== index) });
    }
    enqueueSnackbar(`${imageFiles[index].name} removed.`, { variant: 'info' });
  }
  
  const handleSelect = (file: ImageFileMeta) => {
    if (selectedVideo) {
      setCurrentProject({ ...currentProject, selectedVideo: undefined, selectedImage: file });
    } else {
      setCurrentProject({ ...currentProject, selectedImage: file });
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;
  
    if (!files) return;
    
    setIsLoading(true);

    try {
      let newImageFiles = await Promise.all(Array.from(files).map(async file => {
        let src = URL.createObjectURL(file);
        let fileMeta: ImageFileMeta;
        let image = document.createElement('img');
    
        image.src = src;
        await fileCallbackToPromise(image);
           
        fileMeta = { name: file.name, size: file.size, type: file.type, src, width: image.naturalWidth, height: image.naturalHeight};
    
        return fileMeta;
      }));
    
      event.target.value = ''; // allows the same file(s) to be submitted back to back, otherwise no "change" occurs
  
      enqueueSnackbar(`${newImageFiles.length} image file(s) added.`);
      setCurrentProject({ ...currentProject, imageFiles: imageFiles.concat(newImageFiles) });
    } catch (err) {
      console.warn(err);
      enqueueSnackbar('There was a problem loading the files.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
   
  };
  
  const importPublicImages = async () => {
    setIsLoading(true);

    const fileNames = [ 
      'Mountains.jpg',
      'Road.jpg',
      'View.jpg',
    ];

    try {
      let files = await Promise.all(fileNames.map(async file => (await fetch(`./images/${file}`)).blob()));

      if (!files) return;
  
      let newImageFiles = await Promise.all(Array.from(files).map(async (file, index) => {
        let src = URL.createObjectURL(file);
        let fileMeta: ImageFileMeta;
        let image = document.createElement('img');
    
        image.src = src;
        await fileCallbackToPromise(image);
           
        fileMeta = { name: fileNames[index], size: file.size, type: file.type, src, width: image.naturalWidth, height: image.naturalHeight};
    
        return fileMeta;
      }));
  
      enqueueSnackbar(`${newImageFiles.length} image file(s) added.`);
      setCurrentProject({ ...currentProject, imageFiles: imageFiles.concat(newImageFiles) });
    } catch (err) {
      console.warn(err);
      enqueueSnackbar('There was a problem loading the files.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <input
        accept="image/*"
        className={classes.input}
        id="image-import"
        multiple
        type="file"
        onChange={(e) => handleImageUpload(e)}
      />
      {imageFiles.length === 0 &&
        <>
          <label htmlFor="image-import">
            <Button
              color="secondary"
              variant="outlined"
              className={classes.button}
              component="span"
              startIcon={<ImageIcon />}>
              Add Images
            </Button>
          </label>
          OR
          <Button
            variant="outlined"
            onClick={importPublicImages}
            className={classes.button}
            component="span"
          >
            Load Test Images (10 MB)
          </Button>
        </>
      }
      {imageFiles.length > 0 && 
        <MUIDataTable
          title=''
          data={data}
          columns={columns}
          options={options}
        />
      }
      <BackdropComponent open={isLoading} />
    </>
  );
}

export default React.memo(ImageFilesTable);

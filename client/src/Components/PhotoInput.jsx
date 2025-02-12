import { Box, CloseButton, Image, Input, Loader, Text } from '@mantine/core';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import DropzoneUploader from './DropzoneUploader';
import classes from './PhotoInput.module.css';

function PhotoInput ({ children, description, error, id, label, name, onChange, value, valueUrl }) {
  function onRemoved () {
    if (onChange) {
      onChange({ target: { name, value: '' } });
    }
  }

  function onUploaded (status) {
    if (onChange) {
      onChange({ target: { name, value: status.filename } });
    }
  }

  return (
    <Input.Wrapper label={label} description={description} error={error}>
      <Input renderRoot={(props) => (
        <Box h='auto' {...props}>
          <DropzoneUploader
            id={id}
            multiple={false}
            disabled={!!value && value !== ''}
            onRemoved={onRemoved}
            onUploaded={onUploaded}
          >
            {({ statuses, onRemove }) => {
              if (statuses.length > 0) {
                return statuses.map((s) => (
                  <Box
                    key={s.id}
                    className={classNames(classes.preview, {
                      [classes['preview--uploading']]: s.status === 'pending' || s.status === 'uploading',
                    })}
                  >
                    <Image src={s.file.preview} alt='' />
                    <CloseButton onClick={() => onRemove(s)} className={classes.remove} />
                    <Loader className={classes.spinner} />
                  </Box>
                ));
              } else if (statuses.length === 0 && value) {
                return (
                  <Box className={classes.preview}>
                    <Image src={valueUrl} alt='' />
                    <CloseButton className={classes.remove} onClick={onRemoved} />
                  </Box>
                );
              } else if (statuses.length === 0 && !value) {
                return children || <Text className='clickable' size='sm' my='xs'>Drag-and-drop a photo file here, or click here to browse and select a file.</Text>;
              }
            }}
          </DropzoneUploader>
        </Box>
      )}
      />
    </Input.Wrapper>
  );
}

PhotoInput.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  valueUrl: PropTypes.string,
};

export default PhotoInput;

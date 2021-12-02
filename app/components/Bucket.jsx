import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';

const Bucket = ({ handleClick, handleClose, name, selected }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      bgcolor={selected ? 'secondary.main' : 'primary.main'}
      borderRadius='10px'
      display='flex'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Button
        onClick={handleClick}
        variant="text"
        disableElevation
        sx={{
          color: selected ? 'black' : 'white',
          flexGrow: 1,
          textTransform: 'none'
        }}
      >
        <Box
          width='100%'
          textAlign='left'
          ml={2}
          sx={{ fontWeight: 400 }}
        >
          <Typography variant="body1">{name}</Typography>
        </Box>
      </Button>
      {hovered && (handleClose !== undefined) && (
        <Button
          onClick={handleClose}
          variant="text"
          disableElevation
          sx={{ color: selected ? 'black' : 'white' }}
        >
          <CloseIcon />
        </Button>
      )}
    </Box>
  );
};

Bucket.propTypes = {
  handleClick: PropTypes.func.isRequired,
  handleClose: PropTypes.func,
  name: PropTypes.string.isRequired,
  selected: PropTypes.bool,
};

export default Bucket;
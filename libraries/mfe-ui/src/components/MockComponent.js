import React from 'react';
import MuiBox from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { borderRadius } from '@mui/system';

const styles = {
  container: {
    width: '100%', 
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    border: '1px solid #aaa',
    borderRadius: '2px',
  },
  crossed: {
    background: 'linear-gradient(to top left, rgba(170,170,170,0) 0%, rgba(170,170,170,0) calc(50% - 0.8px), rgba(170,170,170,1) 50%, rgba(170,170,170,0) calc(50% + 0.8px), rgba(170,170,170,0) 100%), linear-gradient(to top right, rgba(170,170,170,0) 0%, rgba(170,170,170,0) calc(50% - 0.8px), rgba(170,170,170,1) 50%, rgba(170,170,170,0) calc(50% + 0.8px), rgba(170,170,170,0) 100%)',
    backgroundColor: '#eee',
  },
  child: {
    backgroundColor: '#eee',
    padding: '5px',
  }
}

const MockComponent = (props) => (
  <MuiBox sx={{ ...styles.container, ...styles.crossed, ...props.sx}}>
    <MuiBox sx={{ ...styles.child }}>
      <Typography>{props.placeholder ? props.placeholder : 'Placeholder' }</Typography>
    </MuiBox>
  </MuiBox>
);

export { MockComponent };
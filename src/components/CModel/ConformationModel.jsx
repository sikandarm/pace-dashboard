import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CButton from '../CButton/CButton';
// import { useMainThemeStyles } from "../../Theme/MainTheme";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    textAlign: 'center',
  },
}));

const ConformationModel = (props) => {
  const classes = useStyles();
  // const myClasses = useMainThemeStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  // const handleOpen = () => {
  //   props.setOpen(!open);
  // };

  const handleClose = (filter) => {
    if (filter === 'cancel') {
      return props.setOpen(false);
    }
    if (filter === 'done') {
      props.handleClick();
    }
  };
  console.log(props);
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">{props.title}</h2>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
        <CButton
          Width={100}
          Padding="12px 0px"
          title={props.isLoading ? 'Loading..' : 'Yes'}
          backGroundColor="rgb(0, 158, 247)"
          // onClick={handleDelete}
          Color="#fff"
          onClick={() => handleClose('done')}
          filter="close"
          disabled={props.isLoading}
        />
        <CButton
          Width={100}
          Padding="12px 0px"
          title={'Cancel'}
          backGroundColor="rgba(210,68,68,1)"
          // onClick={handleDelete}
          Color="#ffff"
          onClick={() => handleClose('cancel')}
          filter="close"
        />
        {/* <CButton  filter='conformation' onClick={setOpen} open={open} setOpen={setOpen} Width={100} Color='#ffff' Padding="12px 0px" title="Update" backGroundColor={'#009ef7'}/> */}
      </div>
    </div>
  );

  return <div>{body}</div>;
};

export default ConformationModel;

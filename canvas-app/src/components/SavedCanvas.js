import React, {Component} from 'react';
import { connect } from 'react-redux';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever';
import {getAllCanvasByUser} from '../actionCreators/canvas';

import { Link } from 'react-router-dom';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 600,
    overflowY: 'auto',
  },
};

class SavedCanvas extends Component {
  constructor(props){
    super(props);

    var data = JSON.parse(localStorage.getItem('logged'));
    props.getAllCanvasByUser(data.token);
  }

  render() {
    const { savedCanvas } = this.props;
    return(
      <div style={styles.root}>
        <GridList
          cellHeight={180}
          style={styles.gridList}
        >
          <Subheader>Saved canvas</Subheader>
          {savedCanvas.map((canvas) => (
            <Link to={`../canvas/${canvas._id}/`} key={canvas._id}>
              <GridTile 
                title={canvas.name} 
                actionIcon={<IconButton ><DeleteIcon color="white" /></IconButton>}>
                <img src={canvas.image} alt={canvas.name}/>
              </GridTile>
            </Link>
          ))}
        </GridList>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    savedCanvas: state.savedCanvasReducer.savedCanvas
  }
}

const mapDispatchToProps = {
  getAllCanvasByUser: (token) => getAllCanvasByUser(token)
}


export default connect(mapStateToProps, mapDispatchToProps)(SavedCanvas);
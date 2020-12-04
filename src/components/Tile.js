import React, { Component } from 'react';
import './styles/Tile.css';

import Dropdown from 'react-bootstrap/Dropdown';

class Tile extends Component {
  constructor (props) {
    super(props);
    this.state = {
      widget: props.widget
    };
  }

  chooseWidget (widget) {
    this.setState({ widget: widget });
  }

  render () {
    const editMode = this.props.editMode;

    if (editMode) {
      return (
        <div className='tile-container'>
          <Dropdown>
            <Dropdown.Toggle variant='success' id='choose-widget'>
              {this.state.widget ? this.state.widget.displayName : 'Choose widget'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {this.props.availableWidgets.map((widget, index) => (<Dropdown.Item onClick={() => this.chooseWidget(widget)} key={index}>{widget.displayName}</Dropdown.Item>))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      );
    } else {
      const Widget = this.props.widget;

      if (!Widget) return null;

      const handle = function (callback) {
        this.props.setSaveCallback(callback, this.props.index);
      }.bind(this);
      return (
        <div className='tile-container'>
          <Widget setSaveCallback={handle} config={this.props.config} />
        </div>
      );
    }
  }
}

export default Tile;

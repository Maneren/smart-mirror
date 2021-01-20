import React, { Component } from 'react';
import './styles/Tile.css';

import Dropdown from 'react-bootstrap/Dropdown';
import { Form } from 'react-bootstrap';

class Tile extends Component {
  constructor (props) {
    super(props);
    this.state = {
      widget: props.widget,
      config: props.config,
      choice: {
        widget: props.widget,
        config: props.config
      }
    };
  }

  chooseWidget (widget) {
    const { config } = this.state.choice;
    this.setState({ choice: { widget, config } });
  }

  changeConfig (key, val) {
    const { widget, config } = this.state.choice;
    config[key] = val;
    this.setState({ choice: { widget, config } });
  }

  componentDidMount () {
    this.props.setSaveEditCallback(this.saveChoice.bind(this), this.props.index);
  }

  saveChoice () {
    const { widget, config } = this.state.choice;
    this.setState({
      widget,
      config
    });
  }

  render () {
    const handle = function (callback) {
      this.props.setSaveCallback(callback, this.props.index);
    }.bind(this);

    const { editMode } = this.props;
    const Widget = this.state.widget; // component name must be capitalized
    const { choice } = this.state;
    let dropdownLabel = 'Choose widget';
    if (choice.widget) dropdownLabel = choice.widget.menuName;

    const { configInput } = choice.widget;

    return (
      <div className='tile-container'>
        <div style={{ display: editMode ? 'block' : 'none' }}>
          <Dropdown>
            <Dropdown.Toggle className="Dropdown-button" variant='success' id='choose-widget'>
              {dropdownLabel}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {
                Object.entries(this.props.availableWidgets).map(
                  ([key, widget], index) => {
                    if (!widget.menuName) return null;
                    return (
                      <Dropdown.Item onClick={() => this.chooseWidget(widget)} key={index}>
                        {widget.menuName}
                      </Dropdown.Item>
                    );
                  }
                )
              }
            </Dropdown.Menu>
          </Dropdown>
          {
            configInput
              ? <Form>
                {
                  configInput.map((input, index) => {
                    switch (input.type) {
                      case 'bool':
                        return (
                          <Form.Group key={index} className = "input bool">
                            <Form.Label>{input.label}</Form.Label>
                            <Form.Control as='select' multiple>
                              <option onClick={() => this.changeConfig(input.id, true)}>Ano</option>
                              <option onClick={() => this.changeConfig(input.id, false)} value='false'>Ne</option>
                            </Form.Control>
                          </Form.Group>
                        );
                      case 'select':
                        return (
                          <Form.Group key={index} className = "input select">
                            <Form.Label>{input.label}</Form.Label>
                            <Form.Control as='select' multiple>
                              {input.options.map(option => <option onClick={() => this.changeConfig(input.id, option.id)} key={option.id}>{option.label}</option>)}
                            </Form.Control>
                          </Form.Group>
                        );
                      default:
                        return (
                          <Form.Group key={index} className = "input default">
                            <Form.Label>{input.label}</Form.Label>
                            <Form.Control onChange={e => this.changeConfig(input.id, e.target.value)} type={input.type} placeholder={input.placeholder} />
                          </Form.Group>
                        );
                    }
                  })
              } </Form>
              : null
            }
        </div>
        <div style={{ display: editMode ? 'none' : 'block' }}>
          <Widget setSaveCallback={handle} config={this.props.config} />
        </div>
      </div>
    );
  }
}

export default Tile;

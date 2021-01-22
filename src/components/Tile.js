import React, { Component } from 'react';
import './styles/Tile.css';

import { Form, Dropdown } from 'react-bootstrap';

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
    this.setState({ choice: { widget, config: {} } });
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
            <Dropdown.Toggle className='Dropdown-button' size='lg' variant='success' id='choose-widget'>
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
                          <Form.Group key={index}>
                            <Form.Check onChange={e => this.changeConfig(input.id, e.target.checked)} inline label={input.label} type='checkbox' />
                          </Form.Group>
                        );
                      case 'select':
                        return (
                          <Dropdown key={index}>
                            <Dropdown.Toggle variant='primary' id='choose-widget'>
                              {choice.config[input.id] ? choice.config[input.id] : input.label}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              {
                                input.options.map(option => {
                                  return (
                                    <Dropdown.Item onClick={() => this.changeConfig(input.id, option.id)} key={option.id}>
                                      {option.label}
                                    </Dropdown.Item>
                                  );
                                })
                              }
                            </Dropdown.Menu>
                          </Dropdown>
                        );
                      default:
                        return (
                          <Form.Group key={index} className='input default'>
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
          <Widget setSaveCallback={handle} config={this.state.config} />
        </div>
      </div>
    );
  }
}

export default Tile;

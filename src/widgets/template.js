import { Component } from 'react';

class WidgetTemplate extends Component {
  constructor (props) {
    super(props);
    this.defaults = {};
  }

  getDataToSave () {
    return { type: this.constructor.name, config: this.props.config };
  }

  get config () {
    return {
      ...this.defaults,
      ...this.state.config
    };
  }

  componentDidMount () {
    this.props.setSaveCallback(this.getDataToSave.bind(this));
  }
}

export default WidgetTemplate;

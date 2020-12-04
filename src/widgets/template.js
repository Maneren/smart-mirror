import { Component } from 'react';

class WidgetTemplate extends Component {
  getDataToSave () {
    return { type: this.constructor.name, config: this.state.config };
  }

  componentDidMount () {
    this.props.setSaveCallback(this.getDataToSave.bind(this));
  }
}

export default WidgetTemplate;

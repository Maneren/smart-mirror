import { Component } from 'react';

class WidgetTemplate extends Component {
  constructor (props) {
    super(props);
    this.defaults = {};
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

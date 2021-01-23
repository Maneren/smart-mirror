import React from 'react';

import WidgetTemplate from '../template.js';

class Error extends WidgetTemplate {
  getDataToSave () {
    return { type: 'Error', config: this.props.config };
  }

  render () {
    return (
      <div className='fallback-container'>Module not found</div>
    );
  }
}

export default Error;

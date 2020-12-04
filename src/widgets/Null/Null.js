import React from 'react';

import WidgetTemplate from '../template.js';

class Null extends WidgetTemplate {
  getDataToSave () {
    return { type: '', config: {} };
  }

  render () {
    return (
      <div className='null-container' />
    );
  }
}

Null.menuName = 'Prázdné';

export default Null;

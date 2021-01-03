import React, { Component } from 'react';

class Pagination extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <div className='pagination-container'>
        {this.props.children.map((page, i) => {
          return (
            <div style={{ display: this.props.activePage === i ? 'block' : 'none' }} key={i} className='page-container'>
              {page}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Pagination;

import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default function Page1Component({demoAction}) {

  return (
    <div className="page1">
      <h1>This is page 1</h1>

      <img src={require('./assets/img/logo.png')}/>

      <Link className="btn" to="/page2" onClick={() => demoAction('Going to Page 2')}>Page 2</Link>
    </div>
  );
}


Page1Component.propTypes = {
  demoAction: PropTypes.func.isRequired
};

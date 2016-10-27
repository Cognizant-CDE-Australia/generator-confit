import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default function Page2Component({demoAction}) {

  return (
    <div className="page2">
      <h2>This is page 2</h2>
      <Link className="btn icon icon-menu-expand" to="/page1" onClick={() => demoAction('Going to Page 1')}>Page 1</Link>
    </div>
  );
}


Page2Component.propTypes = {
  demoAction: PropTypes.func.isRequired
};

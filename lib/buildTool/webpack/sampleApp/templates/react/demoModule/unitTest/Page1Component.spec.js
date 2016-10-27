import React from 'react';
import {Router, Route} from 'react-router';
import Page1Component from '../Page1Component';
import {mount} from 'enzyme';

describe('Page1Component', function () {

  // Page1Component has a Link element, and we can only click on them when they exist inside a Router
  it('should work', function () {
    let mockFn = jasmine.createSpy('mockFunction');
    let wrapperComponent = () => <Page1Component demoAction={mockFn}/>;
    const wrapper = mount(<Router><Route path='/' component={wrapperComponent}/></Router>);

    wrapper.find('a').simulate('click');
    expect(mockFn).toHaveBeenCalledWith('Going to Page 2');
  });
});

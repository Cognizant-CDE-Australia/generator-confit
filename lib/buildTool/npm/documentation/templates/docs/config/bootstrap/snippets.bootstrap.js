if (__DEV__) {
  module.hot.accept();
}

export default (() => {

  function requireAll(requireContext) {
    return requireContext.keys().map(requireContext);
  }

  requireAll(require.context('../../snippets/', true, /^\.\/.*\/index.js$/));

})();

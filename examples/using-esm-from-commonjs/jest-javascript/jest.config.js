// List the dependencies that are pure esm and need transformation.
const esmModules = ['commander'].join('|'); // redundant join in case you have others

module.exports = {
  transformIgnorePatterns: [`node_modules/(?!(${esmModules})/)`],
};

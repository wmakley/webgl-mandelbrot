// Bridge between shaders that are plain text files and ES 6 modules
module.exports = {
  VertexPassthrough: require('./shaders/VertexPassthrough.glsl'),
  FragmentTest: require('./shaders/FragmentTest.glsl')
};

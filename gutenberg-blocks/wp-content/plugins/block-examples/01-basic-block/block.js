const { __ } = wp.i18n; // Pull in internationalization lib
const { registerBlockType } = wp.blocks;

const blockStyle = {
    backgroundColor: '#900',
    color: '#fff',
    padding: '20px'
};

// ,y-plugin/block-name
registerBlockType( 'block-examples/block-examples-01-basic-block', {
    title: __( 'Basic Block' ),
    icon: 'universal-access-alt',
    category: 'layout',

    // Used in editor
    edit () {
        return <div style={blockStyle}> Hello, backend. </div>;
    },
    // Used in front end
    save () {
        return <div style={blockStyle}> Hello, frontend.</div>;
    }
});
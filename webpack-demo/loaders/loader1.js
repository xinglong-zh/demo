const {getOptions} = require('loader-utils')
const {validate}  =require( 'schema-utils')


const schema = {
    type:'object',
    properties:{
        test:{
            type:'string'
        }
    }
}
module.exports =  function(source){
    const options = getOptions(this);
    console.log(source,options,'loader1')
    validate(schema,options,{});
    return source;
}
// Keep them simple.
// Utilize chaining.
// Emit modular output.
// Make sure they're stateless.
// Employ loader utilities.
// Mark loader dependencies.
// Resolve module dependencies.
// Extract common code.
// Avoid absolute paths.
// Use peer dependencies.
// loader 白纸上是一个函数

import {getOptions} from 'loader-utils'  // 
import {validate} from 'schema-utils'

const schema = {
    type:'object',
    properties:{
        test:{
            type:'string'
        }
    }
}
// export default function(source){
//     const options = getOptions(this);
//     validate(schema,options,{
//         name:'example loader',
//     })
//     console.log('loader03')
// }

module.exports = function(source,map,meta){
    console.log('loader01');
    return source;
}
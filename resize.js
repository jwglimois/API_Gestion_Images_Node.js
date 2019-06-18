
// Appeler le module FileSystem ('fs')
var fs = require('fs');
// Appeler le module Sharp
var sharp = require('sharp');
var shortid = require("shortid");
id = shortid.generate();


var get =  async function(path, format, width, height, po, rotate_deg, l,t,w,h,compress,level){
   
    console.log('test')
        var instanceSharp = sharp(path)
        console.log('test 2')
        console.log(format)
        if(format){
            console.log('format ' + format)
            instanceSharp.toFormat(format);
            console.log(width || height)
            if (width || height) {
                console.log('largeur ou hauteur')
                await instanceSharp.resize( width, height,  {position:po});//To use crop in resize fonction, both width and height params are neccessary for crop to work. 
            }
            if(rotate_deg){
                console.log('rotate')
                await instanceSharp.rotate(rotate_deg);
            }
            if(l !== false && t !== false && w && h){
                console.log('Function Crop-Extract activée')
                await instanceSharp.extract({ left: l, top: t, width: w, height: h});
            }
            console.log(compress!==false && (format=='jpg' || format=='jpeg'))

            if(compress!==false && (format=='jpg' || format=='jpeg')){
                console.log('compress function')
                console.log(compress)
                const instanceSharpCompress = instanceSharp.clone()
                console.log('input JPG path : '+path)

                let dataSharp = await instanceSharpCompress.jpeg(  
                {
                    quality: compress <= 100 ? compress : 100, 
                    chromaSubsampling: '4:4:4' //Cet option s'agit d'éviter la réduction de volume des images lorsque la qualité est <=90
                }).toFile('./public/images/compress/' + compress + '.jpg')
                .then(data=>{
                    // compare le fichier compresser a l'original
                    console.log('niveau de compress en JPG est: '+ compress)
                    var newPath = __dirname + '/public/images/compress/' + compress + '.jpg'
                    comparaison(newPath);
                    console.log("newPath est :----------"+newPath)
                    console.log('data JPG est :'+ data )
                })

                console.log('return path JPEG final'+path)
                return path;                       
            }
            function comparaison(inputPath){
                const imageUrl=fs.statSync(path);
                var imageSize=parseFloat(imageUrl.size/1024).toFixed(2);
                console.log("Taille de l\'image Originale en Ko:" + imageSize);
    
                const imageCompressUrl=fs.statSync(inputPath);
                var imageCompressSize=parseFloat(imageCompressUrl.size/1024).toFixed(2);
                console.log("Taille de l\'image compressée en Ko:" + imageCompressSize);
                var difference =  imageSize - imageCompressSize 
                

                if(difference>0){
                    console.log('Différence de taille: '+difference + ' Ko')
                    console.log('Afficher le nouveau fichier')
                    path= inputPath
                    
                }else{
                    console.log('Afficher l\'ancien fichier')
                }
            }
            if((compress!==false|| level!==false) && format=='png'){               
                const instanceSharpPNGCompress = instanceSharp.clone()
                console.log('input PNG path : '+path)

                let dataSharp = await instanceSharpPNGCompress.png(  
                    {
                        quality: compress <= 100 ? compress : 100,
                        compressionLevel : level <= 9 ? level: 9,             
                        adaptiveFiltering:true //C'est une pré-compression qui réorganise les données de l’image afin que la compression réelle soit plus efficace
                    }).toFile('./public/images/compress/' + compress + '.png')
                    .then(data=>{
                        // compare le fichier compresser a l'original
                        console.log('niveau de compress en PNG est: '+ compress)
                        var newPath = __dirname + '/public/images/compress/' + compress + '.png'
                        comparaison(newPath);
                        console.log('data PNG est :'+ data )
                    })
    
                    console.log('return path PNG final'+path)
                    return path;                       
                }
            
        }
    
}


module.exports.get = get;



var express = require('express');// charger le module Express
var app = express(); // instanciation de l'objet "express"
const resizeInstance = require('./resize');

app.get('/', async (req,res)=>{
    /*le token est  il existant ou valide

    sinon
    return 'erreur'
    */



    try{
        //Exporter les paramètres de "query"
        const widthString=req.query.width;
        const heightString=req.query.height;
        const nameImage = req.query.name;
        const format= nameImage.substr(nameImage.indexOf('.') + 1 ); 
        const rotateString=req.query.rotate;
        const clString=req.query.cl;
        const ctString=req.query.ct;
        const cwString=req.query.cw;
        const chString=req.query.ch;
        const compressString=req.query.compress;
        const compressLevel=req.query.level;
        const po1=req.query.position;
        const po2={
            rt:'right top',
            rb:'right bottom',
            lt:'left top',
            lb:'left bottom',
            r:'right',
            l:'left',
            t:'top',
            b:'bottom'
        };
        
        /*
        console.log('format de input dans URL est: '+format)
        console.log('position: '+ po2[po1])
        console.log('width: ' + widthString)
        console.log('height: ' + heightString)
        console.log('nameImage: ' + nameImage)
        console.log('rotate: ' + rotateString)
        console.log('crop_left: '+ clString)
        console.log('crop_top:'+ ctString)
        console.log('crop_width '+ cwString)
        console.log('crop_height:'+ chString)
        console.log('Compress quality:'+compressString)
        */

        //Convertir en Int comme les paramètres sont en String
        let width, height, rotate, cl, ct, cw, ch, compress, level;
        if(widthString){
            width= parseInt(widthString);
        }
        if(heightString){
            height= parseInt(heightString);
        }
        if(rotateString){
            rotate= parseInt(rotateString);
        }
        if(clString){
            cl= parseInt(clString);
        }
        if(ctString){
            ct= parseInt(ctString);
        }
        if(cwString){
            cw= parseInt(cwString);
        }
        if(chString){
            ch= parseInt(chString);
        }
        if(compressString){
            compress=parseInt(compressString);
        }
        if(compressLevel){
            level=parseInt(compressLevel);
        }
        

        //MIME type sur Content-Type HTTP header
        res.type(format);
        const pathImage = __dirname +  '/public/images/'
        console.log('path initial est:'+pathImage + nameImage)
    

        const a = await resizeInstance.get(pathImage + nameImage, format, width, height, po2[po1], rotate, cl, ct, cw, ch, compress,level)
        console.log('resizeInstance: ---------'+ resizeInstance)
        res.sendFile(a);
    }catch(error){
        console.log("Error sur la page server.js: "+error)
    }       
})
    
app.listen(8000, function(){
    console.log('Server lancé');
})



// localhost:8000/?name=3chatons.jpg&compress=60
//localhost:8000/?name=couleurs.jpg&compress=80&width=200&height=200
//localhost:8000/?name=logo_10.jpg&width=600&height=300&position=lt&cl=20&ct=10&cw=500&ch=250&compress=80
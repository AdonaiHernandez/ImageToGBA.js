canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d");
input = document.querySelector("input");
p = document.querySelector("p");
img = new Image();
pixels = [];
palete = [];
objectPalete = {};
gbaImagenData = [];
finalData = [];

function loadImage(e){

    file = input.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
        if( event.target.readyState == FileReader.DONE) {
	    		img.src = event.target.result;
				img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                    getPixelsColors();
                };
			}
    }

}

function getPixelsColors(){
    const data = ctx.getImageData(0,0,img.width, img.height).data;
    

    for (let i = 0; i < data.length; i+=4){
        //const rgb15 = (data[i] << 16) | (data[i+1] << 8) | data[i+2];
        
        const rgb15 = (data[i] >> 3) | ((data[i+1] >> 3) << 5) | ((data[i+2] >> 3) << 10);

        pixels.push(rgb15);

        if (palete.indexOf(rgb15) === -1){
            
            if (palete[i] === 0)
                return;
            palete.push(rgb15);
        }
    }

    for (let i = 0; i < palete.length; i++){
        const str = toHexValue(palete[i].toString(16), 4);

        objectPalete[i+1] = str;
    }

    for (let i = 0; i < pixels.length; i++){

        const index = palete.indexOf(pixels[i]);

        gbaImagenData.push(index+1);
    }

    console.log(gbaImagenData);
    showData();
    parseImagenData();
}

function toHexValue (str, lng){

    const length = str.length;

    let hexStr = str;

    while (hexStr.length < lng){
        hexStr = "0" + hexStr;
    }

    hexStr = hexStr.toUpperCase();

    return "0x"+hexStr;

}

function showData(){
    p.innerText = "Palete: " + Object.values(objectPalete).join(", ") + "\n";

}
/*

    00000000, 00000000  | Se lee de derecha a izquierda cada 2 numeross es 1 pixel, 1D 
    00000001, 00000000  | 8 serian 4 pixels de izquierda a derecha

    La imagen es de 8x8 

*/

function parseImagenData(){

    for (let i = 0; i < gbaImagenData.length; i+=8){
        
        let actualRow = "";
        let count = 0;
        while(actualRow.length < 8){
            const actualData = gbaImagenData[i+count].toString(16).toUpperCase();
            actualRow = (actualData.length < 2 ? "0"+actualData : actualData) + actualRow;
            count++;
        }
        
        finalData.push("0x"+actualRow);
    }

    console.log(finalData);

}
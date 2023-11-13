// Function to convert a File to a byte array (Uint8Array)
function fileToByteArray(file, callback) {
    const reader = new FileReader();
  
    reader.onload = function (event) {
      const arrayBuffer = event.target.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      callback(uint8Array);
    };
  
    reader.readAsArrayBuffer(file);
  }


function getFileExtension(fileName) {
  return `.${fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2)}`;
}



function fileToBase64String(file, callback) {
    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target.result.split(',')[1];
    //   console.log('Base64 string:', base64String);
      callback(base64String);
    };

    reader.readAsDataURL(file);
}

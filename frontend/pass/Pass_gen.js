//functions
// main function to generate pass
function generatePassword(length, includeUppercase, includeNumbers, includeSymbols) {
   var lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
   var uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   var numberChars = '0123456789';
   var symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

   var characterPool = lowercaseChars;

   if (includeUppercase) {
      characterPool += uppercaseChars;
   }
   if (includeNumbers) {
      characterPool += numberChars;
   }
   if (includeSymbols) {
      characterPool += symbolChars;
   }

   var password = '';
   for (var i = 0; i < length; i++) {
      var randomIndex = Math.floor(Math.random() * characterPool.length);
      password += characterPool[randomIndex];
   }

   return password;
}
//function to check the length and dpending on the length change the words
function lenCheck(length){
   var text = document.getElementById("text");
   text.style.display="block";



   if(length>=13){
      text.innerHTML="Great Password!";
      text.style.backgroundColor="#218838";
   }
   else if(length<13 && length>=9){
      text.innerHTML="Weak Password";
      text.style.backgroundColor="#F28048";
      
   }
   else if (length<=8){
      text.innerHTML="Bad Password";
      text.style.backgroundColor="#750708";
   }

}
//---------------------------------------------------------------------------------

//calling functions
document.getElementById('generate').addEventListener('click', function () {
   var length = document.getElementById('length').value;
   var includeUppercase = document.getElementById('includeUppercase').checked;
   var includeNumbers = document.getElementById('includeNumbers').checked;
   var includeSymbols = document.getElementById('includeSymbols').checked;

   var generatedPassword = generatePassword(length, includeUppercase, includeNumbers, includeSymbols);
   document.getElementById('password').value = generatedPassword;

   lenCheck(length);
});

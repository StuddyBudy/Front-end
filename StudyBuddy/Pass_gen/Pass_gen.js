//functions
// main function to generate pass
function generatePassword(length, includeUppercase, includeNumbers, includeSymbols) {
   var lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
   var uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   var numberChars = '0123456789';
   var symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

   var characterPool = lowercaseChars;

   //checks to see the check boxes were selected or not
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
   // loops thru however many times the length is and 
   // sets the password to a random charaters depending on whats selected 

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


   //changes the background of the text depending on the length 
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

   //calls lenCheck function with the length parameter
   lenCheck(length);
});
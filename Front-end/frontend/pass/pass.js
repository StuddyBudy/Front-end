function generatePassword(
  length,
  includeUppercase,
  includeNumbers,
  includeSymbols,
) {
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+[]{}|;:,.<>?";

  let characterPool = lowercaseChars;

  if (includeUppercase) {
    characterPool += uppercaseChars;
  }
  if (includeNumbers) {
    characterPool += numberChars;
  }
  if (includeSymbols) {
    characterPool += symbolChars;
  }

  let password = "";
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * characterPool.length);
    password += characterPool[randomIndex];
  }

  return password;
}
//function to check the length and dpending on the length change the words
function lenCheck(length) {
  const text = document.getElementById("text");
  //text.classList.remove("hidden");

  if (length >= 13) {
    text.style.display = "block";
    text.innerHTML = "Great Password!";
    text.style.backgroundColor = "#218838";
  } else if (length < 13 && length >= 9) {
    text.style.display = "block";
    text.innerHTML = "Weak Password";
    text.style.backgroundColor = "#F28048";
  } else if (length <= 8) {
    text.style.display = "block";
    text.innerHTML = "Bad Password";
    text.style.backgroundColor = "#750708";
  }
  console.log("----");
}

function logs() {
  //  for (let i=0; i>=20; i++){

  conosle.log(" ----- ");
  //}
}

//---------------------------------------------------------------------------------

//calling functions
document.getElementById("generate").addEventListener("click", () => {
  const length = Number(document.getElementById("length").value);
  const includeUppercase = document.getElementById("includeUppercase").checked;
  const includeNumbers = document.getElementById("includeNumbers").checked;
  const includeSymbols = document.getElementById("includeSymbols").checked;
  const generatedPassword = generatePassword(
    length,
    includeUppercase,
    includeNumbers,
    includeSymbols,
  );
  document.getElementById("password").innerText = generatedPassword;

  lenCheck(length);
  //logs();
  navigator.clipboard.writeText(document.getElementById("password").innerText);
});

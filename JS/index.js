/* Her legger vi inn alle elementene fra html på toppen av filen vår
Vi kan hente det inn på flere forskjellige måter. enten via ID eller via en css selector.  */

const colorButton = document.getElementById("colorswapper");
const outputText = document.getElementById("output");
const textInput = document.getElementById("textinput");
const textSwapper = document.querySelector("#textswapper");
const root = document.documentElement;
const bgColor = getComputedStyle(root).getPropertyValue("--bgColor");

const maxDistanceBetweenColors = 300; //En verdi som er "maks distansen" mellom alle rgb verdiene vi har, jo lavere tallet er, jo nærmere kan fargene være hverandre(mindre kontrast mellom fargene.)

/* Her ligger vi inn noen "event listeners" på knappene våre.
event listeneres skal "lytte" etter hvisse events i htmlen vår. 
et "click" event er en event hvor elementet blir "clicket" eller trykket på.  

Vi har også laget en event listener for vinduet i helhet, her kan vi lytte etter vinduspesifikke events som "keydown" events, aka at en tastaturknapp blir trykket på.*/
colorButton.addEventListener("click", () => {
  /* Her sier vi at outputTexten sin farge skal være lik randColor funksjonen vår.  */
  outputText.style.color = randColor();
});
textSwapper.addEventListener("click", () => {
  /* Her sier vi at når vi trykker på textSwapper knappen, så skal vi bruke swapInputText funksjonen vår for å swappe tekstverdien i tekst inputen vår til outputen vår. */
  swapInputText();
});
window.addEventListener("keydown", (event) => {
  /* Her ser vi etter en enter tast, for å kjøre samme swapInputText funksjon. */
  if (event.key === "Enter") swapInputText();
  return;
});

/* Her er en funksjon som genererer en random farge i god kontrast med bakgrunnsfargen i root variablen bgColor. */
function randColor() {
  /* Vi lager et array av rgb verdier av bakgrunnsfargen vår. */
  let backgroundColorArray = splitHexColorString(bgColor.slice(1, 7), 2);

  /* Vi genererer en random fargeverdi */
  let color = (Math.random() * 0xffffff).toString(16);

  /* Vi klipper vekk desimalverdier */
  color = color.split(".")[0];

  /* Vi passer her på å legge på å padde begynnelsen med 0 tall hvis tallet bare har lengde under 6. */
  color.padStart(6, "0");

  /* Vi genererer så et tall array av rgb verdier basert på fargen generert.  */
  let colorArray = splitHexColorString(color, 2);

  /* Vi skjekker distansen (kontrasten) mellom bg color og fargen generert. */
  let distance = calculateColorDistance(colorArray, backgroundColorArray);

  /* Hvis kontrasten er for liten, kjør funksjonen vår på nytt via rekursjon (aka kjøre seg selv på nytt.) */
  if (distance < maxDistanceBetweenColors) return randColor();

  /* Eller returner en tekst streng som representerer css verdien av vår random farge.  */
  return "#" + color;
}

/* Her er en funksjon som swapper teksten i outputText til textInput sin verdi */
function swapInputText() {
  let input = textInput.value;

  /* Her passer vi på å ikke gjøre noe, hvis vår input ikke har noen verdi.  */
  if (input === null || input === "") return;
  outputText.textContent = input;
}

/* Her er en funksjon som tar inn to tall arrays, og kalkulerer "avstanden" mellom de (aka hvor langt fra 0 er totalverdien av de) */
function calculateColorDistance(rgbArray1, rgbArray2) {
  /* Vi starter distansekalkulasjonen vår ved å ha tallet 0. */
  let distanceSum = 0;

  /* vi looper så gjennom ene arrayet */
  for (let i = 0; i < rgbArray1.length; i++) {
    /* Vi tar ene elementet, minus tilsvarende index i andre elementet, for å finne distansen mellom hver fargeverdi. legg merke til Math.abs() for å kunne ignorere + eller - */
    distanceSum += Math.abs(rgbArray1[i] - rgbArray2[i]);
  }

  /* vi returnerer så totaldistansen av hele fargen. */
  return distanceSum;
}

/* Her er en funksjon som tar in en tekstreng som input, og hvor mange karakterer vi skal splitte. */
function splitHexColorString(input, charCount) {
  let outputArr = [];
  /* Her lager vi en loop for å slice ut stykker av input strengen vår. */
  for (let i = 0; i < input.length; i += charCount) {
    let slice = input.slice(i, i + charCount);

    /* Her prøver vi å parse ut slicen til en tallverdi, vi må huske å si til parseint at de skal tolke teksten som et heksadesimalt tall, via 16 tallet. */
    let num = Number.parseInt(slice, 16);
    outputArr.push(num);
  }
  return outputArr;
}

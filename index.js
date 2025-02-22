const lengthDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "#$%&'()*+,-./:;<=>?@[\]^_`\"{|}~";
let password = "";
let passwordLength = 10;
let checkCount = 1;
console.log(inputSlider.style);
handleSlider();
//set passwordLength
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%";
}
//set indicator for indicating strength of password
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRandomInteger(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateRndNum(){
    return getRandomInteger(0,9);
}
function getRandomUppercase(){
    return String.fromCharCode(getRandomInteger(65,91));
}
function getRandomLowecase(){
    return String.fromCharCode(getRandomInteger(97,123));
}
function getRandomSymbol(min,max){
    let index = getRandomInteger(0,29);
    return symbols.charAt(index);
}
function calStrength(){
    let cnt = checkCount;

    if(cnt >= 3 && passwordLength>= 8){
        setIndicator("#0f0");
    }else if(cnt == 2 && passwordLength>= 8){
        setIndicator('#ff0');
    }else{
        setIndicator('#f00');
    }
}
//for copying the genrated password
async function copyContent(){
    try{
        await navigator.clipboard.writeText(password);
        copyMsg.innerText = "copied";
    }catch(e){
        console.log("not copied");
    }
    copyMsg.classList.add("active");
    setTimeout(()=>
    copyMsg.classList.remove("active"),2000);
}
function handleCheckBoxCheck(){
    checkCount = 0;
    allCheckBox.forEach(checkbox => {
        if(checkbox.checked)checkCount++;
    });

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
function generatePassword(){
    if(checkCount<=0)return;
    password = "";
    //let's put the stuff mentioned by checkboxes
    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(getRandomUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(getRandomLowecase);
    }
    if(symbolCheck.checked){
        funcArr.push(getRandomSymbol);
    }
    if(numberCheck.checked){
        funcArr.push(generateRndNum);
    }
    for(let i = 0;i<checkCount;i++){
        password += funcArr[i]();
    }
    for(let i = 0;i<passwordLength-checkCount;i++){
        let fn = getRandomInteger(0,funcArr.length);
        password += funcArr[fn]();
    }
}
function shufflePassword(array){
    //fisher yales method
    for(let i = array.length-1;i>0;i--){
        //finding a random index
        const j = getRandomInteger(0,i+1);
        //swaping the characters
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach(ch=>str+=ch);
    return str;
}


inputSlider.addEventListener("input",(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)copyContent()
});

allCheckBox.forEach(checkbox=>{
    checkbox.addEventListener('change', handleCheckBoxCheck);
})

generateBtn.addEventListener('click',()=>{
    if(checkCount>passwordLength){
        passwordLength = checkCount;
        handleSlider();
    }
    generatePassword();
    calStrength();
    //shulle the password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
})

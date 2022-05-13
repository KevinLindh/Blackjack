//credits from localstorage
if(!localStorage.getItem("credits")){
  localStorage.setItem("credits", 1000)
}  

document.querySelector("#credits").innerText = `Credits: ${localStorage.getItem("credits")}`;

let account = Number(localStorage.getItem("credits"));
let count = 0;
let player = 0;
let dealer = 0;
let bet = 100;

let deckId = "";
let deck = [];
function shuffleDeck(){
fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=7')
    .then(res => res.json()) // parse response as JSON
    .then(data => {
    deckId = data.deck_id
    let url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=312`
 fetch(url)
     .then(res => res.json()) // parse response as JSON
     .then(data => {
       //setting cardValues into an array and access them later in the program
       deck = data.cards;
       document.querySelector("#cardsInDeck").innerText = `Cards left: ${deck.length}`;
     })
     .catch(err => {
         console.log(`error ${err}`)
     });
    })
    .catch(err => {
    console.log(`error ${err}`)
  });
}
 
  function cardVal(val){
    if(val === "ACE"){
      return 11
    }else if (val === "KING"){
      return 10
    }else if(val === "QUEEN"){
      return 10
    }else if(val === "JACK"){
      return 10
    }else{
      return Number(val)
    }
   }

  function addCredits(){
   account = Number(account) + 1000;
   localStorage.setItem("credits", account);
   document.querySelector("#credits").innerText = `Credits: ${localStorage.getItem("credits")}`
  }
  
  function increaseBet(){
   if(bet < account){
     bet += 100;
     document.querySelector("#betSize").innerText = `Bet Size: ${bet}`;
   }
  }
 
  function decreaseBet(){
    if(bet > 100){
   bet -= 100;
   document.querySelector("#betSize").innerText = `Bet Size: ${bet}`;
    }
  }

  function renderCards(){
    if(deck.length < 20){
      alert("Game requires reshuffle!");
      return;
    }
    document.querySelector("#cardsInDeck").innerText = `Cards left: ${deck.length}`;
   const dealerDOM = document.getElementById("dealer-Cards");
   const playerDOM = document.getElementById("player-Cards");
   while(dealerDOM.firstChild) {
     dealerDOM.removeChild(dealerDOM.firstChild);
   }
   while(playerDOM.firstChild) {
   playerDOM.removeChild(playerDOM.firstChild);
   }
   
   //setting the basic cards for player and dealer
   while(count < 2){
     let elem = document.createElement("img"); 
     elem.src = deck[count].image;
     document.querySelector("#player-Cards").append(elem);
     player += cardVal(deck[count].value);
     removeCard();
     count++;
   }
 
   while(count < 3){
     let elem = document.createElement("img"); 
     elem.src = deck[count].image
     document.querySelector("#dealer-Cards").append(elem)
     dealer += cardVal(deck[count].value);
     removeCard();
     count++;
   }
 
   document.querySelector("#player-Count").innerText = `Count: ${player}`
   document.querySelector("#dealer-Count").innerText = `Count: ${dealer}`
 
   //if player gets blackjack
   if(player === 21){
     while(dealer < 21){
       //call card until blackjack or over
       dealer += cardVal(deck[count].value);
       let elem = document.createElement("img"); 
       elem.src = deck[count].image;
       document.querySelector("#dealer-Cards").append(elem);
       removeCard();
       count++;
     }
     if(dealer === 21){
       result("TIE");
     } else{
       result("WIN")
     }
   }
  }

  function hit(){
   if(player < 21){ 
     player += cardVal(deck[count].value);
     let elem = document.createElement("img"); 
     elem.src = deck[count].image;
     document.querySelector("#player-Cards").append(elem);
     document.querySelector("#player-Count").innerText = `Count: ${player}`;
     removeCard();
     count++;
   }
   if(player === 21){
     stay();
   }
   if(player > 21){
     result("LOSE")
   }
  }
 
  function stay(){
   while(dealer < player){
     dealer += cardVal(deck[count].value);
     let elem = document.createElement("img"); 
     elem.src = deck[count].image;
     document.querySelector("#dealer-Cards").append(elem);
     document.querySelector("#dealer-Count").innerText = `Count: ${dealer}`
     removeCard();
     count++;
   }
   if(dealer > 21){
     result("WIN")
   } else{
     result("LOSE")
   }
  }

  function result(outcome){
    if(outcome === "WIN"){
     account += bet;
     localStorage.setItem("credits", account);
     document.querySelector("#credits").innerText = `Credits: ${localStorage.getItem("credits")}`
     alert("WIN")
    } else if(outcome === "LOSE"){
     account -= bet;
     localStorage.setItem("credits", account);
     document.querySelector("#credits").innerText = `Credits: ${localStorage.getItem("credits")}`
     alert("LOSE")
    } else {
      alert("TIE")
    }
    count = 0;
    dealer = 0;
    player = 0;
    if(account <= 0){
      alert("insufficient funds!");
      bet = 0;
      document.querySelector("#betSize").innerText = `Bet Size: ${bet}`;
    }
    if(deck.length < 20){
      alert("Auto reshuffling cards!");
    }
  }

  function removeCard(){
    deck.shift();
  }

//shuffle deck
document.querySelector("#shuffle").addEventListener("click", shuffleDeck)

//buttons increase/decrease bet
document.querySelector("#addCredits").addEventListener("click", addCredits)
document.querySelector("#increase").addEventListener("click", increaseBet)
document.querySelector("#decrease").addEventListener("click", decreaseBet)

document.querySelector('#dealCards').addEventListener('click', renderCards)

document.querySelector("#hit").addEventListener("click", hit);
document.querySelector("#stay").addEventListener("click", stay);
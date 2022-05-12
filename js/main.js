//Get the deck
//localstorage and random deck id

class Game{
  constructor(credits, deck){
    this.credits = credits
    this.deck = deck
    this.count = 0
    this.player = 0
    this.dealer = 0
    this.bet = 100
    this.deckId = ""
  }
 addcredits(){
  this.credits = credits + 1000;
  localStorage.setItem("credits", this.credits);
  document.querySelector("#credits").innerText = `Credits: ${localStorage.getItem("credits")}`
 }
 
 increaseBet(){
  if(this.bet < this.credits){
    this.bet += 100;
    document.querySelector("#betSize").innerText = `Bet Size: ${this.bet}`;
  }
 }

 decreaseBet(){
  this.bet -= 100;
  document.querySelector("#betSize").innerText = `Bet Size: ${this.bet}`;
 }

 renderCards(){
  //fetch new Deck
  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
    this.deckId = data.deck_id
    })
    .catch(err => {
    console.log(`error ${err}`)
  });
setTimeout(() => {
 let url = `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=30`
 fetch(url)
     .then(res => res.json()) // parse response as JSON
     .then(data => {
       //setting cardValues into an array and access them later in the program
       this.deck = data.cards;
       console.log(this.deck);
     })
     .catch(err => {
         console.log(`error ${err}`)
     });

  const dealer = document.getElementById("dealer-Cards");
  const player = document.getElementById("player-Cards");
  while(dealer.firstChild) {
    dealer.removeChild(dealer.firstChild);
  }
  while(player.firstChild) {
  player.removeChild(player.firstChild);
  }
  
  //setting the basic cards for player and dealer
  while(this.count < 2){
    let elem = document.createElement("img"); 
    elem.src = this.deck[this.count].image
    document.querySelector("#player-Cards").append(elem)
    this.player += cardValue(this.deck[this.count].value)
    this.count++;
  }

  while(this.count < 3){
    let elem = document.createElement("img"); 
    elem.src = this.deck[this.count].image
    document.querySelector("#dealer-Cards").append(elem)
    this.dealer += cardValue(this.deck[this.count].value);
    this.count++;
  }

  document.querySelector("#player-Count").innerText = `Count: ${this.player}`
  document.querySelector("#dealer-Count").innerText = `Count: ${this.dealer}`

  //if player gets blackjack
  if(this.player === 21){
    while(this.dealer < 21){
      //call card until blackjack or over
      this.dealer += cardValue(this.deck[this.count].value);
      let elem = document.createElement("img"); 
      elem.src = this.deck[this.count].image;
      document.querySelector("#dealer-Cards").append(elem);
      this.count++;
    }
    if(this.dealer === 21){
      this.result("TIE");
    } else{
      this.result("WIN")
    }
  }
  }, 350);
 }

 hit(){
   console.log(this.deck)
   console.log(this.count)
  if(this.player < 21){ 
    this.player += cardValue(this.deck[this.count].value);
    let elem = document.createElement("img"); 
    elem.src = this.deck[this.count].image;
    document.querySelector("#player-Cards").append(elem);
    document.querySelector("#player-Count").innerText = `Count: ${this.player}`;
    this.count++;
  }
  if(this.player === 21){
    this.stay();
  }
  if(this.player > 21){
    this.result("LOSE")
  }
 }

 stay(){
  while(this.dealer < this.player){
    //call card until blackjack or over
    this.dealer += cardValue(this.deck[this.count].value);
    let elem = document.createElement("img"); 
    elem.src = this.deck[this.count].image;
    document.querySelector("#dealer-Cards").append(elem);
    document.querySelector("#dealer-Count").innerText = `Count: ${this.dealer}`
    this.count++;
  }
  if(this.dealer > 21){
    this.result("WIN")
  } else{
    this.result("LOSE")
  }
 }

 result(outcome){
   if(outcome === "WIN"){
    this.credits += this.bet;
    localStorage.setItem("credits", this.credits);
    document.querySelector("#credits").innerText = `Credits: ${localStorage.getItem("credits")}`
    alert("WIN")
   } else if(outcome === "LOSE"){
    this.credits -= this.bet;
    localStorage.setItem("credits", this.credits);
    document.querySelector("#credits").innerText = `Credits: ${localStorage.getItem("credits")}`
    alert("LOSE")
   } else {
     alert("TIE")
   }
   this.count = 0;
   this.dealer = 0;
   this.player = 0;
 }

 cardVal(){
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
}

//credits from localstorage
if(!localStorage.getItem("credits")){
  localStorage.setItem("credits", 1000)
}  

let credits = localStorage.getItem("credits");
document.querySelector("#credits").innerText = `Credits: ${localStorage.getItem("credits")}`;

const blackJack = new Game(credits, [], 0, 0, 0, 100);

//buttons increase/decrease bet
document.querySelector("#increase").addEventListener("click", blackJack.increaseBet)
document.querySelector("#decrease").addEventListener("click", blackJack.decreaseBet)

document.querySelector('#dealCards').addEventListener('click', blackJack.renderCards)

document.querySelector("#hit").addEventListener("click", blackJack.hit);
document.querySelector("#stay").addEventListener("click", blackJack.stay);


//Get the deck
//localstorage and random deck id
let deckId = ''
if(!localStorage.getItem("credits")){
  localStorage.setItem("credits", 1000)
} else {
}

document.querySelector("#credits").innerText = `Credits: ${localStorage.getItem("credits")}`
document.querySelector("#addCredits").addEventListener("click", add1000);

function add1000(){
  let added = Number(localStorage.getItem("credits")) + 1000;
  localStorage.setItem("credits", added);
  document.querySelector("#credits").innerText = `Credits: ${localStorage.getItem("credits")}`
}
let bet = 100;
document.querySelector("#betSize").innerText = `Bet Size: ${bet}`;

document.querySelector("#increase").addEventListener("click", increase)

function increase(){
  if(bet < localStorage.getItem("credits")){
  bet += 100;
  document.querySelector("#betSize").innerText = `Bet Size: ${bet}`;
  }
}

document.querySelector("#decrease").addEventListener("click", decrease)
function decrease(){
  if(bet >= 100){
  bet -= 100;
  document.querySelector("#betSize").innerText = `Bet Size: ${bet}`;
  }
}



fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        deckId = data.deck_id
      })
      .catch(err => {
          console.log(`error ${err}`)
      });


document.querySelector('#dealCards').addEventListener('click', getFetch)


function getFetch(){
  
  const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=20`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        //setting cardValues into an array and access them later in the program
        let cardVal = [];
        let count = 0;
        let dealerCount = 0;
        let playerCount = 0;

        let dealer = document.getElementById("dealer-Cards");
        let player = document.getElementById("player-Cards");
        while(dealer.firstChild) {
          dealer.removeChild(dealer.firstChild);
        }
        while(player.firstChild) {
        player.removeChild(player.firstChild);
        }

        for(let i = 0; i < 20; i++){
          cardVal.push((data.cards[i]))
        }
        //setting the basic cards for player and dealer
        while(count < 2){
          let elem = document.createElement("img"); 
          elem.src = cardVal[count].image
          document.querySelector("#player-Cards").append(elem)
          count++;
        }

        playerCount = Number(cardValue(cardVal[0].value)) + Number(cardValue(cardVal[1].value));
        console.log(playerCount);
        while(count < 3){
          let elem = document.createElement("img"); 
          elem.src = cardVal[count].image
          document.querySelector("#dealer-Cards").append(elem)
          count++;
        }
        dealerCount = Number(cardValue(cardVal[2].value));
        //add buttons for stopping and taking more cards
      
        //if player gets blackjack
        if(playerCount === 21){
          while(dealerCount < 21){
            //call card until blackjack or over
            dealerCount += Number(cardValue( cardVal[count].value ));
            let elem = document.createElement("img"); 
            elem.src = cardVal[count].image
            document.querySelector("#dealer-Cards").append(elem)
            count++;
          }
          if(dealerCount === 21){
          } else{
            win();
          }
          
        }
        document.querySelector("#player-Count").innerText = `Count: ${playerCount}`
        document.querySelector("#dealer-Count").innerText = `Count: ${dealerCount}`
    
        //Hit function
        document.querySelector("#hit").addEventListener("click", hitPlayer);
        function hitPlayer(){
          if(playerCount < 21){ 
            playerCount += Number(cardValue(cardVal[count].value));
            let elem = document.createElement("img"); 
            elem.src = cardVal[count].image;
            document.querySelector("#player-Cards").append(elem);
            document.querySelector("#player-Count").innerText = `Count: ${playerCount}`;
            count++;
          }
          if(playerCount === 21){
            //call STAY function
            stay();
          }
          if(playerCount > 21){
            lose();
          }
        }

        //Stay function
        document.querySelector("#stay").addEventListener("click", stay);

        function stay(){
          console.log(playerCount)
          while(dealerCount < playerCount){
            //call card until blackjack or over
            dealerCount += Number(cardValue(cardVal[count].value));
            let elem = document.createElement("img"); 
            elem.src = cardVal[count].image
            document.querySelector("#dealer-Cards").append(elem)
            document.querySelector("#dealer-Count").innerText = `Count: ${dealerCount}`
            count++;
          }
          if(dealerCount > 21){
            win();
          } else{
            lose();
          }
        }

        function win(){
          console.log("win")
          let win = Number(localStorage.getItem("credits")) + bet;
          localStorage.setItem("credits", win);
          document.querySelector("#credits").innerText = `Credits: ${localStorage.getItem("credits")}`
        }

        function lose(){
          console.log("lose")
          let loss = Number(localStorage.getItem("credits")) - bet;
            localStorage.setItem("credits", loss);
            document.querySelector("#credits").innerText = `Credits: ${localStorage.getItem("credits")}`
        }

        if(data.remaining < 20){
          fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
          .then(res => res.json()) // parse response as JSON
          .then(data => {
          deckId = data.deck_id
        })
      .catch(err => {
          console.log(`error ${err}`)
      });
        }
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

        
//if previous values contains 11 then if value goes over 21 set value to 1
//make an array from where to get the values
//if pressed stop let dealer get cards instead and then end

function cardValue(val){
  if(val === "ACE"){
    return 11
  }else if (val === "KING"){
    return 10
  }else if(val === "QUEEN"){
    return 10
  }else if(val === "JACK"){
    return 10
  }else{
    return val
  }
}
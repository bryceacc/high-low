var readlineSync = require('readline-sync');

(function main() {
   var numPlayers = process.argv[2]; 
   var cards = [];
   var rankGuess1 = [];
   var rankGuess2 = [];
   var valueGuess = [];

   if(numPlayers > 12) {
      throw new Error("Sorry, can't play with this many players");
   }

   //generate cards for all the players
   for (var x = 0; x < numPlayers; x++) {
      var temp = Math.floor(Math.random() * 13 + 1);
      //dont allow multiples of same cards
      while(cards.indexOf(temp) != -1)
         temp = Math.floor(Math.random() * 13 + 1);
      
      cards.push(temp);
   }

   //debug
   console.log(cards);

   //first round, rank guess 1
   for (var x = 0; x < numPlayers; x++) {
      var tempCards = cards.slice(0);
      tempCards.splice(x, 1);
      console.log("Player " + (x+1) + ": you see " + tempCards.toString());
      rankGuess1.push(readlineSync.question("What do you think your rank is? "));
   }
   console.log("\nPlayer guesses are: " + rankGuess1.toString() + "\n");
   
   //second round, rank guess 2 and value
   for (var x = 0; x < numPlayers; x++) {
      var tempCards = cards.slice(0);
      tempCards.splice(x, 1);
      console.log("Player " + (x+1) + ": you see " + tempCards.toString());
      rankGuess2.push(readlineSync.question("What do you think your rank is? "));
      valueGuess.push(readlineSync.question("And what do you think your value is? "));
      console.log("Your card is a..." + cards[x] + "!  " + (valueGuess[x] == cards[x] ? "Congrats!" : "Too bad..."));
   }

   //debugs
   console.log("\n\nDebug\nValues are: " + cards.toString());
   console.log("Player rank guesses are: " + rankGuess2.toString());
   console.log("Player value guesses are: " + valueGuess.toString());
})();
import seedrandom from 'seedrandom';

export function shuffle(array: any[], seed: string) {
    let currentIndex = array.length;
    
    // Use a seeded random number generator
    const rng = seedrandom(seed);
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(rng() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }
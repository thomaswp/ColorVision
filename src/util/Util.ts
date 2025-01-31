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

export class EventEmitter<T> {
    private listeners: ((arg: T) => void)[] = [];

    addListener(listener: (arg: T) => void) {
        this.listeners.push(listener);
    }

    removeListener(listener: (arg: T) => void) {
        const index = this.listeners.indexOf(listener);
        if (index >= 0) {
            this.listeners.splice(index, 1);
        }
    }

    emit(arg: T) {
        for (let listener of this.listeners) {
            listener(arg);
        }
    }
}
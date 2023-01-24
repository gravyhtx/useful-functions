//* LINEAR CONGRUENTIAL PSEUDO-RANDOM NUMBER GENERATOR
export function prng(seed: number) {
  const a = 1103515245;
  const c = 12345;
  const m = Math.pow(2, 31);

  return function() {
    seed = (a * seed + c) % m;
    return seed / m;
  };
}

//* Create a PRNG with a seed of 1
//? const randNum = prng(1);

//* Generate 10 pseudo-random numbers
//? for (let i = 0; i < 10; i++) {
//?   console.log(prng());
//? }
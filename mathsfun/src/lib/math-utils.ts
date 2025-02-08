export const generateFibonacciSequence = (length: number): number[] => {
  if (length < 2) return [0, 1];
  const sequence = [0, 1];
  for (let i = 2; i < length; i++) {
    sequence.push(sequence[i-1] + sequence[i-2]);
  }
  return sequence;
}; 
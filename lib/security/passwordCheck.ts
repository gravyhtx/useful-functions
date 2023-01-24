export function calculateEntropy(password: string): number {
  // Determine the set of possible characters in the password
  const charSet = new Set(password);
  // Calculate the number of possible characters
  const charCount = charSet.size;
  // Calculate the entropy of the password using the formula:
  // entropy = passwordLength * log2(charCount)
  const entropy = password.length * Math.log2(charCount);
  return entropy;
}
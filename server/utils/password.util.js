const bcrypt = require("bcryptjs");

/**
 * Generate a hashed password using bcrypt.
 *
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} - A promise that resolves with the hashed password.
 */
const generatePassword = async (password) => {
  // Generate a salt to use during the hashing process
  const salt = await bcrypt.genSaltSync(10);

  // Hash the password using the generated salt
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

/**
 * Verify if the entered password matches the existing password using bcrypt.
 *
 * @param {string} enteredPassword - The password entered by the user.
 * @param {string} existingPassword - The existing password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, false otherwise.
 */
const comparePassword = async (enteredPassword, existingPassword) => {
  // Compare the entered password with the existing password using bcrypt
  const isMatch = await bcrypt.compare(enteredPassword, existingPassword);

  return isMatch;
};

module.exports = {
  generatePassword,
  comparePassword,
};

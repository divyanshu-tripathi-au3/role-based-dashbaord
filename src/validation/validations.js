const Validator = require("validator");
const isEmpty = require('./is-Empty')

const validateEmailInput = data => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";

  if (!Validator.isEmail(data.email)) errors.email = "Invalid Email format!"
  if (Validator.isEmpty(data.email)) errors.email = "Email is required";

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

const validateUserData = data => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  // data.name = !isEmpty(data.name) ? data.name : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) errors.email = "Invalid Email format!"
  if (Validator.isEmpty(data.email)) errors.email = "Email is required";
  
  // if (Validator.isEmpty(data.name)) errors.name = "Name is required";
  
  if (!Validator.isStrongPassword(data.password)) errors.password = "Invalid Password! Min length 8 with 1 uppercase, lowercase, number and symbol"
  if (Validator.isEmpty(data.password)) errors.password = "Password is required";

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

const verifyUser = data => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.code = !isEmpty(data.code) ? data.code : "";

  if (!Validator.isEmail(data.email)) errors.email = "Invalid Email format!"
  if (Validator.isEmpty(data.email)) errors.email = "Email is required";

  if (Validator.isEmpty(data.code)) errors.code = "Code is required";

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

const verifyLoginData = data => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) errors.email = "Invalid Email format!"
  if (Validator.isEmpty(data.email)) errors.email = "Email is required";

  if (Validator.isEmpty(data.password)) errors.password = "Password is required";

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

const validateUserInput = data => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.role = !isEmpty(data.role) ? data.role : "";
  data.name = !isEmpty(data.name) ? data.name : "";

  if (!Validator.isEmail(data.email)) errors.email = "Invalid Email format!"
  if (Validator.isEmpty(data.email)) errors.email = "Email is required";

  const isValidRoles = data.role.split(',').filter(elm => !Validator.isIn(elm, ['admin', 'developer', 'legal', 'analyst', 'support']))
  if(isValidRoles.length) errors.role = 'Invalid Role'
  if (Validator.isEmpty(data.role)) errors.role = "Role is required";
  // if (!Validator.isStrongPassword(data.password)) errors.password = "Invalid Password! Min length 8 with 1 uppercase, lowercase, number and symbol"
  if (Validator.isEmpty(data.name)) errors.name = "Name is required";


  return {
    errors,
    isValid: isEmpty(errors)
  }
}

const validateUserConfirmation = data => {
  let errors = {};

  data.userId = !isEmpty(data.userId) ? data.userId : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isStrongPassword(data.password)) errors.password = "Invalid Password!Invalid Password! Min length 8 with one each uppercase, lowercase, number and symbol"
  if (Validator.isEmpty(data.password)) errors.password = "Password is required";

  if (Validator.isEmpty(data.userId)) errors.userId = "User Id is required";

  return {
    errors,
    isValid: isEmpty(errors)
  }
}


const validateCode = data => {
  let errors = {};

  data.code = !isEmpty(data.code) ? data.code : "";  
  // data.email = !isEmpty(data.email) ? data.email : "";

  if (Validator.isEmpty(data.code)) errors.code = "Code is required";
  // if (Validator.isEmpty(data.email)) errors.email = "Email is required";

  return {
    errors,
    isValid: isEmpty(errors)
  }
}


const validateForgetPasswordInput = data => {
  let errors = {};

  // data.code = !isEmpty(data.code) ? data.code : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.email = !isEmpty(data.email) ? data.email : "";

  if (!Validator.isStrongPassword(data.password)) errors.password = "Invalid Password!"
  if (Validator.isEmpty(data.password)) errors.password = "Password is required";

  // if (Validator.isEmpty(data.code)) errors.code = "Code is required";

  if (Validator.isEmpty(data.email)) errors.email = "Email is required";

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

const editUser = data => {
   let errors = {};

  data.role = !isEmpty(data.role) ? data.role : "";
  data.userId = !isEmpty(data.userId) ? data.userId : "";

  
  const isValidRoles = data.role.split(',').filter(elm => !Validator.isIn(elm, ['admin', 'developer', 'legal', 'analyst', 'support']))
  if(isValidRoles.length) errors.role = 'Invalid Role'
  if (Validator.isEmpty(data.role)) errors.role = "Role is required";
  
  if (Validator.isEmpty(data.userId)) errors.userId = "userId is required";


  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = {
  validateEmailInput,
  validateUserData,
  verifyUser,
  verifyLoginData,
  validateUserInput,
  validateUserConfirmation,
  validateCode,
  validateForgetPasswordInput,
  editUser
}
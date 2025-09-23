export const validateEmail = (email) => {
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (email === "" || email.trim() === "") {
    return "Email is required";
  } else if (!re.test(email.toLowerCase())) {
    return "Invalid email format";
  }
  return null;
};

export const validatePassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (password === "") {
    return "Password is required";
  } else if (!regex.test(password)) {
    return "Invalid password format";
  } else {
    return null;
  }
};

export const validateName = (label,name) => {
  const regex = /^[A-Za-z\s]+$/;
  if (name === "" || name.trim() === "") {
    return  `${label} is required`;
  } else if (!regex.test(name)) {
    return `${label} must contain only alphabets and space`;
  } else {
    return null;
  }
};

export const validateOptionalName = (label,name) => {
  const regex = /^[A-Za-z\s]+$/;
  if (name === "" || name.trim() === "") {
    return null;
  } else if (!regex.test(name)) {
    return `${label} must contain only alphabets and space`;
  } else {
    return null;
  }
};

export const validatePhoneNumber = (phNumber)=>{
  if(!phNumber) return null;
  if(phNumber.length<10){
    return "Invalid phone number";
  }
  else return null;
}

export const validateSkills =(skills)=>{
  if(!skills || skills.length===0) return null;
  if(skills.length>10){
    return "You can add upto 10 skills only";
  }
  else return null;
}

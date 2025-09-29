export const validateEmail = (email) => {
  const re = /^[\w.+-.]+@([\w-]+\.)+[\w-]{2,4}$/;
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
  if(!phNumber) return `phone number is required`;
  if(phNumber.length<10){
    return "Invalid phone number";
  }
  else return null;
}

export const validateSkills =(skills)=>{
  if(!skills || skills.length===0) return 'skills is required';
  if(skills.length>10){
    return "You can add upto 10 skills only";
  }
  else return null;
}

export const validateField = (label,field)=>{
  if(!field || field.trim()===''){
    return `${label} is required`;
  }
  else return null;
}


export const validateOptions = (options) => {
  if (!Array.isArray(options)) {
    return 'Options should be an array';
  }

  const filledCount = options.filter(opt => opt.title?.trim()).length;

  if (filledCount < 2) {
    return 'At least two options must have a title';
  }

  return null;
};


export const validateDate = (label,date)=>{
  if(!date){
    return `${label} must be required`;
  }
  if(date.getMinutes() ===0){
    return `${label} atleast minutes`
  }
  else return null;
}

export const validateTestQuestions = (questions) => {
  if (!questions || questions.length === 0) {
    return "Choose previous test questions or create at least one question.";
  }

  for (let qIndex = 0; qIndex < questions.length; qIndex++) {
    const q = questions[qIndex];

    if (!q.qtitle || q.qtitle.trim() === "") {
      return `Question ${qIndex + 1}: Title is required.`;
    }

    if (!q.options || q.options.length < 2) {
      return `Question ${qIndex + 1}: At least 2 options are required.`;
    }

    for (let oIndex = 0; oIndex < q.options.length; oIndex++) {
      const opt = q.options[oIndex];
      if (!opt.title || opt.title.trim() === "") {
        return `Question ${qIndex + 1}: Option ${oIndex + 1} cannot be empty.`;
      }
    }

    const correctOptions = q.options.filter((opt) => opt.isCorrect);
    if (q.isMultiSelect) {
      if (correctOptions.length === 0) {
        return `Question ${qIndex + 1}: At least one correct option must be selected.`;
      }
    } else {
      if (correctOptions.length !== 1) {
        return `Question ${qIndex + 1}: Exactly one correct option must be selected.`;
      }
    }
  }

  return null;
};

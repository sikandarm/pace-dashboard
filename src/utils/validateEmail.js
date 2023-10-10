export const validateEmail = (login) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(login.email)) {
      return { success: false, message: 'Enter a valid Email' };
    }
    if (login.password.length < 5) {
      return {
        success: false,
        message: 'Password should contain minimum 8 character',
      };
    }
    if (login.password.length > 20) {
      return {
        success: false,
        message: 'Password should contain maximum 20 character ',
      };
    }
    return { success: true };
  };
import { useSelector } from 'react-redux';

// Create a functional component to access the loginUser data
const useAccessToken = () => {
  // Use useSelector to access the loginUser data from the Redux store
  const token = useSelector((state) => state.userSlice.token);

  // Extract the token from the loginUser data and return it
  return token ? token : null;
};

// Export the functional component to be used wherever you need to access the token
export default useAccessToken;

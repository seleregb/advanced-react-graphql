import styled from 'styled-components';
import Signup from '../components/Signup';
import SignIn from '../components/Signin';
import RequestReset from '../components/RequestReset';

const Columns = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 20px; 
`;

 const SignupPage = (props) =>{
  return (
    <Columns>
      <Signup />
      <SignIn />
      <RequestReset />
    </Columns>
  )
}
export default SignupPage;
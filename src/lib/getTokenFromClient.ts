import { authClient } from './auth-client';

const getTokenFromClient = async () => {
   const {data, error} = await authClient.token()
   const token = data?.token
   return token
};

export default getTokenFromClient;

// headers:{
//     authorization: `Bearer ${token}`
// }
import React from 'react';
import Amplify from 'aws-amplify';
import MainNav from "./src/navigators";
import {appConfig} from "./src/app-config";

Amplify.configure({
    Auth: {
        identityPoolId: 'IDENTITY_POOL_ID',
        region: 'REGION',
        userPoolId: 'USER_POOL_ID',
        userPoolWebClientId: 'CLIENT_ID',
    },
    API: {
        endpoints: [
            {
                name: appConfig.endpoint.name,
                endpoint: 'API_ENDPOINT',
                region: 'REGION'
            },
        ]
    }
});

class App extends React.Component {
  render() {
      return <MainNav/>
  }
}

export default App;
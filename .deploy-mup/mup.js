module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '47.254.91.165',
      username: 'root',
      // pem: './path/to/pem'
      password: 'monetware2018@sh'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    // TODO: change app name and path
    name: 'mturk-demo',
    path: '/Users/liujiaqi/Git/mengtai/tutorial',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'https://47.254.91.165:3001',
      MONGO_URL: 'mongodb://admin:delia13@ds121982.mlab.com:21982/mturk-delia',
      MONGO_OPLOG_URL: 'mongodb://admin:delia13@ds121982.mlab.com:21982/mturk-delia',
    },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'abernix/meteord:node-8.4.0-base',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  // mongo: {
  //   version: '3.4.1',
  //   servers: {
  //     one: {}
  //   }
  // },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  // proxy: {
  //   domains: 'mywebsite.com,www.mywebsite.com',

  //   ssl: {
  //     // Enable Let's Encrypt
  //     letsEncryptEmail: 'email@domain.com'
  //   }
  // }
};

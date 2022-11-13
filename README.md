<br>
    <div align="center">
        <h1>simple-firebase</h1>
        <p>A simple wrapper of Firebase database</p>
    </div>
<br>

## 🚀 › Installation
```sh-session
npm install simple-firebase
yarn add simple-firebase
pnpm add simple-firebase
```
> ⚠ -> Node.js 16.6.0 or newer is required.

## 📡 › Connecting

> First Option:
```js
const { Firebase } = require('simple-firebase');
// For ESM -> import { Firebase } from 'simple-firebase';

const db = new Firebase({
  apiKey: '...',
  authDomain: '...',
  databaseURL: '...',
  projectId: '...',
  storageBucket: '...',
  messagingSenderId: '...',
  appId: '...'
  measurementId: '...'
});
```

> Second Option:
```js
const { Firebase } = require('simple-firebase');
// For ESM -> import { Firebase } from 'simple-firebase';

const db = new Firebase({
  apiKey: '...',
  databaseURL: '...'
});
```

## 🎈 › Functions

```js
(async() => {
    await db.ping();
    await db.get('path');
    await db.del('path');
    await db.type('path');
    await db.set('path', 'value');
    await db.add('path', 'number');
    await db.sub('path', 'number');
    await db.push('path', 'value');
    await db.update('path', 'value')
})();
```


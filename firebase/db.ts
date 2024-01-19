import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyCULWAg8_0OkXG0_p98XbqUJGYLN1FmNKI',
  authDomain: 'daibl-auth.firebaseapp.com',
  databaseURL: 'https://daibl-auth-default-rtdb.firebaseio.com',
  projectId: 'daibl-auth',
  storageBucket: 'daibl-auth.appspot.com',
  messagingSenderId: '426743551627',
  appId: '1:426743551627:web:56136df10c038f7c49a68e',
  measurementId: 'G-QBJRW1MRRJ'
}

const firebaseApp = initializeApp(firebaseConfig)
const db = getDatabase(firebaseApp)

export default db
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import Navbar from '../../components/Navbar/Navbar'
import styles from './Login.module.css'

const Login = () => {
  const [admissionNumber, setAdmissionNumber] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError('')
    const q = query(collection(db, 'students'), where('Admissionnumber', '==', admissionNumber))
    const snapshot = await getDocs(q)
    if (snapshot.empty) {
      setError('Invalid Admission Number')
      return
    }
    const docSnap = snapshot.docs[0]
    const data = docSnap.data()
    if (data.Name !== name) {
      setError('Name does not match')
      return
    }
    navigate(`/studentcard/${docSnap.id}`)
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Student Login</h2>
        <input
          type="text"
          placeholder="Admission Number"
          value={admissionNumber}
          onChange={e => setAdmissionNumber(e.target.value)}
          className={styles.inputBox}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className={styles.inputBox}
        />
        {error && <p className={styles.errorText}>{error}</p>}
        <button onClick={handleSubmit} className={styles.button}>Submit</button>
      </div>
    </div>
  )
}

export default Login

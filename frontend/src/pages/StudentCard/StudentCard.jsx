import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc, getDocs, collection } from 'firebase/firestore'
import { db } from '../../firebase'
import Navbar from '../../components/Navbar/Navbar'
import QRCode from 'react-qr-code'
import styles from './StudentCard.module.css'

const StudentCard = () => {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [boardingMap, setBoardingMap] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const sSnap = await getDoc(doc(db, 'students', id))
      if (sSnap.exists()) setStudent(sSnap.data())
      const bpSnap = await getDocs(collection(db, 'boardingpoints'))
      const map = {}
      bpSnap.docs.forEach(d => {
        const data = d.data()
        map[data.code] = data.name
      })
      setBoardingMap(map)
    }
    fetchData()
  }, [id])

  if (!student) return null

  const isPaid = student.fullypaid === 1 || (student.partiallypaid && student.partiallypaid > 0)

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.qrWrapper}>
            <QRCode value={id} size={120} />
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Admission No:</span>
            <span className={styles.value}>{student.Admissionnumber}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Name:</span>
            <span className={styles.value}>{student.Name}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Department:</span>
            <span className={styles.value}>{student.Department}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Semester:</span>
            <span className={styles.value}>{student.Semester}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Boarding Point:</span>
            <span className={styles.value}>{boardingMap[student.busPoint] || student.busPoint}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Fee Status:</span>
            <span className={isPaid ? styles.paid : styles.unpaid}>
              {isPaid ? 'Paid' : 'Not Paid'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentCard

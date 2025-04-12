import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc, getDocs, collection, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import Navbar from '../../components/Navbar/Navbar'
import QRCode from 'react-qr-code'
import styles from './StudentCard.module.css'

const StudentCard = () => {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [boardingMap, setBoardingMap] = useState({})
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [showModal, setShowModal] = useState(false)

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

  const isPaid = student?.fullypaid === 1 || (student?.partiallypaid && student.partiallypaid > 0)

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (!file || file.size > 100 * 1024) return alert('Image must be under 100KB')
    setSelectedFile(file)
    setShowModal(true)
  }

  const uploadImage = async () => {
    if (!selectedFile) return
    setUploading(true)
    setShowModal(false)

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('upload_preset', 'student_images')

    const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    if (data.secure_url) {
      await updateDoc(doc(db, 'students', id), { image: data.secure_url })
      setStudent(prev => ({ ...prev, image: data.secure_url }))
    }

    setUploading(false)
    setSelectedFile(null)
  }

  if (!student) return null

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.imageQrContainer}>
            <div className={styles.imageBox}>
              {student.image ? (
                <img src={student.image} alt="Student" className={styles.uploadedImage} />
              ) : (
                !uploading && (
                  <label className={styles.uploadPrompt}>
                    Upload Image less than 100kb
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.hiddenInput}
                      onChange={handleFileChange}
                    />
                  </label>
                )
              )}
              {uploading && <div className={styles.uploadingText}>Uploading...</div>}
            </div>
            <div className={styles.qrWrapper}>
              <QRCode value={id} size={120} />
            </div>
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
            <span className={isPaid ? styles.paid : styles.unpaid}>{isPaid ? 'Paid' : 'Not Paid'}</span>
          </div>
          <p className={styles.securityNote}>Digitally secured & encrypted</p>
          </div>
      </div>

      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <p className={styles.modalText}>Are you sure you want to upload this image?The Action cannot be undone, the image cannot be deleted or updated</p>
            <div className={styles.modalButtons}>
              <button className={styles.yesButton} onClick={uploadImage}>Yes</button>
              <button className={styles.noButton} onClick={() => setShowModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentCard

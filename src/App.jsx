import { useState } from 'react'
import './App.css'

function App() {
  const [images, setImages] = useState([])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const imageUrls = files.map(file => URL.createObjectURL(file))
    setImages(prev => [...prev, ...imageUrls])
  }

  return (
    <div className="app">
      <h1>Amazon画像編集ツール</h1>
      <div className="upload-section">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          id="file-input"
        />
        <label htmlFor="file-input" className="upload-btn">
          画像をアップロード
        </label>
      </div>
      <div className="image-grid">
        {images.map((img, index) => (
          <div key={index} className="image-item">
            <img src={img} alt={`画像 ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
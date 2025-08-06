import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [editMode, setEditMode] = useState('none')
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [blur, setBlur] = useState(0)
  const [rotation, setRotation] = useState(0)
  const canvasRef = useRef(null)

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file: file,
      name: file.name
    }))
    setImages(prev => [...prev, ...newImages])
  }

  const selectImage = (image) => {
    setSelectedImage(image)
    setEditMode('edit')
    resetFilters()
  }

  const resetFilters = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setBlur(0)
    setRotation(0)
  }

  const deleteImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
    if (selectedImage?.id === imageId) {
      setSelectedImage(null)
      setEditMode('none')
    }
  }

  const downloadImage = async () => {
    if (!selectedImage) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`
      
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)
      ctx.restore()
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `edited_${selectedImage.name}`
        a.click()
        URL.revokeObjectURL(url)
      })
    }
    
    img.src = selectedImage.url
  }

  const downloadAll = () => {
    images.forEach((image, index) => {
      setTimeout(() => {
        const a = document.createElement('a')
        a.href = image.url
        a.download = image.name
        a.click()
      }, index * 100)
    })
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Amazon画像編集ツール</h1>
        <div className="header-actions">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            id="file-input"
          />
          <label htmlFor="file-input" className="btn btn-primary">
            📁 画像をアップロード
          </label>
          {images.length > 0 && (
            <button onClick={downloadAll} className="btn btn-secondary">
              💾 すべてダウンロード
            </button>
          )}
        </div>
      </header>

      <div className="main-content">
        <div className="sidebar">
          <h3>アップロード済み画像 ({images.length})</h3>
          <div className="thumbnail-grid">
            {images.map((img) => (
              <div key={img.id} className="thumbnail-item">
                <img 
                  src={img.url} 
                  alt={img.name}
                  onClick={() => selectImage(img)}
                  className={selectedImage?.id === img.id ? 'selected' : ''}
                />
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteImage(img.id)
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="editor-area">
          {selectedImage ? (
            <>
              <div className="preview-container">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.name}
                  style={{
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`,
                    transform: `rotate(${rotation}deg)`
                  }}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>
              
              <div className="controls">
                <div className="control-group">
                  <label>
                    明度: {brightness}%
                    <input 
                      type="range" 
                      min="0" 
                      max="200" 
                      value={brightness}
                      onChange={(e) => setBrightness(e.target.value)}
                    />
                  </label>
                </div>
                
                <div className="control-group">
                  <label>
                    コントラスト: {contrast}%
                    <input 
                      type="range" 
                      min="0" 
                      max="200" 
                      value={contrast}
                      onChange={(e) => setContrast(e.target.value)}
                    />
                  </label>
                </div>
                
                <div className="control-group">
                  <label>
                    彩度: {saturation}%
                    <input 
                      type="range" 
                      min="0" 
                      max="200" 
                      value={saturation}
                      onChange={(e) => setSaturation(e.target.value)}
                    />
                  </label>
                </div>
                
                <div className="control-group">
                  <label>
                    ぼかし: {blur}px
                    <input 
                      type="range" 
                      min="0" 
                      max="20" 
                      value={blur}
                      onChange={(e) => setBlur(e.target.value)}
                    />
                  </label>
                </div>
                
                <div className="control-group">
                  <label>
                    回転: {rotation}°
                    <input 
                      type="range" 
                      min="-180" 
                      max="180" 
                      value={rotation}
                      onChange={(e) => setRotation(e.target.value)}
                    />
                  </label>
                </div>
                
                <div className="action-buttons">
                  <button onClick={resetFilters} className="btn btn-reset">
                    🔄 リセット
                  </button>
                  <button onClick={downloadImage} className="btn btn-download">
                    💾 この画像をダウンロード
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>編集する画像を選択してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
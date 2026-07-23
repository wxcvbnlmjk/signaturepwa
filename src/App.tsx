import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { PDFDocument, degrees } from 'pdf-lib'
import { Rnd } from 'react-rnd'
import SignatureCanvas from 'react-signature-canvas'
import { Copy, Download, Eraser, FilePlus2, FileText, Grip, Maximize2, Menu, Minus, PenLine, Plus, RotateCw, Settings2, Trash2, Upload, X, Zap } from 'lucide-react'
import { saveFavoriteSignature } from './services/storage'
import './App.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
type Signature = { id: string; page: number; dataUrl: string; x: number; y: number; width: number; height: number; rotation: number }

const createSignatureId = () => globalThis.crypto?.randomUUID?.() ?? `signature-${Date.now()}-${Math.random().toString(36).slice(2)}`

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState('')
  const [numPages, setNumPages] = useState(0)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [activePage, setActivePage] = useState(1)
  const [signatures, setSignatures] = useState<Signature[]>([])
  const [isSigning, setIsSigning] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [status, setStatus] = useState('Prêt à signer')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => () => { if (fileUrl) URL.revokeObjectURL(fileUrl) }, [fileUrl])
  const openFile = (nextFile?: File) => {
    const selected = nextFile ?? inputRef.current?.files?.[0]
    if (!selected || selected.type !== 'application/pdf') return
    setFile(selected); setFileUrl(URL.createObjectURL(selected)); setSignatures([]); setActivePage(1); setStatus('Document ouvert localement')
  }
  const addSignature = (dataUrl: string, favorite: boolean) => {
    setSignatures((items) => [...items, { id: createSignatureId(), page: activePage, dataUrl, x: 72, y: 84, width: 190, height: 66, rotation: 0 }])
    if (favorite) void saveFavoriteSignature(dataUrl)
    setIsSigning(false); setStatus('Signature ajoutée')
  }
  const updateSignature = (id: string, changes: Partial<Signature>) => setSignatures((items) => items.map((item) => item.id === id ? { ...item, ...changes } : item))
  const exportPdf = async () => {
    if (!file) return
    setIsExporting(true); setStatus('Préparation du PDF signé…')
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer())
      for (const signature of signatures) {
        const page = pdf.getPage(signature.page - 1); const image = await pdf.embedPng(signature.dataUrl); const pageWidth = page.getWidth(); const pageHeight = page.getHeight(); const ratioX = pageWidth / (794 * scale); const ratioY = pageHeight / (1123 * scale)
        page.drawImage(image, { x: signature.x * ratioX, y: pageHeight - (signature.y + signature.height) * ratioY, width: signature.width * ratioX, height: signature.height * ratioY, rotate: degrees(signature.rotation) })
      }
      const link = document.createElement('a'); const bytes = await pdf.save(); link.href = URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })); link.download = `${file.name.replace(/\.pdf$/i, '')}-signe.pdf`; link.click(); URL.revokeObjectURL(link.href); setStatus('PDF signé téléchargé')
    } catch { setStatus('Impossible de générer le PDF') } finally { setIsExporting(false) }
  }
  const visibleSignatures = signatures.filter((item) => item.page === activePage)

  return (
    <main className="app-shell">
      <header className="topbar"><div className="brand"><span className="brand-mark"><PenLine size={17} /></span><span>signa<span className="brand-dot">.</span></span></div><div className="privacy"><span className="privacy-dot" />Traitement 100 % local</div><button className="icon-button mobile-menu" title="Menu"><Menu size={19} /></button><div className="top-actions"><button className="ghost-button" onClick={() => inputRef.current?.click()}><Upload size={16} />Ouvrir un PDF</button><button className="icon-button" title="Paramètres"><Settings2 size={18} /></button></div><input ref={inputRef} hidden type="file" accept="application/pdf,.pdf" onChange={() => openFile()} /></header>
      <div className="workspace"><aside className="sidebar"><div className="sidebar-label">Document</div>{file ? <div className="file-card"><div className="file-icon"><FileText size={18} /></div><div className="file-meta"><strong>{file.name}</strong><span>{numPages} page{numPages > 1 ? 's' : ''}</span></div><button className="mini-icon" onClick={() => { setFile(null); setFileUrl('') }} title="Fermer"><X size={14} /></button></div> : <button className="drop-card" onClick={() => inputRef.current?.click()}><FilePlus2 size={20} /><strong>Ouvrir un document</strong><span>PDF uniquement</span></button>}<div className="sidebar-divider" /><div className="sidebar-label">Pages <span>{numPages || '—'}</span></div><div className="page-list">{numPages ? Array.from({ length: numPages }, (_, index) => <button key={index} className={`page-thumb ${activePage === index + 1 ? 'selected' : ''}`} onClick={() => { setActivePage(index + 1); document.getElementById(`page-${index + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}><span>{index + 1}</span><div className="thumb-paper"><i /><i /><i /><i /></div></button>) : <div className="empty-pages"><Zap size={16} /><span>Les pages apparaîtront ici</span></div>}</div></aside>
        <section className="editor"><div className="editor-toolbar"><div className="toolbar-group"><button className="tool-button" onClick={() => setScale((value) => Math.max(.65, value - .1))} title="Zoom arrière"><Minus size={16} /></button><span className="zoom-value">{Math.round(scale * 100)}%</span><button className="tool-button" onClick={() => setScale((value) => Math.min(1.5, value + .1))} title="Zoom avant"><Plus size={16} /></button></div><div className="toolbar-group"><button className="tool-button" onClick={() => setRotation((value) => (value + 90) % 360)} title="Rotation"><RotateCw size={16} /></button><button className="tool-button" title="Plein écran"><Maximize2 size={16} /></button></div><div className="toolbar-spacer" /><span className="status-text">{status}</span><button className="primary-button" onClick={() => setIsSigning(true)} disabled={!file}><PenLine size={16} />Nouvelle signature</button><button className="download-button" onClick={exportPdf} disabled={!file || isExporting} title="Télécharger le PDF"><Download size={17} /></button></div><div className="canvas-area" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); openFile(event.dataTransfer.files[0]) }}>{!file ? <div className="welcome"><div className="welcome-icon"><PenLine size={28} /></div><h1>Signez vos documents,<br /><em>simplement.</em></h1><p>Ouvrez un PDF pour commencer. Vos fichiers restent sur cet appareil, toujours.</p><button className="primary-button large" onClick={() => inputRef.current?.click()}><Upload size={17} />Choisir un PDF</button><span className="drop-hint">ou glissez-déposez votre fichier ici</span></div> : <Document file={fileUrl} onLoadSuccess={({ numPages: total }) => setNumPages(total)} loading={<div className="loading">Chargement du document…</div>} error={<div className="loading">Impossible de lire ce PDF.</div>}><div className="document-stack">{Array.from({ length: numPages }, (_, index) => <div className="page-wrap" id={`page-${index + 1}`} key={index} onMouseEnter={() => setActivePage(index + 1)}><Page pageNumber={index + 1} width={794 * scale} rotate={rotation} renderTextLayer={false} renderAnnotationLayer={false} /><span className="page-number">{index + 1}</span>{activePage === index + 1 && visibleSignatures.map((signature) => <Rnd key={signature.id} bounds="parent" size={{ width: signature.width, height: signature.height }} position={{ x: signature.x, y: signature.y }} onDragStop={(_, data) => updateSignature(signature.id, { x: data.x, y: data.y })} onResizeStop={(_, __, ref, ___, position) => updateSignature(signature.id, { width: Number.parseInt(ref.style.width, 10), height: Number.parseInt(ref.style.height, 10), x: position.x, y: position.y })} className="signature-rnd" dragHandleClassName="drag-handle" lockAspectRatio={true} enableUserSelectHack={false}><div className="signature-object"><img src={signature.dataUrl} alt="Signature" /><span className="drag-handle"><Grip size={13} /></span><div className="object-actions"><button title="Faire pivoter" onClick={() => updateSignature(signature.id, { rotation: (signature.rotation + 90) % 360 })}><RotateCw size={12} /></button><button title="Dupliquer" onClick={() => setSignatures((items) => [...items, { ...signature, id: crypto.randomUUID(), x: signature.x + 20, y: signature.y + 20 }])}><Copy size={12} /></button><button title="Supprimer" onClick={() => setSignatures((items) => items.filter((item) => item.id !== signature.id))}><Trash2 size={12} /></button></div></div></Rnd>)}</div>)}</div></Document>}</div><footer className="editor-footer"><span><span className="keycap">⌘</span> + <span className="keycap">O</span> pour ouvrir</span><span>Confidentiel par conception</span></footer></section>
      </div>
      {isSigning && <SignatureModal onClose={() => setIsSigning(false)} onSave={addSignature} />}
    </main>
  )
}

function SignatureModal({ onClose, onSave }: { onClose: () => void; onSave: (dataUrl: string, favorite: boolean) => void }) {
  const canvasRef = useRef<SignatureCanvas>(null)
  const [hasInk, setHasInk] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [penColor, setPenColor] = useState('#111111')
  const [handwritingStyle, setHandwritingStyle] = useState(true)
  const [strokePreset, setStrokePreset] = useState<'fine' | 'thick' | 'extra'>('thick')
  const [keyboardSignature, setKeyboardSignature] = useState('')

  const strokeConfig = {
    fine: { minWidth: 1.1, maxWidth: 1.9, velocityFilterWeight: 0.62 },
    thick: { minWidth: 2.4, maxWidth: 3.4, velocityFilterWeight: 0.72 },
    extra: { minWidth: 3.2, maxWidth: 4.8, velocityFilterWeight: 0.82 },
  }[strokePreset]

  useEffect(() => {
    const pad = canvasRef.current?.getSignaturePad()
    if (!pad) return

    pad.penColor = penColor
    pad.minWidth = strokeConfig.minWidth
    pad.maxWidth = strokeConfig.maxWidth
    pad.velocityFilterWeight = handwritingStyle ? strokeConfig.velocityFilterWeight : 0.5
  }, [penColor, handwritingStyle, strokeConfig])

  const createKeyboardSignatureDataUrl = () => {
    const text = keyboardSignature.trim()
    if (!text) return ''

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) return ''

    canvas.width = 760
    canvas.height = 260

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = penColor
    context.textBaseline = 'middle'
    context.textAlign = 'left'
    context.font = `${strokePreset === 'fine' ? 46 : strokePreset === 'thick' ? 56 : 64}px "Segoe Script", "Bradley Hand", "Comic Sans MS", cursive`
    context.shadowColor = 'rgba(17, 17, 17, 0.12)'
    context.shadowBlur = strokePreset === 'extra' ? 5 : 3
    context.shadowOffsetY = 2
    context.fillText(text, 24, 126)

    return canvas.toDataURL('image/png')
  }

  const clearSignatureCanvas = () => {
    canvasRef.current?.clear()
    setHasInk(false)
    setKeyboardSignature('')
  }

  const saveSignature = () => {
    const dataUrl = handwritingStyle ? createKeyboardSignatureDataUrl() : canvasRef.current?.toDataURL('image/png') || ''
    if (!dataUrl) return
    onSave(dataUrl, favorite)
  }

  const canUseSignature = handwritingStyle ? keyboardSignature.trim().length > 0 : hasInk

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="signature-modal" role="dialog" aria-modal="true" aria-labelledby="signature-title"><div className="modal-header"><div><span className="eyebrow">Votre signature</span><h2 id="signature-title">Dessinez dans le cadre</h2></div><button className="icon-button" onClick={onClose} title="Fermer"><X size={18} /></button></div><div className="signature-controls"><div className="style-row"><span className="control-label">Style manuscrit</span><button className={`toggle-chip ${handwritingStyle ? 'active' : ''}`} onClick={() => setHandwritingStyle((value) => !value)} type="button">{handwritingStyle ? 'Activé' : 'Désactivé'}</button></div><div className="style-row"><span className="control-label">Couleur</span><div className="color-palette"><button type="button" className={`color-swatch ${penColor === '#111111' ? 'active' : ''}`} style={{ background: '#111111' }} onClick={() => setPenColor('#111111')} title="Noir" /><button type="button" className={`color-swatch ${penColor === '#1d5cff' ? 'active' : ''}`} style={{ background: '#1d5cff' }} onClick={() => setPenColor('#1d5cff')} title="Bleu" /><button type="button" className={`color-swatch ${penColor === '#d83b3b' ? 'active' : ''}`} style={{ background: '#d83b3b' }} onClick={() => setPenColor('#d83b3b')} title="Rouge" /></div></div><div className="style-row"><span className="control-label">Trait</span><div className="weight-palette"><button type="button" className={`weight-chip ${strokePreset === 'fine' ? 'active' : ''}`} onClick={() => setStrokePreset('fine')}>Fin</button><button type="button" className={`weight-chip ${strokePreset === 'thick' ? 'active' : ''}`} onClick={() => setStrokePreset('thick')}>Épais</button><button type="button" className={`weight-chip ${strokePreset === 'extra' ? 'active' : ''}`} onClick={() => setStrokePreset('extra')}>Très épais</button></div></div></div>{handwritingStyle ? <div className="keyboard-signature-box"><label className="control-label" htmlFor="keyboard-signature">Saisissez votre signature au clavier</label><textarea id="keyboard-signature" className="signature-input" value={keyboardSignature} onChange={(event) => setKeyboardSignature(event.target.value)} placeholder="Nom ou signature manuscrite" /></div> : <div className="ink-board" onPointerDown={() => setHasInk(true)}><SignatureCanvas ref={canvasRef} canvasProps={{ className: 'signature-canvas' }} /></div>}<div className="modal-hint">{handwritingStyle ? 'Saisissez votre nom avec le clavier et choisissez une couleur et une épaisseur.' : 'Utilisez votre doigt, votre stylet ou votre souris'}</div><label className="favorite-option"><input type="checkbox" checked={favorite} onChange={(event) => setFavorite(event.target.checked)} />Mémoriser cette signature sur cet appareil</label><div className="modal-actions"><button className="ghost-button" onClick={clearSignatureCanvas}><Eraser size={16} />Effacer</button><button className="primary-button" disabled={!canUseSignature} onClick={saveSignature}><PenLine size={16} />Utiliser cette signature</button></div></section></div>
}

export default App

import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFUploadProps {
  onExtracted: (resumeData: any) => void;
  onError: (error: string) => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const PDFUpload = ({ onExtracted, onError }: PDFUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
      onError('Please upload a PDF file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      onError('File size must be less than 5MB');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    onError('');

    try {
      // Extract text from PDF
      const text = await extractTextFromPDF(file);
      
      // Send to backend for parsing
      const formData = new FormData();
      formData.append('file', file);
      formData.append('text', text);

      const response = await fetch(`${API_URL}/api/resume/parse-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse PDF');
      }

      const data = await response.json();
      setExtractedData(data);
      onExtracted(data);
    } catch (error) {
      console.error('PDF processing error:', error);
      onError(error instanceof Error ? error.message : 'Failed to process PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleConfirm = () => {
    if (extractedData) {
      onExtracted(extractedData);
    }
  };

  return (
    <div>
      {!extractedData ? (
        <>
          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              width: '100%',
              background: isDragging ? 'rgba(0,255,148,0.06)' : 'rgba(0,255,148,0.03)',
              border: `2px dashed ${isDragging ? 'rgba(0,255,148,0.6)' : 'rgba(0,255,148,0.3)'}`,
              borderRadius: '8px',
              padding: '48px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: isDragging ? '0 0 30px rgba(0,255,148,0.1)' : 'none',
            }}
            onClick={handleBrowseClick}
          >
            {/* Icon */}
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>

            {/* Heading */}
            <h3
              style={{
                fontFamily: 'Space Grotesk',
                fontSize: '20px',
                fontWeight: 700,
                color: 'white',
                marginBottom: '8px',
              }}
            >
              {isProcessing ? 'PARSING RESUME...' : 'DROP YOUR RESUME HERE'}
            </h3>

            {/* Subtext */}
            <p
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                color: 'var(--muted)',
                marginBottom: '16px',
              }}
            >
              {isProcessing ? (
                <span style={{ color: 'var(--green)' }}>
                  Extracting data from {fileName}...
                </span>
              ) : (
                'PDF format • Max 5MB'
              )}
            </p>

            {/* OR Divider */}
            {!isProcessing && (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    margin: '24px auto',
                    maxWidth: '200px',
                  }}
                >
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--muted)' }}>
                    OR
                  </span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                </div>

                {/* Browse Button */}
                <button
                  type="button"
                  style={{
                    padding: '12px 32px',
                    background: 'transparent',
                    border: '1px solid var(--green)',
                    color: 'var(--green)',
                    fontFamily: 'Space Grotesk',
                    fontSize: '14px',
                    fontWeight: 700,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,255,148,0.1)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,148,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  BROWSE FILE
                </button>
              </>
            )}

            {/* Processing Spinner */}
            {isProcessing && (
              <div
                style={{
                  marginTop: '16px',
                  display: 'inline-block',
                  width: '24px',
                  height: '24px',
                  border: '3px solid rgba(0,255,148,0.2)',
                  borderTop: '3px solid var(--green)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          {/* Spinner Animation */}
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </>
      ) : (
        /* Preview Extracted Data */
        <div
          style={{
            background: 'rgba(0,255,148,0.05)',
            border: '1px solid rgba(0,255,148,0.2)',
            borderRadius: '8px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '24px' }}>✓</div>
            <div>
              <h4
                style={{
                  fontFamily: 'Space Grotesk',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--green)',
                  marginBottom: '4px',
                }}
              >
                RESUME PARSED SUCCESSFULLY
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
                {fileName}
              </p>
            </div>
          </div>

          {/* Preview Data */}
          <div
            style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '4px',
              padding: '16px',
              marginBottom: '16px',
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--muted)' }}>
              <div><strong style={{ color: 'white' }}>Name:</strong> {extractedData.full_name || 'N/A'}</div>
              <div><strong style={{ color: 'white' }}>Email:</strong> {extractedData.email || 'N/A'}</div>
              <div><strong style={{ color: 'white' }}>Title:</strong> {extractedData.title || 'N/A'}</div>
              <div><strong style={{ color: 'white' }}>Skills:</strong> {extractedData.skills?.length || 0} found</div>
              <div><strong style={{ color: 'white' }}>Experience:</strong> {extractedData.experience?.length || 0} positions</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleConfirm}
              style={{
                flex: 1,
                padding: '14px',
                background: 'linear-gradient(135deg, #00FF94 0%, #00CC77 100%)',
                color: '#020208',
                fontFamily: 'Space Grotesk',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,148,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              LOOKS GOOD → BUILD MY CARD
            </button>
            <button
              onClick={() => setExtractedData(null)}
              style={{
                padding: '14px 24px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'var(--muted)',
                fontFamily: 'Space Grotesk',
                fontSize: '14px',
                fontWeight: 700,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--muted)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              EDIT DETAILS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import { useState } from "react";
import jsPDF from "jspdf";
import "./Summary.css"; // Import the CSS file

function Summary({ isTrans, transcript, videoUrl }: { isTrans: boolean; transcript: string; videoUrl: string }) {
  const [notfi, setNotfi] = useState<boolean>(false);

  const textToCopy = transcript;
  const copyToClipboard = () => {
    setNotfi(true);
    setTimeout(() => {
      setNotfi(false);
    }, 3000);
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  const cleanTranscript = (text: string) => {
    return text.replace(/\*\*/g, ''); // Remove ** characters
  };

  // Function to download the transcript as a PDF with border and repeating watermark
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add repeating small watermark
    const watermarkText = "SHORT KUT";
    const fontSize = 10;
    const watermarkSpacing = 50; // Spacing between watermarks

    doc.setFontSize(fontSize);
    doc.setTextColor(150, 150, 150);
    
    for (let y = 20; y < 300; y += watermarkSpacing) {
      for (let x = 20; x < 210; x += watermarkSpacing) {
        doc.text(watermarkText, x, y, { angle: 45, opacity: 0.1 });
      }
    }

    // Add border
    doc.setLineWidth(1);
    doc.rect(5, 5, 200, 287); // Draw border around the page

    // Add transcript text with proper alignment
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const margin = 10;
    const lineHeight = 10;
    let yPosition = 30; // Adjust starting position to avoid overlapping watermark
    const pageHeight = doc.internal.pageSize.height;

    cleanedTranscript.split("\n").forEach((line) => {
      const wrappedText = doc.splitTextToSize(line, 190); // Wrap text to fit within the margins
      wrappedText.forEach((wrappedLine: string | string[]) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage(); // Add a new page if the current one is full
          yPosition = margin;
        }
        doc.text(wrappedLine, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += 5; // Add extra space between paragraphs
    });

    doc.save("transcript-summary.pdf");
  };

  // Clean the transcript for display
  const cleanedTranscript = cleanTranscript(transcript);

  return (
    <>
      {notfi ? (
        <div
          id="toast-top-right"
          className="notification-toast"
          role="alert"
        >
          <div className="text-sm text-green-500 font-bold">Text copied</div>
        </div>
      ) : null}

      {isTrans ? (
        <div className="summary-container">
          <h1 className="summary-header">Video Summary</h1>

          {/* YouTube Video Embed */}
          {videoUrl && (
            <div className="video-container">
              <iframe
                src={`https://www.youtube.com/embed/${videoUrl.split('v=')[1]}`}
                frameBorder="0"
                allowFullScreen
                title="YouTube Video"
              ></iframe>
            </div>
          )}

          {/* Cleaned transcript display */}
          <div className="transcript-container">
            {cleanedTranscript.split("\n").map((line, index) => {
              const isTimestamp = /^\[\d{2}:\d{2}\]/.test(line); // Simple regex to check for timestamp format
              return (
                <div key={index}>
                  {isTimestamp ? (
                    <span className="timestamp"><strong>{line}</strong></span> // Use <strong> for bold
                  ) : (
                    <p className="paragraph">{line}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Copy button */}
          <button className="copy-button" onClick={copyToClipboard}>
            Copy the Summary <i className="fa fa-copy"></i>
          </button>

          {/* Download as PDF button with type="button" */}
          <button className="download-button" type="button" onClick={downloadPDF}>
            Download as PDF <i className="fa fa-download"></i>
          </button>
        </div>
      ) : null}
    </>
  );
}

export default Summary;

'use client';
import { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';

interface FloatingPdfViewerProps {
  title: string;
  pdfBlob: Blob;
}

export const FloatingPdfViewer = ({
  title,
  pdfBlob,
}: FloatingPdfViewerProps) => {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [windowStatus, setWindowStatus] = useState<
    'normal' | 'minimized' | 'maximized'
  >('normal');

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [pdfBlob]);

  // Window style logic
  let contentHeight = '600px';
  let rndProps = {
    default: { x: 100, y: 100, width: 700, height: 700 },
    minWidth: 300,
    minHeight: 200,
    bounds: 'window',
    style: {
      zIndex: 50,
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      borderRadius: '0.75rem',
      border: '1px solid #e5e7eb',
      background: 'white',
      overflow: 'hidden',
    },
  };

  // Minimized window: very small, draggable, only restore button
  if (windowStatus === 'minimized') {
    rndProps = {
      default: { x: 100, y: 100, width: 48, height: 24 },
      minWidth: 48,
      minHeight: 24,
      bounds: 'window',
      style: {
        zIndex: 50,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        background: 'white',
        overflow: 'hidden',
      },
    };
  }

  // Maximized window: fill the screen, not draggable or resizable
  if (windowStatus === 'maximized') {
    const topBarHeightPx = 96; // h-12 = 3rem = 48px
    const maximizedHeight = window.innerHeight - topBarHeightPx;
    rndProps = {
      default: {
        x: 0,
        y: 0,
        width: Math.round(window.innerWidth * 0.95),
        height: maximizedHeight,
      },
      minWidth: Math.round(window.innerWidth * 0.95),
      minHeight: maximizedHeight,
      bounds: 'window',
      style: {
        zIndex: 100,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        background: 'white',
        overflow: 'hidden',
      },
    };
    contentHeight = '100%';
  }

  return (
    <Rnd {...rndProps}>
      {windowStatus === 'minimized' ? (
        <button
          onClick={() => setWindowStatus('normal')}
          title="Restore"
          className="w-8 h-8 rounded-full bg-blue-400 hover:bg-blue-500 flex items-center justify-center"
        >
          {/* Restore icon: stacked squares */}
          <span className="block w-4 h-4 relative">
            <span
              className="absolute left-0 top-0 w-3 h-3 border-2 border-white bg-blue-500"
              style={{ zIndex: 2 }}
            />
            <span
              className="absolute left-1 top-1 w-3 h-3 border-2 border-white bg-blue-400"
              style={{ zIndex: 1 }}
            />
          </span>
        </button>
      ) : (
        <>
          {/* Window header */}
          <div className="window-header flex items-center justify-between bg-gray-100 px-3 py-2 rounded-t-xl border-b cursor-move select-none">
            <span className="font-semibold text-gray-700">{title}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setWindowStatus('minimized')}
                title="Minimize"
                className="w-6 h-6 rounded-full bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center"
              >
                <span className="block w-3 h-0.5 bg-gray-700" />
              </button>
              <button
                onClick={() => setWindowStatus('maximized')}
                title="Maximize"
                className="w-6 h-6 rounded-full bg-green-400 hover:bg-green-500 flex items-center justify-center"
              >
                <span className="block w-3 h-3 border-2 border-gray-700" />
              </button>
              <button
                onClick={() => setWindowStatus('normal')}
                title="Restore"
                className="w-6 h-6 rounded-full bg-blue-400 hover:bg-blue-500 flex items-center justify-center"
              >
                {/* Restore icon: stacked squares */}
                <span className="block w-4 h-4 relative">
                  <span
                    className="absolute left-0 top-0 w-3 h-3 border-2 border-white bg-blue-500"
                    style={{ zIndex: 2 }}
                  />
                  <span
                    className="absolute left-1 top-1 w-3 h-3 border-2 border-white bg-blue-400"
                    style={{ zIndex: 1 }}
                  />
                </span>
              </button>
            </div>
          </div>
          {/* PDF content */}
          {pdfUrl ? (
            <div
              className={
                windowStatus === 'maximized'
                  ? 'bg-white flex justify-center items-start'
                  : 'flex-1 overflow-hidden'
              }
              style={
                windowStatus === 'maximized'
                  ? {
                      width: '95vw',
                      height: 'calc(100vh - 56px)',
                      margin: '0 auto',
                    }
                  : {}
              }
            >
              <embed
                src={pdfUrl}
                type="application/pdf"
                width="100%"
                height={windowStatus === 'maximized' ? '100%' : contentHeight}
                className="rounded-b-xl"
                style={windowStatus === 'maximized' ? { height: '100%' } : {}}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Loading PDF...
            </div>
          )}
        </>
      )}
    </Rnd>
  );
};

export default FloatingPdfViewer;

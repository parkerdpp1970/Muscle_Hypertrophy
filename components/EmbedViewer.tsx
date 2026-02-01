import React from 'react';

interface EmbedViewerProps {
  src?: string;
}

export const EmbedViewer: React.FC<EmbedViewerProps> = ({ src = "https://gamma.app/embed/i8cq4s1cdyk7t9w" }) => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-black">
      {/* Iframe wrapper taking full width and height */}
      <div className="relative w-full h-full">
        <iframe 
          src={src} 
          style={{ width: '100%', height: '100%', border: 'none' }} 
          allow="fullscreen" 
          title="Presentation"
        />
      </div>
    </div>
  );
};
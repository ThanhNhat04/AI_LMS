// Component xử lý iframe hoặc HTML thường
export const IframeWrapper = ({ html }) => {
  const match = html?.match(/<iframe[^>]*src="([^"]+)"[^>]*><\/iframe>/);
  if (!match) return <div dangerouslySetInnerHTML={{ __html: html }} />;
  const src = match[1];
  return (
    <div className="responsive-iframe">
      <iframe
        src={src}
        allowFullScreen
      />
      <style jsx>{`
        .responsive-iframe {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 */
          overflow: hidden;
        }
        .responsive-iframe iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};
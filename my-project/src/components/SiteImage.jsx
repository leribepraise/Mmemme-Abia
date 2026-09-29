import assets from '@/lib/imageAssets.json';
export const imageAsset = src => assets[src]?.src || src;

export default function SiteImage({ src, alt = '', priority = false, loading, decoding = 'async', width, height, ...props }) {
  const asset = assets[src];
  return <img {...props} src={asset?.src || src} alt={alt} width={width || asset?.width} height={height || asset?.height}
    loading={loading || (priority ? 'eager' : 'lazy')} decoding={decoding} fetchPriority={priority ? 'high' : 'auto'}/>;
}

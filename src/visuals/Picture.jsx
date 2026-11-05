/*
 * One photograph from src/photos.js, as AVIF with a WebP fallback (ported
 * from Minifinans' picture.jsx). Narrow screens get the 9:16 crop where one
 * exists. Photographs here are decorative — the copy beside them carries
 * the meaning — so alt defaults to empty.
 */
const set = (base, widths, ext) => widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');

export default function Picture({
  photo,
  sizes = '100vw',
  phoneSizes = '100vw',
  imgRef,
  className = '',
  style,
  alt = '',
  eager = false,
}) {
  const { base, widths, phone } = photo;
  const narrow = '(max-width: 640px)';
  return (
    <picture>
      {phone && <source media={narrow} type="image/avif" sizes={phoneSizes} srcSet={set(`${base}-portrait`, phone, 'avif')} />}
      {phone && <source media={narrow} type="image/webp" sizes={phoneSizes} srcSet={set(`${base}-portrait`, phone, 'webp')} />}
      <source type="image/avif" sizes={sizes} srcSet={set(base, widths, 'avif')} />
      <img
        ref={imgRef}
        src={`${base}-${widths[0]}.webp`}
        srcSet={set(base, widths, 'webp')}
        sizes={sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
        className={className}
        style={style}
      />
    </picture>
  );
}

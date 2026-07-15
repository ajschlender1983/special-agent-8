'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// 182 Higgsfield CDN image URLs - enhanced collection
const HIGGSFIELD_IMAGES = [
  // Wave 1: Core Collection (1-50)
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-001-studio-light-morning.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-002-geometric-patterns-detail.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-003-minimal-workspace.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-004-color-field-abstractions.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-005-shadow-and-form.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-006-texture-study-paper.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-007-light-through-glass.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-008-compositional-balance.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-009-depth-layers.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-010-stilllife-arrangement.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-011-natural-forms.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-012-chromatic-harmony.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-013-negative-space.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-014-material-exploration.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-015-atmospheric-depth.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-016-reflective-surfaces.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-017-edge-definition.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-018-scale-proportion.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-019-accent-highlights.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-020-ground-plane.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-021-warm-light-study.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-022-cool-tone-palette.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-023-monochromatic-variation.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-024-gradient-transition.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-025-focal-point-emphasis.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-026-background-treatment.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-027-foreground-interest.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-028-middle-ground-anchor.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-029-perspective-study.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-030-vanishing-point.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-031-symmetry-balance.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-032-asymmetric-composition.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-033-diagonal-movement.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-034-circular-rhythm.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-035-linear-path.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-036-organic-curves.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-037-architectural-angle.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-038-botanical-element.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-039-object-grouping.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-040-spatial-relationship.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-041-proximity-distance.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-042-overlap-layering.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-043-transparency-effect.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-044-opacity-study.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-045-contrast-extreme.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-046-subtlety-minimal.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-047-gesture-dynamic.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-048-stillness-quiet.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-049-motion-trace.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-050-pause-moment.webp',

  // Wave 2: Thematic Variations (51-100)
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-051-golden-hour-warm.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-052-dusk-transition.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-053-dawn-awakening.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-054-midday-bright.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-055-twilight-dimming.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-056-night-shadow.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-057-overcast-diffused.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-058-sunny-direct.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-059-cloudy-soft.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-060-stormy-dramatic.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-061-rain-wet-surface.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-062-frost-crystalline.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-063-snow-covered.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-064-autumn-warm-tones.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-065-spring-fresh.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-066-summer-vibrant.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-067-winter-stark.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-068-metal-polished.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-069-wood-grain.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-070-fabric-weave.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-071-ceramic-glaze.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-072-stone-texture.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-073-glass-clarity.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-074-leather-surface.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-075-plastic-sheen.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-076-rubber-matte.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-077-water-reflective.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-078-liquid-movement.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-079-air-transparency.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-080-fire-glow.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-081-smoke-diffusion.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-082-dust-particles.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-083-foam-airy.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-084-cloud-soft.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-085-mist-ethereal.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-086-clarity-sharp.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-087-blur-motion.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-088-focus-deep.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-089-bokeh-soft-circle.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-090-vignette-edge.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-091-flare-light-leak.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-092-grain-texture-film.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-093-noise-digital.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-094-chromatic-aberration.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-095-distortion-lens.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-096-fisheye-wide.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-097-telephoto-compressed.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-098-macro-close.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-099-wide-landscape.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-100-portrait-framing.webp',

  // Wave 3: Advanced Variations (101-150)
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-101-color-grading-warm.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-102-color-grading-cool.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-103-color-grading-vintage.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-104-color-grading-cinematic.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-105-hue-shift-red.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-106-hue-shift-blue.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-107-hue-shift-green.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-108-hue-shift-yellow.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-109-saturation-vivid.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-110-saturation-muted.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-111-desaturated-monochrome.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-112-brightness-highlight.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-113-brightness-shadow.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-114-exposure-bright.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-115-exposure-dark.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-116-highlight-recovery.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-117-shadow-detail.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-118-black-point-crush.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-119-white-point-clip.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-120-midtone-adjustment.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-121-curve-adjustment-s.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-122-curve-adjustment-inverse.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-123-split-toning-warm.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-124-split-toning-cool.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-125-lut-filter-cool.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-126-lut-filter-warm.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-127-lut-filter-dream.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-128-vhs-aesthetic.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-129-glitch-effect.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-130-pixel-sort.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-131-scan-line.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-132-crt-monitor.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-133-vignette-thick.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-134-lens-distortion-barrel.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-135-lens-distortion-pincushion.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-136-chromatic-shift.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-137-fringing-color.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-138-aberration-multi.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-139-bloom-glow.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-140-lens-flare-star.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-141-lens-flare-ring.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-142-god-rays-volumetric.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-143-shadow-play-complex.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-144-light-refraction.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-145-caustics-water.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-146-diffraction-grating.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-147-polarization-filter.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-148-newton-rings.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-149-interference-pattern.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-150-optical-illusion.webp',

  // Wave 4: Final Variations (151-182)
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-151-perspective-correction.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-152-horizon-alignment.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-153-keystone-fix.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-154-rotation-adjust.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-155-crop-rule-thirds.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-156-crop-golden-ratio.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-157-crop-square.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-158-crop-panoramic.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-159-aspect-ratio-1-1.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-160-aspect-ratio-4-3.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-161-aspect-ratio-16-9.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-162-aspect-ratio-21-9.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-163-detail-crop-abstract.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-164-detail-macro-texture.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-165-detail-edge-sharpness.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-166-detail-surface-variation.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-167-pattern-repetition.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-168-pattern-fractal.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-169-pattern-grid.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-170-pattern-organic.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-171-symmetry-mirror.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-172-symmetry-bilateral.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-173-symmetry-radial.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-174-asymmetry-dynamic.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-175-balance-weight.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-176-tension-visual.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-177-harmony-color.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-178-unity-form.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-179-variety-element.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-180-complexity-minimal.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-181-simplicity-bold.webp',
  'https://cdn.higgsfield.io/collections/enhanced/HF-ENH-182-essence-timeless.webp',
];

interface GalleryProps {
  accentColor?: string;
}

export default function Gallery({ accentColor = '#f59e0b' }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const handleImageLoad = (url: string) => {
    setIsLoading(prev => ({ ...prev, [url]: false }));
  };

  const handleImageError = (url: string) => {
    setIsLoading(prev => ({ ...prev, [url]: false }));
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-2">
          Enhanced Image Collection
        </div>
        <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)' }}>
          Higgsfield Gallery
        </h2>
        <p className="text-neutral-400 text-sm">
          Explore {HIGGSFIELD_IMAGES.length} curated images from the Higgsfield enhanced collection
        </p>
      </div>

      {/* Gallery Grid - 3 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {HIGGSFIELD_IMAGES.map((imageUrl, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: (idx % 12) * 0.02 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedImage(imageUrl)}
            className="relative h-48 rounded-xl overflow-hidden cursor-pointer group glass"
          >
            {/* Skeleton loader */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 animate-pulse" />

            {/* Image */}
            <img
              src={imageUrl}
              alt={`Higgsfield image ${idx + 1}`}
              onLoad={() => handleImageLoad(imageUrl)}
              onError={() => handleImageError(imageUrl)}
              className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="text-white text-center"
              >
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
                <p className="text-sm font-medium">View</p>
              </motion.div>
            </div>

            {/* Image number */}
            <div className="absolute top-2 right-2 bg-black/50 rounded-lg px-2 py-1 text-[10px] text-neutral-300 font-mono">
              {idx + 1}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[80vh]"
            >
              <img
                src={selectedImage}
                alt="Lightbox preview"
                className="w-full h-full object-contain rounded-2xl"
              />

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-neutral-300 transition-colors"
                style={{ color: accentColor }}
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="glass rounded-xl p-4 text-center">
        <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
          {HIGGSFIELD_IMAGES.length} Images Available
        </p>
      </div>
    </motion.section>
  );
}

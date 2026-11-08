import React from 'react';

interface LineArtProps {
  stageId: string;
  accentColor: string;
  isExpanded: boolean;
}

export function LifeStageLineArt({ stageId, accentColor, isExpanded }: LineArtProps) {
  switch (stageId) {
    case 'stage1':
      // Infants: Whimsical crescent moon, sleeping baby in botanical swaddle, dandelion seeds & alphabet blocks
      return (
        <svg
          viewBox="0 0 320 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-700"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.18" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Celestial Crescent Moon & Aura */}
          <path
            d="M 195 90 C 135 105, 120 160, 135 220 C 145 255, 175 285, 215 295 C 160 305, 100 260, 95 190 C 90 125, 140 75, 195 90 Z"
            fill="url(#grad1)"
            stroke={accentColor}
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.75"
          />
          {/* Subtle concentric sound/touch rings */}
          <circle cx="160" cy="200" r="115" stroke={accentColor} strokeWidth="1" strokeDasharray="3 7" opacity="0.25" />
          <circle cx="160" cy="200" r="85" stroke={accentColor} strokeWidth="1.2" strokeDasharray="5 5" opacity="0.3" />

          {/* Sleeping Baby Profile in Botanical Swaddling Folds */}
          <path
            d="M 145 155 C 135 150, 120 160, 122 175 C 124 188, 136 195, 148 193 C 158 190, 168 180, 165 168 C 162 158, 155 153, 145 155 Z"
            stroke={accentColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="white"
            fillOpacity="0.8"
          />
          {/* Gentle closed eyelid & smile */}
          <path d="M 134 172 Q 140 176 146 172" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 138 182 Q 144 186 148 183" stroke={accentColor} strokeWidth="1.6" strokeLinecap="round" />
          {/* Little hair curl */}
          <path d="M 148 152 C 152 142, 162 144, 158 154" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" />

          {/* Flowing Organic Swaddle Blanketing */}
          <path
            d="M 122 185 C 105 200, 95 230, 110 260 C 125 288, 165 290, 185 265 C 200 245, 195 215, 165 200"
            stroke={accentColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="url(#grad1)"
          />
          <path d="M 112 225 Q 140 235 175 220" stroke={accentColor} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
          <path d="M 118 250 Q 148 260 178 245" stroke={accentColor} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />

          {/* Baby hands reaching toward rattle */}
          <path d="M 138 215 Q 128 200 132 195 Q 138 192 142 205" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" />

          {/* Wooden Developmental Blocks with Botanical Leaves */}
          <g transform="translate(10, 15)">
            <rect x="135" y="295" width="42" height="42" rx="7" stroke={accentColor} strokeWidth="2.2" fill="white" fillOpacity="0.9" />
            <text x="156" y="323" textAnchor="middle" fill={accentColor} fontSize="20" fontFamily="serif" fontWeight="bold">A</text>
            {/* Block 2 */}
            <rect x="100" y="335" width="40" height="40" rx="7" stroke={accentColor} strokeWidth="2" fill="white" fillOpacity="0.9" />
            <text x="120" y="361" textAnchor="middle" fill={accentColor} fontSize="18" fontFamily="serif" fontWeight="bold">B</text>
            {/* Block 3 */}
            <rect x="146" y="335" width="40" height="40" rx="7" stroke={accentColor} strokeWidth="2" fill="white" fillOpacity="0.9" />
            <circle cx="166" cy="355" r="9" stroke={accentColor} strokeWidth="1.6" fill="none" />
          </g>

          {/* Delicate Botanical Vine Wrapping */}
          <path
            d="M 90 380 Q 95 330 115 315 T 145 285"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* Leaves */}
          <path d="M 98 350 C 90 342, 92 335, 102 340 C 105 348, 102 352, 98 350 Z" fill={accentColor} opacity="0.6" />
          <path d="M 112 325 C 105 318, 108 310, 118 315 C 120 322, 116 328, 112 325 Z" fill={accentColor} opacity="0.6" />

          {/* Floating Dandelion Fluffs */}
          <circle cx="215" cy="135" r="1.8" fill={accentColor} />
          <path d="M 215 135 L 225 125 M 225 125 L 223 121 M 225 125 L 228 122 M 225 125 L 229 127" stroke={accentColor} strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="235" cy="170" r="1.5" fill={accentColor} />
          <path d="M 235 170 L 246 162 M 246 162 L 244 158 M 246 162 L 249 160" stroke={accentColor} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case 'stage2':
      // Toddlers: Storybook origami bird taking flight, wind swirl ribbons, child discovery silhouette & star orbits
      return (
        <svg
          viewBox="0 0 320 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-700"
        >
          <defs>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Flowing Wind Ribbon Spiral */}
          <path
            d="M 40 400 C 60 300, 160 320, 220 250 C 260 200, 260 130, 205 95 C 155 65, 110 100, 125 160 C 140 215, 230 220, 260 170"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeDasharray="6 8"
            opacity="0.35"
          />

          {/* Origami Crane in Flight */}
          <g transform="translate(160, 80) scale(0.95)">
            <polygon
              points="40,20 85,55 50,75 25,45"
              stroke={accentColor}
              strokeWidth="2.2"
              fill="white"
              fillOpacity="0.9"
              strokeLinejoin="round"
            />
            <polygon points="40,20 15,28 25,45" stroke={accentColor} strokeWidth="1.8" fill="url(#grad2)" strokeLinejoin="round" />
            <polygon points="40,20 65,-10 60,35" stroke={accentColor} strokeWidth="2" fill="white" fillOpacity="0.8" strokeLinejoin="round" />
            <polygon points="50,75 80,95 85,55" stroke={accentColor} strokeWidth="1.6" fill="url(#grad2)" strokeLinejoin="round" />
            {/* Wing fold line */}
            <line x1="40" y1="20" x2="50" y2="75" stroke={accentColor} strokeWidth="1.4" />
          </g>

          {/* Child in Joyful Discovery Pose */}
          <path
            d="M 120 195 C 110 205, 112 230, 125 245 C 140 260, 168 255, 178 238 C 190 220, 185 195, 170 185 C 155 175, 130 182, 120 195 Z"
            stroke={accentColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="white"
            fillOpacity="0.85"
          />
          {/* Playful windswept hair strands */}
          <path d="M 120 195 C 95 188, 80 205, 75 220 C 88 215, 102 218, 115 225" stroke={accentColor} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 135 180 C 130 165, 145 160, 155 170" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />

          {/* Eye in wonder & smile */}
          <circle cx="158" cy="212" r="2.8" fill={accentColor} />
          <path d="M 152 225 Q 164 234 172 224" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />

          {/* Arms reaching upward toward origami bird */}
          <path
            d="M 150 255 L 180 280 L 210 240 L 225 210"
            stroke={accentColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 130 255 L 115 295 L 95 315"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Palette of Discovery (Colors & Shapes) */}
          <path
            d="M 120 370 C 100 350, 95 385, 115 410 C 145 440, 215 435, 230 395 C 242 365, 210 340, 180 355 C 165 362, 155 350, 140 352 Z"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinejoin="round"
            fill="white"
            fillOpacity="0.7"
          />
          {/* Palette color dots */}
          <circle cx="125" cy="385" r="7" stroke={accentColor} strokeWidth="1.8" fill="url(#grad2)" />
          <circle cx="155" cy="395" r="7" stroke={accentColor} strokeWidth="1.8" fill="url(#grad2)" />
          <circle cx="185" cy="390" r="7" stroke={accentColor} strokeWidth="1.8" fill="url(#grad2)" />
          <circle cx="140" cy="365" r="8" stroke={accentColor} strokeWidth="1.5" fill="none" />

          {/* Kinetic Stars */}
          <path d="M 85 140 L 88 148 L 97 149 L 90 155 L 92 163 L 85 158 L 78 163 L 80 155 L 73 149 L 82 148 Z" fill={accentColor} opacity="0.65" />
          <path d="M 245 280 L 247 285 L 253 286 L 248 290 L 250 296 L 245 293 L 240 296 L 242 290 L 237 286 L 243 285 Z" fill={accentColor} opacity="0.55" />
        </svg>
      );

    case 'stage3':
      // Children: Da Vinci sketchbook armillary sphere, prism light refraction, open folio book & nautilus spiral
      return (
        <svg
          viewBox="0 0 320 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-700"
        >
          <defs>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.22" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Celestial Armillary Sphere Rings */}
          <ellipse cx="160" cy="155" rx="100" ry="40" stroke={accentColor} strokeWidth="1.4" opacity="0.35" transform="rotate(-15, 160, 155)" />
          <ellipse cx="160" cy="155" rx="100" ry="40" stroke={accentColor} strokeWidth="1.4" opacity="0.35" transform="rotate(35, 160, 155)" />
          <circle cx="160" cy="155" r="75" stroke={accentColor} strokeWidth="1.8" opacity="0.4" />
          <line x1="160" y1="70" x2="160" y2="240" stroke={accentColor} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />

          {/* Student Profile in Contemplative Focus */}
          <path
            d="M 120 260 C 130 225, 160 220, 178 235 C 192 250, 190 280, 175 305 L 165 325 Q 140 335 115 325 Z"
            stroke={accentColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="white"
            fillOpacity="0.85"
          />
          {/* Eyeglasses & Temples */}
          <circle cx="170" cy="252" r="11" stroke={accentColor} strokeWidth="2" fill="white" fillOpacity="0.7" />
          <line x1="181" y1="252" x2="192" y2="248" stroke={accentColor} strokeWidth="2" />

          {/* Open Illustrated Folio Book */}
          <g transform="translate(10, 10)">
            <path
              d="M 80 350 Q 150 330 150 365 Q 150 330 220 350 L 210 415 Q 150 395 150 425 Q 150 395 90 415 Z"
              stroke={accentColor}
              strokeWidth="2.4"
              strokeLinejoin="round"
              fill="white"
              fillOpacity="0.9"
            />
            {/* Spine & Pages */}
            <line x1="150" y1="365" x2="150" y2="425" stroke={accentColor} strokeWidth="2.2" />
            <path d="M 98 368 Q 130 355 142 372" stroke={accentColor} strokeWidth="1.2" opacity="0.6" />
            <path d="M 98 382 Q 130 370 142 386" stroke={accentColor} strokeWidth="1.2" opacity="0.6" />
            <path d="M 98 396 Q 130 384 142 400" stroke={accentColor} strokeWidth="1.2" opacity="0.6" />
          </g>

          {/* Geometric Triangular Prism & Dispersed Rays */}
          <polygon points="215,225 245,275 185,275" stroke={accentColor} strokeWidth="2.2" fill="url(#grad3)" strokeLinejoin="round" />
          <line x1="165" y1="245" x2="200" y2="250" stroke={accentColor} strokeWidth="1.6" strokeDasharray="3 3" />
          <line x1="230" y1="250" x2="275" y2="235" stroke={accentColor} strokeWidth="1.5" opacity="0.8" />
          <line x1="235" y1="258" x2="280" y2="252" stroke={accentColor} strokeWidth="1.5" opacity="0.8" />
          <line x1="238" y1="266" x2="278" y2="270" stroke={accentColor} strokeWidth="1.5" opacity="0.8" />

          {/* Fibonacci Nautilus Spiral Motif */}
          <path
            d="M 75 180 C 75 155, 95 135, 120 135 C 138 135, 152 150, 152 168 C 152 180, 142 192, 130 192 C 122 192, 115 185, 115 178"
            stroke={accentColor}
            strokeWidth="1.4"
            opacity="0.45"
          />
        </svg>
      );

    case 'stage4':
      // Teens: Dynamic Hellenic Hermes kinetic runner, speed wings, chronometer pendulum & cardiogram pulse
      return (
        <svg
          viewBox="0 0 320 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-700"
        >
          <defs>
            <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.22" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Kinetic Speed Rays & Velocity Field */}
          <line x1="30" y1="120" x2="140" y2="120" stroke={accentColor} strokeWidth="1.4" strokeDasharray="8 6" opacity="0.3" />
          <line x1="20" y1="165" x2="170" y2="165" stroke={accentColor} strokeWidth="2.2" strokeDasharray="14 8" opacity="0.45" />
          <line x1="40" y1="210" x2="130" y2="210" stroke={accentColor} strokeWidth="1.5" strokeDasharray="8 6" opacity="0.3" />

          {/* Stylized Speed Wings (Hermes Motifs) */}
          <path
            d="M 190 95 C 220 80, 260 90, 275 115 C 255 115, 235 125, 220 145 C 235 138, 255 138, 265 150 C 245 155, 230 170, 215 185"
            stroke={accentColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="url(#grad4)"
            opacity="0.8"
          />

          {/* Athlete Profile in Forward Momentum */}
          <path
            d="M 160 140 C 150 150, 150 175, 165 190 C 182 205, 210 198, 218 178 C 225 155, 210 135, 185 130 C 172 128, 165 132, 160 140 Z"
            stroke={accentColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="white"
            fillOpacity="0.85"
          />
          {/* Headband with kinetic angle */}
          <path d="M 155 155 Q 185 142, 215 156" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="154" y1="158" x2="135" y2="152" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />

          {/* Torso & Athletic Drive */}
          <path
            d="M 170 195 L 140 240 L 95 235 L 70 255"
            stroke={accentColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 155 230 L 190 265 L 225 250"
            stroke={accentColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Precision Chronometer with Dial Hatching */}
          <g transform="translate(10, 5)">
            <circle cx="150" cy="350" r="46" stroke={accentColor} strokeWidth="2.5" fill="white" fillOpacity="0.9" />
            <circle cx="150" cy="350" r="40" stroke={accentColor} strokeWidth="1" strokeDasharray="3 4" opacity="0.4" />
            {/* Crown button */}
            <path d="M 150 304 L 150 292 M 142 292 H 158" stroke={accentColor} strokeWidth="2.6" strokeLinecap="round" />
            {/* Hands at lightning reflex angle */}
            <line x1="150" y1="350" x2="175" y2="330" stroke={accentColor} strokeWidth="2.6" strokeLinecap="round" />
            <line x1="150" y1="350" x2="140" y2="370" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="150" cy="350" r="4.5" fill={accentColor} />
            {/* Hour ticks */}
            <line x1="150" y1="308" x2="150" y2="315" stroke={accentColor} strokeWidth="2" />
            <line x1="192" y1="350" x2="185" y2="350" stroke={accentColor} strokeWidth="2" />
            <line x1="150" y1="392" x2="150" y2="385" stroke={accentColor} strokeWidth="2" />
            <line x1="108" y1="350" x2="115" y2="350" stroke={accentColor} strokeWidth="2" />
          </g>

          {/* ECG Pulse Cardiogram Wave */}
          <path
            d="M 50 430 H 100 L 115 410 L 125 450 L 140 395 L 150 435 L 160 425 H 270"
            stroke={accentColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          />
        </svg>
      );

    case 'stage5':
      // Young Adults: Editorial Vogue-style contour portrait, sacred neural network, monstera/fern leaves & compass
      return (
        <svg
          viewBox="0 0 320 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-700"
        >
          <defs>
            <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.22" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Synaptic Neural Constellation (Lattice of Insight) */}
          <circle cx="110" cy="95" r="4.5" fill={accentColor} />
          <circle cx="190" cy="80" r="5.5" stroke={accentColor} strokeWidth="2" fill="white" />
          <circle cx="235" cy="130" r="4.5" fill={accentColor} />
          <circle cx="165" cy="140" r="5" stroke={accentColor} strokeWidth="2" fill="white" />
          <circle cx="75" cy="155" r="4.5" fill={accentColor} />
          <circle cx="130" cy="180" r="3.5" fill={accentColor} />

          <line x1="110" y1="95" x2="190" y2="80" stroke={accentColor} strokeWidth="1.4" opacity="0.45" />
          <line x1="190" y1="80" x2="235" y2="130" stroke={accentColor} strokeWidth="1.4" opacity="0.45" />
          <line x1="190" y1="80" x2="165" y2="140" stroke={accentColor} strokeWidth="1.4" opacity="0.45" />
          <line x1="110" y1="95" x2="165" y2="140" stroke={accentColor} strokeWidth="1.4" opacity="0.45" />
          <line x1="75" y1="155" x2="165" y2="140" stroke={accentColor} strokeWidth="1.4" opacity="0.45" />
          <line x1="75" y1="155" x2="130" y2="180" stroke={accentColor} strokeWidth="1.4" opacity="0.45" />

          {/* Sculpted Editorial Contour Profile */}
          <path
            d="M 125 180 C 140 165, 175 168, 185 188 C 195 208, 190 238, 172 258 C 155 275, 122 268, 115 245 Z"
            stroke={accentColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="white"
            fillOpacity="0.85"
          />
          {/* Flowing Hair Ribbons */}
          <path
            d="M 125 180 C 105 185, 85 210, 85 245 C 85 285, 110 305, 130 310 Q 155 315 165 295"
            stroke={accentColor}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path d="M 105 220 Q 95 260 115 285" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

          {/* Minimalist Eyelash & Lips */}
          <line x1="168" y1="215" x2="180" y2="215" stroke={accentColor} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 172 235 Q 180 240 186 235" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" />

          {/* Botanical Monstera Frond / Palm Leaf */}
          <g transform="translate(185, 270) scale(0.85)">
            <path
              d="M 40 130 Q 30 70 80 20 Q 110 60 90 120 Z"
              stroke={accentColor}
              strokeWidth="2"
              fill="url(#grad5)"
            />
            <path d="M 40 130 Q 55 75 80 20" stroke={accentColor} strokeWidth="1.8" />
            <line x1="60" y1="80" x2="45" y2="70" stroke={accentColor} strokeWidth="1.6" />
            <line x1="70" y1="60" x2="55" y2="50" stroke={accentColor} strokeWidth="1.6" />
            <line x1="80" y1="40" x2="70" y2="30" stroke={accentColor} strokeWidth="1.6" />
          </g>

          {/* Modern Geometry / Golden Ratio Calipers */}
          <circle cx="150" cy="370" r="34" stroke={accentColor} strokeWidth="2.2" fill="white" fillOpacity="0.8" />
          <polygon points="150,340 176,385 124,385" stroke={accentColor} strokeWidth="1.8" fill="none" />
          <circle cx="150" cy="370" r="14" stroke={accentColor} strokeWidth="1.2" strokeDasharray="3 3" />
        </svg>
      );

    case 'stage6':
      // Adults: Precision Vitruvian optic perimetry, harmonic soundwave curves & architectural sightline profile
      return (
        <svg
          viewBox="0 0 320 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-700"
        >
          <defs>
            <linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.22" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Humphrey Visual Field Perimetry Polar Mapping */}
          <circle cx="160" cy="180" r="110" stroke={accentColor} strokeWidth="1.2" strokeDasharray="4 6" opacity="0.3" />
          <circle cx="160" cy="180" r="75" stroke={accentColor} strokeWidth="1.4" opacity="0.35" />
          <circle cx="160" cy="180" r="40" stroke={accentColor} strokeWidth="1.6" strokeDasharray="6 6" opacity="0.4" />
          {/* Radial Angle Rays */}
          <line x1="50" y1="180" x2="270" y2="180" stroke={accentColor} strokeWidth="1.2" strokeDasharray="4 4" opacity="0.3" />
          <line x1="160" y1="70" x2="160" y2="290" stroke={accentColor} strokeWidth="1.2" strokeDasharray="4 4" opacity="0.3" />
          <line x1="82" y1="102" x2="238" y2="258" stroke={accentColor} strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
          <line x1="82" y1="258" x2="238" y2="102" stroke={accentColor} strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />

          {/* Central Fixation Crosshair with Glow Target */}
          <circle cx="160" cy="180" r="5" fill={accentColor} />
          <circle cx="160" cy="180" r="12" stroke={accentColor} strokeWidth="1.5" strokeDasharray="2 3" opacity="0.6" />

          {/* Architectonic Poised Profile */}
          <path
            d="M 115 285 C 130 245, 165 235, 185 250 C 200 268, 195 300, 180 325 L 170 345 Q 140 355 115 350 Z"
            stroke={accentColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="white"
            fillOpacity="0.85"
          />
          {/* Eyeglass Bridge with Polished Lines */}
          <rect x="165" y="265" width="24" height="16" rx="4" stroke={accentColor} strokeWidth="2.2" fill="white" fillOpacity="0.75" />
          <line x1="189" y1="272" x2="200" y2="270" stroke={accentColor} strokeWidth="2.2" />

          {/* Pure-Tone Acoustic Soundwave Harmonics */}
          <g transform="translate(10, 25)">
            <path
              d="M 50 390 Q 80 340 110 390 T 170 390 T 230 390 T 290 390"
              stroke={accentColor}
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M 60 410 Q 90 380 120 410 T 180 410 T 240 410"
              stroke={accentColor}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray="4 4"
              opacity="0.45"
            />
          </g>

          {/* Navigation Compass Rose / Orientation Diamond */}
          <polygon points="160,50 166,66 182,72 166,78 160,94 154,78 138,72 154,66" stroke={accentColor} strokeWidth="1.6" fill="url(#grad6)" />
        </svg>
      );

    case 'stage7':
      // Seniors: Serene Rembrandt/Japanese woodcut aesthetic, Zen Enso spiral, antique sundial clock & ginkgo longevity leaves
      return (
        <svg
          viewBox="0 0 320 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-700"
        >
          <defs>
            <linearGradient id="grad7" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Zen Enso Balance Spiral (Tremor Quantifier) */}
          <path
            d="M 160 160 C 175 160, 185 172, 180 185 C 168 200, 142 195, 138 175 C 132 145, 172 135, 195 152 C 220 175, 210 220, 170 230 C 125 240, 105 190, 125 150 C 150 100, 225 110, 240 170 C 255 240, 185 275, 140 260 C 90 245, 75 170, 110 120"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Dignified Serene Elder Profile */}
          <path
            d="M 115 245 Q 135 220 165 220 Q 192 225 198 255 Q 202 280 185 308 L 170 335 Q 138 340 115 315 Z"
            stroke={accentColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="white"
            fillOpacity="0.85"
          />
          {/* Expressive Graceful Silver Hair Strands */}
          <path d="M 120 245 C 105 210, 140 190, 170 195 C 190 200, 205 212, 205 235" stroke={accentColor} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 130 228 C 140 208, 165 208, 178 215" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 112 260 C 95 245, 110 225, 122 220" stroke={accentColor} strokeWidth="1.6" strokeLinecap="round" />

          {/* Wise smile and crinkle lines */}
          <path d="M 165 260 Q 175 258 185 265" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 188 260 L 195 258 M 188 266 L 196 268" stroke={accentColor} strokeWidth="1.4" strokeLinecap="round" />

          {/* Antique Clock Drawing Dial with Roman Numerals */}
          <g transform="translate(10, 15)">
            <circle cx="150" cy="370" r="44" stroke={accentColor} strokeWidth="2.5" fill="white" fillOpacity="0.92" />
            <circle cx="150" cy="370" r="39" stroke={accentColor} strokeWidth="1" strokeDasharray="3 4" opacity="0.4" />
            {/* Target 10 past 11 (11:10) */}
            <line x1="150" y1="370" x2="138" y2="340" stroke={accentColor} strokeWidth="3.2" strokeLinecap="round" />
            <line x1="150" y1="370" x2="182" y2="358" stroke={accentColor} strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="150" cy="370" r="4.5" fill={accentColor} />

            {/* Classical Roman Numerals */}
            <text x="150" y="342" textAnchor="middle" fill={accentColor} fontSize="10" fontFamily="serif" fontWeight="bold">XII</text>
            <text x="180" y="373" textAnchor="middle" fill={accentColor} fontSize="10" fontFamily="serif" fontWeight="bold">III</text>
            <text x="150" y="403" textAnchor="middle" fill={accentColor} fontSize="10" fontFamily="serif" fontWeight="bold">VI</text>
            <text x="120" y="373" textAnchor="middle" fill={accentColor} fontSize="10" fontFamily="serif" fontWeight="bold">IX</text>
          </g>

          {/* Ginkgo Biloba Longevity Leaves */}
          <g transform="translate(200, 275) scale(0.9)">
            <path
              d="M 20 60 C 20 30, 45 10, 65 30 C 55 45, 55 45, 65 60 C 50 60, 30 70, 20 60 Z"
              stroke={accentColor}
              strokeWidth="2"
              fill="url(#grad7)"
            />
            <path d="M 20 60 L 5 95" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 45 42 Q 35 50 25 58" stroke={accentColor} strokeWidth="1.2" opacity="0.6" />
          </g>
        </svg>
      );

    default:
      return null;
  }
}

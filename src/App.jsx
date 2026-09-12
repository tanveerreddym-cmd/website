import { useEffect, useState, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import {
  ArrowOutward,
  Brightness4,
  Brightness7,
  LocationOn,
} from '@mui/icons-material';
import { useColorMode } from './theme';
import './index.css';

import BlurText from './components/BlurText';
import CountUp from './components/CountUp';
import GradientText from './components/GradientText';
import MagneticButton from './components/MagneticButton';
import ScrollFloat from './components/ScrollFloat';
import SplitText from './components/SplitText';
import SpotlightCard from './components/SpotlightCard';
import TiltCard from './components/TiltCard';

const AuroraBackground = lazy(() => import('./components/AuroraBackground'));
const HeroParticles = lazy(() => import('./components/HeroParticles'));
const SplashCursor = lazy(() => import('./components/SplashCursor'));
import {
  useActiveSection,
  useNavScroll,
  useScrollProgress,
} from './hooks';

const NAV_ITEMS = [
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'technology', label: 'Technology' },
  { id: 'market', label: 'Market' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'team', label: 'Team' },
  { id: 'contact', label: 'Contact' },
];

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);
const SECTION_PATHS = Object.freeze({
  top: '/',
  ...Object.fromEntries(NAV_ITEMS.map((item) => [item.id, `/${item.id}`])),
});
const PATH_TO_SECTION = Object.freeze(
  Object.fromEntries(Object.entries(SECTION_PATHS).map(([sectionId, path]) => [path, sectionId]))
);

function getSectionPath(sectionId) {
  return SECTION_PATHS[sectionId] || '/';
}

function getSectionFromLocation() {
  const legacyHash = window.location.hash.replace(/^#/, '').toLowerCase();
  if (legacyHash && SECTION_PATHS[legacyHash]) {
    return { sectionId: legacyHash, usesLegacyHash: true };
  }

  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  return {
    sectionId: PATH_TO_SECTION[pathname.toLowerCase()] || 'top',
    usesLegacyHash: false,
  };
}

function scrollToSection(sectionId, behavior = 'smooth') {
  const target = document.getElementById(sectionId);
  target?.scrollIntoView({ behavior, block: 'start' });
}

const technologyAreas = [
  {
    title: 'Optical interconnects',
    description: 'Using light, not only electrical signalling, to move and address information.',
    svg: '<path d="M4 19 10 13l4 4 7-10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="4" cy="19" r="2" fill="currentColor"/><circle cx="21" cy="7" r="2" fill="currentColor"/>',
  },
  {
    title: 'Reconfigurable memory states',
    description: 'Materials that can be switched and rewritten, not limited to a single write.',
    svg: '<rect x="3" y="8" width="7" height="8" rx="1.5" stroke="currentColor" stroke-width="2" fill="none"/><rect x="14" y="8" width="7" height="8" rx="1.5" fill="currentColor"/><path d="M10 12h4" stroke="currentColor" stroke-width="2"/>',
  },
  {
    title: 'Stability by design',
    description: 'Built to hold data reliably without continuous power.',
    svg: '<path d="M12 3 20 7v5c0 5-3.4 8.2-8 9.8C7.4 20.2 4 17 4 12V7l8-4Z" stroke="currentColor" stroke-width="2" fill="none"/><path d="m8.8 12 2.1 2.1 4.5-4.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
];

const roadmap = [
  {
    date: '2024 – 2025',
    title: 'Foundational R&D',
    description: 'Self-directed research and early architecture design, alongside independent computational and analytical validation.',
    status: 'complete',
  },
  {
    date: '2026 · TRL 3',
    title: 'Where we are now',
    description: 'Proof-of-concept validated analytically and computationally; physical prototype work underway in laboratory conditions.',
    status: 'current',
  },
  {
    date: 'Targeted 2027',
    title: 'Commercial pathway',
    description: 'Moving from validated prototype toward pilot-scale production and initial commercial engagement.',
    status: 'next',
  },
];

const businessPath = [
  {
    phase: 'Phase 1 · Near term',
    title: 'Government & Defence R&D',
    description: 'Contracts, research grants, and institutional programmes fund continued validation while building credibility and reference relationships.',
  },
  {
    phase: 'Phase 2 · Mid term',
    title: 'IP licensing',
    description: 'License the architecture to established memory manufacturers seeking a rewritable, high-density product line.',
  },
  {
    phase: 'Phase 3 · Long term',
    title: 'In-house manufacturing',
    description: 'Pilot production line, scaling to full manufacturing for direct, high-margin sale once the architecture is qualified at volume.',
  },
];

const marketSegments = [
  {
    title: 'Government & Defence',
    description: 'Secure, indigenous memory for sovereign and classified systems.',
  },
  {
    title: 'Space & mission-critical',
    description: 'Reliable memory for satellites, aerospace, and radiation-exposed environments.',
  },
  {
    title: 'AI & data infrastructure',
    description: 'Supporting the growing memory demands of AI-driven compute.',
  },
  {
    title: 'Long-term archives',
    description: 'High-density, durable retention for institutional and scientific records.',
  },
];

const marketSizing = [
  {
    label: 'Total addressable market',
    value: '$225.8B (2026) → $345.8B by 2030',
    detail: '11.2% CAGR · Global memory and data infrastructure',
  },
  {
    label: 'Serviceable market',
    value: '$70.3B (2026) → $99.5B by 2032',
    detail: '6.0% CAGR · Next-generation and emerging memory technologies',
  },
  {
    label: 'Initial obtainable segment',
    value: 'Illustrative: 0.1% of SAM ≈ $70–85M by 2030',
    detail: 'Government, defence, space, and archival buyers as first adopters',
  },
];

const leadership = [
  {
    name: 'Tanveer Reddy M',
    role: 'Founder & Director',
    description: 'Self-taught in deep-tech entrepreneurship, Tanveer founded and leads TEXABYTE end to end — from architecture and IP strategy to operations.',
    linkedin: 'https://www.linkedin.com/in/tanveer-reddy-m-6b2653381',
  },
  {
    name: 'Dr. Hamad Syed',
    role: 'Chief Technology Officer & Head of R&D',
    description: 'Holds a PhD in Physics from the University of Hyderabad and leads TEXABYTE’s technical and research programme, bringing a decade of experience in ultrafast photonics.',
    linkedin: 'https://www.linkedin.com/in/dr-hamad-syed-b035aa62',
  },
];

const HERO_PARTICLE_COLORS = Object.freeze({
  dark: ['#3CE0E6', '#2B62D9', '#89B7FF'],
  light: ['#2B62D9', '#3CE0E6', '#82A5E8'],
});

const TIRUPATI_MAP = Object.freeze({
  openStreetMapUrl: 'https://www.openstreetmap.org/?mlat=13.6316&mlon=79.4232#map=13/13.6316/79.4232',
  embedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=79.3632%2C13.5916%2C79.4832%2C13.6716&layer=mapnik',
});

const mobileMenuPanelVariants = {
  closed: {
    opacity: 0,
    y: -12,
    clipPath: 'inset(0 0 100% 0 round 0 0 24px 24px)',
    transition: { duration: 0.24, ease: [0.4, 0, 1, 1] },
  },
  open: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0 0 0% 0 round 0 0 24px 24px)',
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
  },
};

const mobileMenuListVariants = {
  closed: { transition: { staggerChildren: 0.025, staggerDirection: -1 } },
  open: { transition: { delayChildren: 0.08, staggerChildren: 0.055 } },
};

const mobileMenuItemVariants = {
  closed: { opacity: 0, x: -16, filter: 'blur(5px)' },
  open: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.34, ease: [0.16, 1, 0.3, 1] },
  },
};

function MobileMenuToggle({ open, onClick, mode }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={open}
      aria-controls="mobile-site-navigation"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.92 }}
      style={{
        position: 'relative',
        display: 'inline-grid',
        placeItems: 'center',
        width: 42,
        height: 42,
        padding: 0,
        borderRadius: 14,
        border: `1px solid ${mode === 'dark' ? 'rgba(163, 246, 248, 0.24)' : 'rgba(43, 98, 217, 0.18)'}`,
        background: mode === 'dark' ? 'rgba(60, 224, 230, 0.08)' : 'rgba(43, 98, 217, 0.07)',
        color: mode === 'dark' ? '#3CE0E6' : '#2B62D9',
        cursor: 'pointer',
      }}
    >
      <span style={{ position: 'relative', display: 'block', width: 18, height: 14 }} aria-hidden="true">
        <motion.span
          animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 1.75, borderRadius: 99, background: 'currentColor' }}
        />
        <motion.span
          animate={open ? { opacity: 0, scaleX: 0.45 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{ position: 'absolute', top: 6, left: 0, width: '100%', height: 1.75, borderRadius: 99, background: 'currentColor' }}
        />
        <motion.span
          animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', top: 12, left: 0, width: '100%', height: 1.75, borderRadius: 99, background: 'currentColor' }}
        />
      </span>
    </motion.button>
  );
}

function AnimatedMapPin({ mode, reduceMotion }) {
  const pinFilter = mode === 'dark'
    ? 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.48)) drop-shadow(0 0 24px rgba(60, 224, 230, 0.72))'
    : 'drop-shadow(0 12px 22px rgba(11, 18, 51, 0.26)) drop-shadow(0 0 22px rgba(43, 98, 217, 0.4))';

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: 2,
        width: 64,
        height: 82,
        ml: '-32px',
        mt: '-78px',
        pointerEvents: 'none',
      }}
    >
      {!reduceMotion && (
        <>
          <Box
            component={motion.span}
            animate={{ scale: [0.7, 1.7, 2.25], opacity: [0.46, 0.12, 0] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: 'easeOut' }}
            sx={{
              position: 'absolute',
              left: 12,
              bottom: 0,
              width: 40,
              height: 14,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              filter: 'blur(1px)',
            }}
          />
          <Box
            component={motion.span}
            animate={{ scale: [0.7, 1.7, 2.25], opacity: [0.42, 0.1, 0] }}
            transition={{ duration: 2.1, delay: 1.05, repeat: Infinity, ease: 'easeOut' }}
            sx={{
              position: 'absolute',
              left: 12,
              bottom: 0,
              width: 40,
              height: 14,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              filter: 'blur(1px)',
            }}
          />
        </>
      )}
      <Box
        component={motion.span}
        animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
        transition={reduceMotion ? undefined : { duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 7,
          display: 'grid',
          placeItems: 'center',
          width: 50,
          height: 64,
          color: 'primary.main',
          filter: pinFilter,
        }}
      >
        <LocationOn sx={{ fontSize: 54 }} />
        <Box
          sx={{
            position: 'absolute',
            top: 18,
            left: 21,
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: mode === 'dark' ? '#06070D' : '#FFFFFF',
          }}
        />
      </Box>
    </Box>
  );
}

function Preloader({ done }) {
  return (
    <div className={'preloader ' + (done ? 'done' : '')}>
      <div className="preloader-curtain left" />
      <div className="preloader-curtain right" />
      <div className="preloader-content">
        <img src="/logo-t-blue.png" alt="TEXABYTE" className="preloader-logo" />
        <div className="preloader-dots">
          <div className="preloader-dot" />
          <div className="preloader-dot" />
          <div className="preloader-dot" />
        </div>
        <div className="preloader-text">Loading...</div>
      </div>
    </div>
  );
}

function ScrollToTop({ onNavigate }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <MagneticButton>
      <button
        className={'scroll-top-btn ' + (visible ? 'visible' : '')}
        onClick={() => onNavigate('top')}
        aria-label="Scroll to top"
      >
        <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4 4 12h6v8h4v-8h6z" />
        </svg>
      </button>
    </MagneticButton>
  );
}

function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <Box sx={{ maxWidth: 760, mx: align === 'center' ? 'auto' : 0, textAlign: align, mb: 6 }}>
      {eyebrow && (
        <Typography
          variant="overline"
          sx={{
            color: 'primary.main',
            fontWeight: 700,
            letterSpacing: '0.16em',
            display: 'block',
            mb: 1,
          }}
        >
          {eyebrow}
        </Typography>
      )}
      <Typography
        variant="h2"
        sx={{
          color: 'text.primary',
          fontSize: { xs: '2.2rem', md: '3.15rem' },
          lineHeight: 1.12,
          mb: description ? 2 : 0,
        }}
      >
        <SplitText text={title} />
      </Typography>
      {description && (
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.08rem', lineHeight: 1.72 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subject = encodeURIComponent('TEXABYTE website enquiry from ' + formData.get('name'));
    const body = encodeURIComponent(
      'Name: ' + formData.get('name') + '\n' +
      'Email: ' + formData.get('email') + '\n\n' +
      formData.get('message')
    );
    window.location.href = 'mailto:info@texabyte.co.in?subject=' + subject + '&body=' + body;
    setSubmitted(true);
  };

  return (
    <Box
      component="form"
      onSubmit={submit}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6" component="h3" sx={{ color: 'text.primary', mb: 3, fontWeight: 700 }}>
        Send a message
      </Typography>
      <Stack spacing={2.25}>
        <TextField required label="Name" name="name" fullWidth />
        <TextField required label="Your email" name="email" type="email" fullWidth />
        <TextField required label="Message" name="message" multiline rows={4} fullWidth />
        <Button type="submit" variant="contained" size="large" sx={{ alignSelf: 'flex-start', borderRadius: 99, px: 3.5 }}>
          Open email message
        </Button>
      </Stack>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 2 }}>
        This opens a pre-filled email in your mail app; this website does not store or send your message.
      </Typography>
      {submitted && (
        <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', mt: 1 }}>
          Your email client should now be ready with the message.
        </Typography>
      )}
    </Box>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollProgress = useScrollProgress();
  const activeSection = useActiveSection(SECTION_IDS);
  const { scrolled } = useNavScroll();
  const { mode, toggleColorMode } = useColorMode();
  const supportsCursorEffect = useMediaQuery('(hover: hover) and (pointer: fine)', { noSsr: true });
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', { noSsr: true });
  const logoSrc = '/logo-texabyte-tagline.png';
  const logoHeight = scrolled ? 21 : 26;

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    let frame;

    const syncSectionFromLocation = (behavior = 'auto') => {
      const { sectionId, usesLegacyHash } = getSectionFromLocation();
      if (usesLegacyHash) {
        window.history.replaceState({ sectionId }, '', getSectionPath(sectionId));
      }
      frame = window.requestAnimationFrame(() => scrollToSection(sectionId, behavior));
    };

    syncSectionFromLocation();
    const onPopState = () => syncSectionFromLocation();
    const onHashChange = () => syncSectionFromLocation();
    window.addEventListener('popstate', onPopState);
    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  const navigateToSection = (sectionId, event) => {
    if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)) return;
    event?.preventDefault();

    const nextPath = getSectionPath(sectionId);
    if (window.location.pathname !== nextPath || window.location.hash) {
      window.history.pushState({ sectionId }, '', nextPath);
    }
    setMobileMenuOpen(false);
    scrollToSection(sectionId);
  };

  return (
    <>
      {supportsCursorEffect && !prefersReducedMotion && (
        <Suspense fallback={null}>
          <SplashCursor
            key={mode + '-splash-cursor'}
            SIM_RESOLUTION={96}
            DYE_RESOLUTION={1024}
            DENSITY_DISSIPATION={3}
            VELOCITY_DISSIPATION={1.5}
            PRESSURE={0.12}
            PRESSURE_ITERATIONS={18}
            CURL={3}
            SPLAT_RADIUS={0.16}
            SPLAT_FORCE={4200}
            TRANSPARENT
            RAINBOW_MODE={false}
            COLOR={mode === 'dark' ? '#3CE0E6' : '#2B62D9'}
          />
        </Suspense>
      )}
      <Preloader done={loaded} />

      <AppBar
        position="sticky"
        elevation={0}
        color="transparent"
        sx={{
          top: 0,
          zIndex: 1200,
          // Pull the hero beneath the sticky bar so the unscrolled backdrop can genuinely blur it.
          mb: scrolled ? '-56px' : '-64px',
          bgcolor: scrolled
            ? (mode === 'dark' ? '#06070D' : '#FFFFFF')
            : (mode === 'dark' ? 'rgba(4, 10, 20, 0.46)' : 'rgba(255, 255, 255, 0.48)'),
          backdropFilter: scrolled ? 'none' : 'blur(22px) saturate(185%)',
          WebkitBackdropFilter: scrolled ? 'none' : 'blur(22px) saturate(185%)',
          borderBottom: '1px solid',
          borderColor: scrolled
            ? 'divider'
            : (mode === 'dark' ? 'rgba(163, 246, 248, 0.18)' : 'rgba(43, 98, 217, 0.15)'),
          boxShadow: scrolled
            ? (mode === 'dark' ? '0 10px 30px rgba(0, 0, 0, 0.28)' : '0 10px 28px rgba(11, 18, 51, 0.08)')
            : '0 8px 24px rgba(2, 10, 20, 0.10)',
          transition: 'margin-bottom 220ms ease, background-color 220ms ease, border-color 220ms ease, box-shadow 220ms ease, backdrop-filter 220ms ease',
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            minHeight: (scrolled ? '56px' : '64px') + ' !important',
            transition: 'min-height 220ms ease',
          }}
        >
          <Box
            component="a"
            href={getSectionPath('top')}
            onClick={(event) => navigateToSection('top', event)}
            aria-label="TEXABYTE home"
            sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
          >
            <Box
              component="img"
              src={logoSrc}
              alt="TEXABYTE"
              width={158}
              height={26}
              sx={{
                height: { xs: scrolled ? 20 : 23, sm: logoHeight },
                width: 'auto',
                maxWidth: { xs: 158, sm: 'none' },
                transition: 'height 220ms ease',
              }}
            />
          </Box>

          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 3 }}>
            {NAV_ITEMS.map((item) => (
              <Box
                key={item.id}
                component="a"
                href={getSectionPath(item.id)}
                onClick={(event) => navigateToSection(item.id, event)}
                className={'nav-link ' + (activeSection === item.id ? 'active' : '')}
                sx={{
                  color: activeSection === item.id ? 'primary.main' : 'text.secondary',
                  textDecoration: 'none',
                  fontWeight: activeSection === item.id ? 700 : 500,
                  fontSize: '0.88rem',
                  transition: 'color 160ms ease',
                }}
              >
                {item.label}
              </Box>
            ))}
            <IconButton onClick={toggleColorMode} aria-label="Toggle color mode" size="small">
              {mode === 'dark'
                ? <Brightness7 sx={{ color: '#3CE0E6' }} />
                : <Brightness4 sx={{ color: '#2B62D9' }} />}
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center' }}>
            <IconButton
              onClick={toggleColorMode}
              aria-label="Toggle color mode"
              size="small"
              sx={{
                mr: 1,
                width: 38,
                height: 38,
                border: '1px solid',
                borderColor: mode === 'dark' ? 'rgba(163, 246, 248, 0.2)' : 'rgba(43, 98, 217, 0.15)',
                bgcolor: mode === 'dark' ? 'rgba(60, 224, 230, 0.06)' : 'rgba(43, 98, 217, 0.05)',
              }}
            >
              {mode === 'dark'
                ? <Brightness7 sx={{ color: '#3CE0E6' }} />
                : <Brightness4 sx={{ color: '#2B62D9' }} />}
            </IconButton>
            <MobileMenuToggle
              open={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
              mode={mode}
            />
          </Box>
        </Toolbar>

        <AnimatePresence initial={false}>
          {mobileMenuOpen && (
          <Box
            key="mobile-navigation"
            id="mobile-site-navigation"
            component={motion.div}
            variants={mobileMenuPanelVariants}
            initial="closed"
            animate="open"
            exit="closed"
            sx={{
              display: { xs: 'block', lg: 'none' },
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              overflow: 'hidden',
              p: 2,
              pb: 2.25,
              bgcolor: mode === 'dark' ? 'rgba(6, 7, 13, 0.96)' : 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(26px) saturate(170%)',
              WebkitBackdropFilter: 'blur(26px) saturate(170%)',
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: mode === 'dark' ? 'rgba(163, 246, 248, 0.2)' : 'rgba(43, 98, 217, 0.15)',
              boxShadow: mode === 'dark' ? '0 22px 44px rgba(0, 0, 0, 0.42)' : '0 22px 44px rgba(11, 18, 51, 0.14)',
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: mode === 'dark'
                  ? 'radial-gradient(circle at 85% 0%, rgba(60,224,230,0.14), transparent 42%)'
                  : 'radial-gradient(circle at 85% 0%, rgba(43,98,217,0.12), transparent 42%)',
              }}
            />
            <Box sx={{ position: 'relative' }}>
              <Typography variant="overline" sx={{ display: 'block', px: 1.5, mb: 1, color: 'primary.main', fontWeight: 700, letterSpacing: '0.14em' }}>
                Navigate TEXABYTE
              </Typography>
              <Box component={motion.div} variants={mobileMenuListVariants}>
                {NAV_ITEMS.map((item, index) => {
                  const isActive = activeSection === item.id;
                  return (
                    <Box
                      key={item.id}
                      component={motion.a}
                      variants={mobileMenuItemVariants}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.985 }}
                      href={getSectionPath(item.id)}
                      onClick={(event) => navigateToSection(item.id, event)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        minHeight: 57,
                        px: 1.5,
                        py: 1,
                        borderRadius: 2.5,
                        color: isActive ? 'primary.main' : 'text.primary',
                        textDecoration: 'none',
                        border: '1px solid',
                        borderColor: isActive
                          ? (mode === 'dark' ? 'rgba(60,224,230,0.28)' : 'rgba(43,98,217,0.22)')
                          : 'transparent',
                        bgcolor: isActive
                          ? (mode === 'dark' ? 'rgba(60,224,230,0.09)' : 'rgba(43,98,217,0.07)')
                          : 'transparent',
                        '&:hover': {
                          bgcolor: mode === 'dark' ? 'rgba(60,224,230,0.08)' : 'rgba(43,98,217,0.06)',
                        },
                      }}
                    >
                      <Typography variant="caption" sx={{ width: 24, color: isActive ? 'primary.main' : 'text.secondary', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}>
                        {String(index + 1).padStart(2, '0')}
                      </Typography>
                      <Typography sx={{ flex: 1, fontWeight: isActive ? 700 : 600, fontSize: '1rem' }}>
                        {item.label}
                      </Typography>
                      <ArrowOutward sx={{ fontSize: 18, opacity: isActive ? 1 : 0.55 }} />
                    </Box>
                  );
                })}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mt: 1.75, px: 1.5, pt: 1.75, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em' }}>
                  TIRUPATI · INDIA
                </Typography>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main', boxShadow: '0 0 14px currentColor' }} />
              </Box>
            </Box>
          </Box>
          )}
        </AnimatePresence>
        <div className="scroll-progress" style={{ transform: 'scaleX(' + scrollProgress + ')' }} />
      </AppBar>

      <Box
        id="top"
        component="section"
        sx={{
          minHeight: { xs: 'auto', md: '100dvh' },
          pt: { xs: 12, md: 10 },
          pb: { xs: 8, md: 10 },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: mode === 'dark' ? '#06070D' : '#EEF5FB',
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, opacity: mode === 'dark' ? 0.95 : 0.72 }}>
          <Suspense fallback={<Skeleton variant="rectangular" width="100%" height="100%" animation="wave" sx={{ bgcolor: mode === 'dark' ? '#0B1233' : '#EAF1FC' }} />}>
            <AuroraBackground
              colorStops={mode === 'dark' ? ['#3CE0E6', '#2B62D9', '#0B1233'] : ['#A9F4F6', '#7FA9F1', '#EAF1FC']}
              amplitude={1.28}
              blend={0.64}
              speed={0.92}
              lightMode={mode === 'light'}
            />
          </Suspense>
        </Box>
        {!prefersReducedMotion && (
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              opacity: mode === 'dark' ? 0.9 : 0.38,
              pointerEvents: 'none',
              mixBlendMode: mode === 'dark' ? 'screen' : 'normal',
            }}
          >
            <Suspense fallback={null}>
              <HeroParticles
                particleCount={220}
                particleSpread={11}
                speed={0.12}
                particleBaseSize={105}
                sizeRandomness={1.25}
                particleColors={HERO_PARTICLE_COLORS[mode]}
              />
            </Suspense>
          </Box>
        )}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background: mode === 'dark'
              ? 'linear-gradient(90deg, rgba(6,7,13,0.88) 0%, rgba(6,7,13,0.54) 48%, rgba(6,7,13,0.2) 100%)'
              : 'linear-gradient(90deg, rgba(243,245,251,0.82) 0%, rgba(243,245,251,0.45) 50%, rgba(243,245,251,0.12) 100%)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
          <Grid container spacing={{ xs: 5, md: 8 }} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: { xs: 4, md: 6 },
                  bgcolor: mode === 'dark' ? 'rgba(6, 11, 26, 0.52)' : 'rgba(255, 255, 255, 0.58)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid',
                  borderColor: mode === 'dark' ? 'rgba(163, 246, 248, 0.2)' : 'rgba(43, 98, 217, 0.14)',
                  boxShadow: mode === 'dark' ? '0 30px 70px rgba(0, 0, 0, 0.3)' : '0 30px 70px rgba(11, 18, 51, 0.12)',
                }}
              >
                <Typography
                  variant="overline"
                  sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.15em', mb: 2, display: 'block' }}
                >
                  Indian deep-tech · Tirupati, Andhra Pradesh
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.6rem', sm: '3.35rem', lg: '4.15rem' },
                    fontWeight: 600,
                    color: 'text.primary',
                    lineHeight: 1.04,
                    letterSpacing: '-0.045em',
                    mb: 3,
                  }}
                >
                  <SplitText text="India imports 100% of its memory technology. We’re building the exception." />
                </Typography>
                <Typography variant="h6" component="h2" sx={{ color: 'text.secondary', mb: 3.5, fontWeight: 400, lineHeight: 1.6, maxWidth: 680 }}>
                  <BlurText text="TEXABYTE is an Indian deep-tech company advancing optophotonics and interconnect-based memory — engineered from first principles, from a research bench in Tirupati, for the world’s memory infrastructure." />
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 0.75,
                    mb: 4,
                    border: '1px solid',
                    borderColor: 'primary.main',
                    borderRadius: 99,
                    color: 'primary.main',
                    bgcolor: mode === 'dark' ? 'rgba(60,224,230,0.07)' : 'rgba(43,98,217,0.06)',
                  }}
                >
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main', boxShadow: '0 0 12px currentColor' }} />
                  <Typography variant="caption" sx={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}>
                    TRL 3 — commercial pathway targeted for 2027
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }} sx={{ mb: 4 }}>
                  <Box>
                    <Typography variant="h3" sx={{ color: 'primary.main', fontSize: '2rem', fontWeight: 600 }}>
                      <CountUp end={26} duration={1500} suffix="+" />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Patent applications filed</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ color: 'primary.main', fontSize: '2rem', fontWeight: 600 }}>
                      TRL 3
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Analytical and computational validation</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ color: 'primary.main', fontSize: '2rem', fontWeight: 600 }}>
                      2027
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Targeted commercial pathway</Typography>
                  </Box>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
                  <MagneticButton>
                    <Button
                      component="a"
                      href={getSectionPath('technology')}
                      onClick={(event) => navigateToSection('technology', event)}
                      variant="contained"
                      size="large"
                      sx={{ borderRadius: 99, px: 3.5, py: 1.25, fontSize: '1rem' }}
                    >
                      Explore technology
                    </Button>
                  </MagneticButton>
                  <MagneticButton>
                    <Button
                      component="a"
                      href={getSectionPath('manifesto')}
                      onClick={(event) => navigateToSection('manifesto', event)}
                      variant="outlined"
                      color="inherit"
                      size="large"
                      sx={{ borderRadius: 99, px: 3.5, py: 1.25, fontSize: '1rem', borderColor: 'text.secondary' }}
                    >
                      Read the manifesto
                    </Button>
                  </MagneticButton>
                </Stack>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <ScrollFloat duration={1.1}>
                <TiltCard scale={1.025}>
                  <SpotlightCard spotlightColor={mode === 'dark' ? 'rgba(60, 224, 230, 0.35)' : 'rgba(43, 98, 217, 0.25)'}>
                    <Box
                      component="img"
                      src="/optophotonics_hero_1789130810825.jpg"
                      alt="Concept illustration of optophotonic memory hardware"
                      width={600}
                      height={600}
                      fetchpriority="high"
                      sx={{ width: '100%', height: 'auto', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }}
                    />
                  </SpotlightCard>
                </TiltCard>
              </ScrollFloat>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box id="manifesto" component="section" sx={{ py: { xs: 8, md: 14 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <SectionHeading
            eyebrow="Manifesto"
            title="Built where deep tech isn’t supposed to start."
            description="Why a Tier-2 city, a self-taught founder, and no institutional backing is the point — not a workaround."
          />
          <Grid container spacing={{ xs: 5, md: 9 }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <ScrollFloat duration={0.9}>
                <Stack spacing={2.25}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.78 }}>
                    TEXABYTE didn’t begin inside a research lab, a university spin-out programme, or a metro tech corridor. It began as one person’s decision to teach himself physics, materials science, and patent law from scratch — and to build a company around what he learned.
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.78 }}>
                    We’re based in Tirupati, Andhra Pradesh: a Tier-2 city with no dedicated deep-tech ecosystem and no founding institution behind us. The architecture, the IP strategy, and the company itself have been built directly, from the ground up.
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.78 }}>
                    That’s not a limitation we’re working around — it’s the actual point. The goal was never to prove that deep tech can only happen in the usual places. It was to demonstrate what’s possible starting from anywhere in India, today.
                  </Typography>
                </Stack>
              </ScrollFloat>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <ScrollFloat duration={1.05}>
                <Box sx={{ borderLeft: '3px solid', borderColor: 'primary.main', pl: { xs: 2.5, md: 4 }, py: 1 }}>
                  <Typography variant="h5" component="h3" sx={{ fontStyle: 'italic', fontWeight: 500, color: 'text.primary', lineHeight: 1.55 }}>
                    <GradientText colors={['#3CE0E6', '#2B62D9', '#3CE0E6']} speed={5}>
                      “I want my people to be known for what they’re capable of today — not only for what they once were.”
                    </GradientText>
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                    Tanveer Reddy M — Founder & Director
                  </Typography>
                </Box>
              </ScrollFloat>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box id="technology" component="section" sx={{ py: { xs: 8, md: 14 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <SectionHeading
            eyebrow="Technology"
            title="Optophotonics and interconnect-based memory"
            description="We work at the boundary of light and information — using optical interconnects and optically addressable materials to explore memory architectures that move past today’s planar chip designs."
          />
          <Grid container spacing={3}>
            {technologyAreas.map((area, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={area.title}>
                <ScrollFloat duration={0.8 + index * 0.1}>
                  <TiltCard>
                    <Card sx={{ height: '100%', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                      <CardContent sx={{ p: 4 }}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            mb: 3,
                            borderRadius: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: mode === 'dark' ? 'rgba(60,224,230,0.1)' : 'rgba(43,98,217,0.09)',
                            color: 'primary.main',
                          }}
                          dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">' + area.svg + '</svg>' }}
                        />
                        <Typography variant="h6" component="h3" sx={{ color: 'text.primary', fontWeight: 700, mb: 1.25 }}>
                          {area.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                          {area.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </ScrollFloat>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: { xs: 7, md: 10 }, p: { xs: 3, md: 5 }, border: '1px solid', borderColor: 'divider', borderRadius: 4, bgcolor: 'background.paper' }}>
            <Grid container spacing={{ xs: 3, md: 7 }}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Typography variant="h3" sx={{ color: 'text.primary', fontSize: { xs: '1.9rem', md: '2.35rem' }, lineHeight: 1.2 }}>
                  A category most roadmaps skip past
                </Typography>
                <Typography variant="body1" sx={{ color: 'primary.main', mt: 2, fontWeight: 600 }}>
                  Every established path trades one property for another. Ours doesn’t ask you to choose.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 7 }}>
                <Stack spacing={2}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>
                    Fast, rewritable memory today is built on planar, two-dimensional designs — scaling them further keeps getting more expensive and more difficult. Dense, permanent alternatives solve for capacity but give up rewritability entirely.
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>
                    TEXABYTE’s work sits deliberately in the space between: reconfigurable, and built on a physical approach that isn’t limited to a flat, layered structure.
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>
                    We’re not asking anyone to abandon what already works well for its own purpose. We’re building toward a category that today’s roadmaps largely don’t address at all — validated in stages, from analytical modelling through to physical prototyping.
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      <Box id="market" component="section" sx={{ py: { xs: 8, md: 14 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <SectionHeading
            eyebrow="Market"
            title="A large, growing market — with a credible entry point"
            description="Global memory demand is accelerating well beyond what today’s dominant architectures were designed for."
          />
          <Typography variant="h3" sx={{ color: 'text.primary', fontSize: { xs: '1.7rem', md: '2.1rem' }, mb: 1 }}>
            Sizing the opportunity
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 760, mb: 4 }}>
            From the global memory and data-infrastructure market, to the emerging-technology segment TEXABYTE competes in, to a realistic first foothold.
          </Typography>
          <Grid container spacing={2.5}>
            {marketSizing.map((item, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={item.label}>
                <ScrollFloat duration={0.8 + index * 0.1}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 0.5,
                      border: '1px solid',
                      borderColor: index === 2 ? 'primary.main' : 'divider',
                      bgcolor: mode === 'dark' ? 'rgba(11,18,51,0.8)' : 'background.default',
                    }}
                  >
                    <CardContent sx={{ p: 3.25 }}>
                      <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.11em' }}>
                        {item.label}
                      </Typography>
                      <Typography variant="h6" component="h4" sx={{ color: 'text.primary', fontWeight: 700, lineHeight: 1.35, mt: 1.25, mb: 1.5 }}>
                        {item.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        {item.detail}
                      </Typography>
                    </CardContent>
                  </Card>
                </ScrollFloat>
              </Grid>
            ))}
          </Grid>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 2.5 }}>
            Figures from published 2026 industry market-research aggregates. The initial obtainable segment is an illustrative capture-rate scenario, not a modelled forecast.
          </Typography>

          <Box sx={{ mt: { xs: 7, md: 10 } }}>
            <Typography variant="h3" sx={{ color: 'text.primary', fontSize: { xs: '1.7rem', md: '2.1rem' }, mb: 1 }}>
              Where it matters first
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4.5, maxWidth: 760 }}>
              Memory-hungry, high-stakes environments where density, durability, and trust matter more than commodity pricing.
            </Typography>
            <Grid container spacing={3}>
              {marketSegments.map((segment, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={segment.title}>
                  <ScrollFloat duration={0.8 + index * 0.1}>
                    <SpotlightCard spotlightColor={mode === 'dark' ? 'rgba(60, 224, 230, 0.19)' : 'rgba(43, 98, 217, 0.13)'}>
                      <Box sx={{ p: 3, minHeight: 210, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h6" component="h4" sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary' }}>
                          {segment.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                          {segment.description}
                        </Typography>
                      </Box>
                    </SpotlightCard>
                  </ScrollFloat>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Grid container spacing={3} sx={{ mt: { xs: 4, md: 6 } }}>
            {[
              { src: '/quantum_memory_1789130828155.jpg', alt: 'Concept image of quantum memory', label: 'Mission-critical memory' },
              { src: '/ai_hardware_1789131009193.jpg', alt: 'Concept image of AI hardware', label: 'AI and data infrastructure' },
              { src: '/optical-memory-architecture.svg', alt: 'Optical memory architecture diagram', label: 'Optical architecture study' },
            ].map((image, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={image.src}>
                <ScrollFloat duration={0.85 + index * 0.1}>
                  <TiltCard scale={1.015}>
                    <Box component="figure" sx={{ m: 0 }}>
                      <Box
                        component="img"
                        src={image.src}
                        alt={image.alt}
                        width={400}
                        height={400}
                        loading="lazy"
                        sx={{
                          display: 'block',
                          width: '100%',
                          height: 'auto',
                          aspectRatio: '1 / 1',
                          objectFit: 'cover',
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          boxShadow: mode === 'dark' ? '0 16px 38px rgba(0,0,0,0.35)' : '0 16px 38px rgba(11,18,51,0.13)',
                        }}
                      />
                      <Typography component="figcaption" variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 1.25 }}>
                        {image.label}
                      </Typography>
                    </Box>
                  </TiltCard>
                </ScrollFloat>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box id="roadmap" component="section" sx={{ py: { xs: 8, md: 14 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <SectionHeading
            eyebrow="Roadmap"
            title="From lab bench to commercial line"
            description="Each stage is deliberately sequenced — validated before we move to the next."
          />
          <Box sx={{ position: 'relative', ml: { xs: 1.25, md: 3 } }}>
            <Box sx={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 2, bgcolor: 'divider' }} />
            <Stack spacing={5}>
              {roadmap.map((item, index) => (
                <ScrollFloat key={item.title} duration={0.8 + index * 0.1}>
                  <Box sx={{ position: 'relative', pl: { xs: 4.5, md: 6 } }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: -5,
                        top: 7,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: item.status === 'next' ? 'background.paper' : 'primary.main',
                        border: '2px solid',
                        borderColor: item.status === 'next' ? 'divider' : 'primary.main',
                        boxShadow: item.status === 'current' ? '0 0 0 7px rgba(60,224,230,0.15), 0 0 18px rgba(60,224,230,0.65)' : 'none',
                      }}
                    />
                    <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.12em' }}>
                      {item.date}
                    </Typography>
                    <Typography variant="h5" component="h3" sx={{ color: 'text.primary', fontWeight: 700, mt: 0.25, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 720, lineHeight: 1.7 }}>
                      {item.description}
                    </Typography>
                  </Box>
                </ScrollFloat>
              ))}
            </Stack>
          </Box>

          <Box sx={{ mt: { xs: 8, md: 12 } }}>
            <Typography variant="h3" sx={{ color: 'text.primary', fontSize: { xs: '1.8rem', md: '2.35rem' }, mb: 1 }}>
              How this becomes a business
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              A phased path from validation to manufacturing — each phase funds and de-risks the next.
            </Typography>
            <Grid container spacing={3}>
              {businessPath.map((item, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={item.title}>
                  <ScrollFloat duration={0.8 + index * 0.1}>
                    <Card sx={{ height: '100%', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                      <CardContent sx={{ p: 3.5 }}>
                        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.1em' }}>
                          {item.phase}
                        </Typography>
                        <Typography variant="h6" component="h4" sx={{ color: 'text.primary', fontWeight: 700, mt: 1.25, mb: 1.25 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                          {item.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </ScrollFloat>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      <Box id="team" component="section" sx={{ py: { xs: 8, md: 14 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <SectionHeading
            eyebrow="Team"
            title="The people building it"
            description="A small, founder-led team — deliberately so, at this stage."
            align="center"
          />
          <Grid container spacing={3.5} sx={{ justifyContent: 'center' }}>
            {leadership.map((member, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={member.name}>
                <ScrollFloat duration={0.85 + index * 0.1}>
                  <Card sx={{ height: '100%', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                    <CardContent sx={{ p: { xs: 3.5, md: 4.5 } }}>
                      <Box
                        sx={{
                          width: 68,
                          height: 68,
                          borderRadius: '50%',
                          mb: 3,
                          bgcolor: mode === 'dark' ? 'rgba(60,224,230,0.12)' : 'rgba(43,98,217,0.1)',
                          border: '1px solid',
                          borderColor: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'primary.main',
                          fontSize: '1.65rem',
                          fontWeight: 700,
                        }}
                      >
                        {member.name.charAt(0)}
                      </Box>
                      <Typography variant="h5" component="h3" sx={{ color: 'text.primary', fontWeight: 700, mb: 0.5 }}>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700, mb: 2 }}>
                        {member.role}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 3 }}>
                        {member.description}
                      </Typography>
                      <Button
                        component="a"
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        variant="outlined"
                        color="inherit"
                        size="small"
                        sx={{ borderRadius: 99, borderColor: 'divider', color: 'text.primary' }}
                      >
                        View LinkedIn
                      </Button>
                    </CardContent>
                  </Card>
                </ScrollFloat>
              </Grid>
            ))}
          </Grid>
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mt: 4 }}>
            Meeting us in person? Use the contact details below or the LinkedIn profiles above to verify who you’re speaking with.
          </Typography>
        </Container>
      </Box>

      <Box id="contact" component="section" sx={{ py: { xs: 8, md: 14 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <SectionHeading
            eyebrow="Contact"
            title="Get in touch"
            description="Write to us directly, or send a message below — either opens straight into your email client, addressed to the right person."
          />
          <Grid container spacing={{ xs: 4, md: 7 }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={3.5}>
                <Box>
                  <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.12em' }}>
                    Founder & Director
                  </Typography>
                  <Typography component="a" href="mailto:info@texabyte.co.in" variant="h5" sx={{ display: 'block', color: 'text.primary', textDecoration: 'none', mt: 0.5, '&:hover': { color: 'primary.main' } }}>
                    info@texabyte.co.in
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.12em' }}>
                    CTO & Head of R&D
                  </Typography>
                  <Typography component="a" href="mailto:hamad@texabyte.co.in" variant="h5" sx={{ display: 'block', color: 'text.primary', textDecoration: 'none', mt: 0.5, '&:hover': { color: 'primary.main' } }}>
                    hamad@texabyte.co.in
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.12em' }}>
                    Social
                  </Typography>
                  <Stack direction="row" spacing={2} useFlexGap sx={{ mt: 1, flexWrap: 'wrap' }}>
                    {leadership.map((member) => (
                      <Button
                        key={member.name}
                        component="a"
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        color="inherit"
                        variant="text"
                        sx={{ px: 0, color: 'text.primary', textTransform: 'none', '&:hover': { color: 'primary.main', background: 'transparent' } }}
                      >
                        {member.name}
                      </Button>
                    ))}
                  </Stack>
                </Box>
                <Box sx={{ p: 2.5, borderLeft: '3px solid', borderColor: 'primary.main', bgcolor: mode === 'dark' ? 'rgba(60,224,230,0.055)' : 'rgba(43,98,217,0.055)' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    Our work is protected by a broad portfolio of patent applications filed with the Indian Patent Office. They are publicly searchable through the government’s InPASS patent database.
                  </Typography>
                  <Typography component="a" href="https://iprsearch.ipindia.gov.in/publicsearch" target="_blank" rel="noreferrer" variant="body2" sx={{ color: 'primary.main', display: 'inline-block', mt: 1, fontWeight: 700 }}>
                    Search InPASS
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <ContactForm />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        id="location"
        component="section"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 8, md: 12 },
          bgcolor: 'background.paper',
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: mode === 'dark'
              ? 'radial-gradient(560px 360px at 4% 55%, rgba(60,224,230,0.09), transparent 72%)'
              : 'radial-gradient(560px 360px at 4% 55%, rgba(43,98,217,0.08), transparent 72%)',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Grid container spacing={{ xs: 4, md: 7 }} alignItems="center">
            <Grid size={{ xs: 12, md: 4.5 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.16em', display: 'block', mb: 1 }}>
                Location
              </Typography>
              <Typography variant="h2" sx={{ color: 'text.primary', fontSize: { xs: '2.2rem', md: '3.15rem' }, lineHeight: 1.12, mb: 2 }}>
                Built in Tirupati.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.08rem', lineHeight: 1.72, maxWidth: 500 }}>
                TEXABYTE is based in Tirupati, Andhra Pradesh, India — developing deep-tech from a Tier-2 city for a global memory infrastructure.
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 3,
                  px: 1.5,
                  py: 1,
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: mode === 'dark' ? 'rgba(60,224,230,0.22)' : 'rgba(43,98,217,0.18)',
                  bgcolor: mode === 'dark' ? 'rgba(60,224,230,0.06)' : 'rgba(43,98,217,0.05)',
                }}
              >
                <LocationOn sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700 }}>
                  Tirupati, Andhra Pradesh, India
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', lineHeight: 1.65, mt: 2, maxWidth: 460 }}>
                Map pin shows the city centre only; please contact us to arrange a visit or meeting.
              </Typography>
              <Button
                component="a"
                href={TIRUPATI_MAP.openStreetMapUrl}
                target="_blank"
                rel="noreferrer"
                variant="outlined"
                endIcon={<ArrowOutward />}
                sx={{ mt: 3, borderRadius: 99, px: 2.5 }}
              >
                Open Tirupati map
              </Button>
            </Grid>

            <Grid size={{ xs: 12, md: 7.5 }}>
              <ScrollFloat>
                <Box
                  sx={{
                    position: 'relative',
                    minHeight: { xs: 330, sm: 390, md: 440 },
                    overflow: 'hidden',
                    borderRadius: { xs: 3, md: 4 },
                    border: '1px solid',
                    borderColor: mode === 'dark' ? 'rgba(163,246,248,0.24)' : 'rgba(43,98,217,0.16)',
                    boxShadow: mode === 'dark' ? '0 28px 72px rgba(0,0,0,0.32)' : '0 26px 64px rgba(11,18,51,0.15)',
                    bgcolor: mode === 'dark' ? '#09111C' : '#DCE8F6',
                  }}
                >
                  <Box
                    component="iframe"
                    title="Tirupati, Andhra Pradesh, India city map"
                    src={TIRUPATI_MAP.embedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      border: 0,
                      filter: mode === 'dark' ? 'saturate(0.72) brightness(0.64) contrast(1.12)' : 'saturate(0.86) contrast(1.04)',
                    }}
                  />
                  <Box
                    aria-hidden="true"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 1,
                      pointerEvents: 'none',
                      background: mode === 'dark'
                        ? 'linear-gradient(180deg, rgba(4,6,13,0.14), transparent 34%, rgba(4,6,13,0.16))'
                        : 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent 34%, rgba(238,245,251,0.12))',
                    }}
                  />
                  <AnimatedMapPin mode={mode} reduceMotion={prefersReducedMotion} />
                  <Box
                    sx={{
                      position: 'absolute',
                      zIndex: 3,
                      top: { xs: 14, sm: 18 },
                      left: { xs: 14, sm: 18 },
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.8,
                      px: 1.1,
                      py: 0.65,
                      borderRadius: 99,
                      bgcolor: mode === 'dark' ? 'rgba(4,6,13,0.78)' : 'rgba(255,255,255,0.82)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid',
                      borderColor: mode === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(11,18,51,0.12)',
                    }}
                  >
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', boxShadow: '0 0 12px currentColor' }} />
                    <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.06em' }}>
                      CITY-LEVEL MAP
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      zIndex: 3,
                      right: { xs: 14, sm: 18 },
                      bottom: { xs: 12, sm: 16 },
                      px: 1,
                      py: 0.45,
                      borderRadius: 1.5,
                      bgcolor: mode === 'dark' ? 'rgba(4,6,13,0.78)' : 'rgba(255,255,255,0.82)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Typography component="a" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" variant="caption" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.65rem', '&:hover': { color: 'primary.main' } }}>
                      © OpenStreetMap contributors
                    </Typography>
                  </Box>
                </Box>
              </ScrollFloat>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 6, md: 7 },
          bgcolor: mode === 'dark' ? '#04060D' : '#F8FAFE',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: mode === 'dark'
              ? 'radial-gradient(600px 280px at 0% 100%, rgba(43,98,217,0.16), transparent 72%), radial-gradient(500px 240px at 96% 0%, rgba(60,224,230,0.10), transparent 72%)'
              : 'radial-gradient(600px 280px at 0% 100%, rgba(43,98,217,0.09), transparent 72%), radial-gradient(500px 240px at 96% 0%, rgba(60,224,230,0.10), transparent 72%)',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Grid container spacing={{ xs: 5, md: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box component="a" href={getSectionPath('top')} onClick={(event) => navigateToSection('top', event)} aria-label="Back to TEXABYTE home" sx={{ display: 'inline-flex' }}>
                <Box component="img" src={logoSrc} alt="TEXABYTE" width={158} height={26} sx={{ height: 28, width: 'auto' }} />
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 270, mt: 2, lineHeight: 1.7 }}>
                Indianising data, globalising innovation.
              </Typography>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mt: 2.5, px: 1.25, py: 0.7, border: '1px solid', borderColor: mode === 'dark' ? 'rgba(60,224,230,0.20)' : 'rgba(43,98,217,0.16)', borderRadius: 99, bgcolor: mode === 'dark' ? 'rgba(60,224,230,0.05)' : 'rgba(43,98,217,0.04)' }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', boxShadow: '0 0 12px currentColor' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em' }}>
                  TIRUPATI · INDIA
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 5, md: 2.5 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.14em' }}>
                Explore
              </Typography>
              <Stack component="nav" aria-label="Footer navigation" spacing={0.8} sx={{ mt: 1.5, alignItems: 'flex-start' }}>
                {NAV_ITEMS.map((item) => (
                  <Box
                    key={item.id}
                    component="a"
                    href={getSectionPath(item.id)}
                    onClick={(event) => navigateToSection(item.id, event)}
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      fontSize: '0.86rem',
                      transition: 'color 160ms ease, transform 160ms ease',
                      '&:hover': { color: 'primary.main', transform: 'translateX(3px)' },
                    }}
                  >
                    {item.label}
                  </Box>
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 7, md: 5.5 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.14em' }}>
                Company information
              </Typography>
              <Box sx={{ mt: 1.5, p: { xs: 2, sm: 2.5 }, border: '1px solid', borderColor: mode === 'dark' ? 'rgba(255,255,255,0.11)' : 'rgba(11,18,51,0.10)', borderRadius: 3, bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.65)', backdropFilter: 'blur(12px)' }}>
                <Stack spacing={0.7}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>TEXABYTE (OPC) Private Limited</Box>
                    {' · CIN U26209AP2025OPC121392'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    DPIIT-recognised startup (Startup India) · Certificate DIPP226777
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    Registered with the Andhra Pradesh Innovation Society (APIS) · ID 2026AP0393
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    Incubated at RTIH (Ratan Tata Innovation Hub), Tirupati · Founded September 2025
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    Official domains: texabyte.co.in and texabyte.tech. The unrelated texabyte.in is not affiliated with TEXABYTE (OPC) Private Limited.
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: { xs: 5, md: 6 }, pt: 2.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              © {new Date().getFullYear()} TEXABYTE (OPC) Private Limited
            </Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5, color: 'text.secondary', fontSize: '0.68rem', letterSpacing: '0.035em', textAlign: { xs: 'left', md: 'right' } }}>
              Designed and developed by
              <Box component="a" href="https://pshrinnovex.com" target="_blank" rel="noreferrer" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35, color: 'primary.main', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline', textUnderlineOffset: '3px' } }}>
                PSHR INNOVEX PRIVATE LIMITED <ArrowOutward sx={{ fontSize: '0.8rem' }} />
              </Box>
            </Typography>
          </Box>
        </Container>
      </Box>

      <ScrollToTop onNavigate={navigateToSection} />
    </>
  );
}

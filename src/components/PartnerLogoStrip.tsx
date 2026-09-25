import React from 'react';

export const PartnerLogoStrip: React.FC = () => {
  const partners = [
    { name: 'aikido', label: 'aikido' },
    { name: 'Parim', label: 'Parim' },
    { name: 'LIVEFORCE', label: 'LIVEFORCE' },
    { name: 'finbite', label: 'finbite' },
    { name: 'ParcelTracker', label: 'ParcelTracker' }
  ];

  return (
    <section
      style={{
        width: '100%',
        padding: '36px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px'
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-caption)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'var(--color-ash-gray)',
          fontWeight: 400
        }}
      >
        Trusted by category-defining founders & venture studios
      </span>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          width: '100%',
          maxWidth: '960px',
          padding: '0 var(--spacing-24)'
        }}
      >
        {partners.map((partner) => (
          <span
            key={partner.name}
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '15px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--color-ink-black)',
              opacity: 0.85,
              userSelect: 'none'
            }}
          >
            {partner.label}
          </span>
        ))}
      </div>
    </section>
  );
};

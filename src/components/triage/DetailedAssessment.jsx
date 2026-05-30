// src/components/triage/DetailedAssessment.jsx
// Router-based SATS discriminator assessment.
// User selects presenting complaint categories, then sees only relevant discriminators.
// Each discriminator shows what colour it upgrades to.
// Based on official SATS discriminator list (South African Triage Group, 2008)

import React, { useState } from 'react';

// ─── COLOUR CONFIG ────────────────────────────────────────────────────────────

const COLOUR = {
  Red:    { bg: '#fee2e2', border: '#ef4444', text: '#b91c1c', badge: '#ef4444' },
  Orange: { bg: '#fff7ed', border: '#f97316', text: '#c2410c', badge: '#f97316' },
  Yellow: { bg: '#fefce8', border: '#eab308', text: '#854d0e', badge: '#ca8a04' },
  Green:  { bg: '#f0fdf4', border: '#22c55e', text: '#166534', badge: '#22c55e' },
};

// ─── DISCRIMINATOR DEFINITIONS ────────────────────────────────────────────────
// key        → matches redFlags key in scoring.js
// label      → display name
// upgrade    → colour this discriminator forces
// category   → which router category shows it

const DISCRIMINATORS = [
  // RESPIRATORY
  { key: 'shortness_of_breath',       label: 'Shortness of breath — acute',         upgrade: 'Orange', category: 'respiratory' },
  { key: 'coughing_blood',            label: 'Coughing blood',                       upgrade: 'Orange', category: 'respiratory' },

  // CARDIAC
  { key: 'chest_pain',                label: 'Chest pain',                           upgrade: 'Orange', category: 'cardiac' },

  // NEUROLOGICAL
  { key: 'active_seizure',            label: 'Seizure — current / convulsing',       upgrade: 'Red',    category: 'neuro' },
  { key: 'seizure_post_ictal',        label: 'Seizure — post-ictal',                 upgrade: 'Orange', category: 'neuro' },
  { key: 'focal_neurology',           label: 'Focal neurology — acute (stroke)',     upgrade: 'Orange', category: 'neuro' },
  { key: 'reduced_consciousness',     label: 'Level of consciousness reduced',       upgrade: 'Orange', category: 'neuro' },
  { key: 'psychosis_aggression',      label: 'Psychosis / Aggression',               upgrade: 'Orange', category: 'neuro' },

  // TRAUMA
  { key: 'high_energy_trauma',        label: 'High energy transfer mechanism',       upgrade: 'Orange', category: 'trauma' },
  { key: 'uncontrolled_bleeding',     label: 'Haemorrhage — uncontrolled',           upgrade: 'Orange', category: 'trauma' },
  { key: 'controlled_bleeding',       label: 'Haemorrhage — controlled',             upgrade: 'Yellow', category: 'trauma' },
  { key: 'threatened_limb',           label: 'Threatened limb',                      upgrade: 'Orange', category: 'trauma' },
  { key: 'fracture_compound',         label: 'Fracture — compound (open)',           upgrade: 'Orange', category: 'trauma' },
  { key: 'fracture_closed',           label: 'Fracture — closed',                    upgrade: 'Yellow', category: 'trauma' },
  { key: 'dislocation_other_joint',   label: 'Dislocation — other joint',            upgrade: 'Orange', category: 'trauma' },
  { key: 'dislocation_finger_toe',    label: 'Dislocation — finger or toe',          upgrade: 'Yellow', category: 'trauma' },

  // BURNS
  { key: 'burn_face_inhalation',      label: 'Burn — face / inhalation',             upgrade: 'Red',    category: 'burns' },
  { key: 'burn_over_20_percent',      label: 'Burn — over 20% body surface',         upgrade: 'Orange', category: 'burns' },
  { key: 'burn_electrical',           label: 'Burn — electrical',                    upgrade: 'Orange', category: 'burns' },
  { key: 'burn_circumferential',      label: 'Burn — circumferential',               upgrade: 'Orange', category: 'burns' },
  { key: 'burn_chemical',             label: 'Burn — chemical',                      upgrade: 'Orange', category: 'burns' },
  { key: 'burn_other',                label: 'Burn — other (minor)',                 upgrade: 'Yellow', category: 'burns' },

  // AIRWAY
  { key: 'airway_obstruction',        label: 'Airway obstruction',                   upgrade: 'Red',    category: 'airway' },

  // METABOLIC / MEDICAL
  { key: 'hypoglycaemia',             label: 'Hypoglycaemia — glucose < 3 mmol/L',  upgrade: 'Red',    category: 'metabolic' },
  { key: 'diabetic_glucose_11_ketonuria', label: 'Diabetic — glucose > 11 AND ketonuria', upgrade: 'Orange', category: 'metabolic' },
  { key: 'diabetic_glucose_17_no_ketonuria', label: 'Diabetic — glucose > 17 (no ketonuria)', upgrade: 'Yellow', category: 'metabolic' },
  { key: 'poisoning_overdose',        label: 'Poisoning / Overdose',                 upgrade: 'Orange', category: 'metabolic' },

  // SURGICAL / GI
  { key: 'vomiting_fresh_blood',      label: 'Vomiting — fresh blood',               upgrade: 'Orange', category: 'surgical' },
  { key: 'persistent_vomiting',       label: 'Vomiting — persistent',                upgrade: 'Yellow', category: 'surgical' },
  { key: 'abdominal_pain',            label: 'Abdominal pain',                       upgrade: 'Yellow', category: 'surgical' },

  // OBSTETRIC
  { key: 'pregnancy_abdominal_trauma', label: 'Pregnancy — abdominal trauma or pain', upgrade: 'Orange', category: 'obstetric' },
  { key: 'pregnancy_trauma',          label: 'Pregnancy — trauma',                   upgrade: 'Yellow', category: 'obstetric' },
  { key: 'pregnancy_pv_bleed',        label: 'Pregnancy — PV bleed',                 upgrade: 'Yellow', category: 'obstetric' },

  // PAIN (standalone)
  { key: 'severe_pain',               label: 'Pain — severe',                        upgrade: 'Orange', category: 'pain' },
  { key: 'moderate_pain',             label: 'Pain — moderate',                      upgrade: 'Yellow', category: 'pain' },
];

// ─── CATEGORY DEFINITIONS ────────────────────────────────────────────────────

const CATEGORIES = [
  { key: 'respiratory', label: 'Respiratory',   icon: '🫁' },
  { key: 'cardiac',     label: 'Cardiac',        icon: '🫀' },
  { key: 'neuro',       label: 'Neurological',   icon: '🧠' },
  { key: 'trauma',      label: 'Trauma / Injury',icon: '🩹' },
  { key: 'burns',       label: 'Burns',          icon: '🔥' },
  { key: 'airway',      label: 'Airway',         icon: '😮‍💨' },
  { key: 'metabolic',   label: 'Metabolic',      icon: '💉' },
  { key: 'surgical',    label: 'Surgical / GI',  icon: '🔬' },
  { key: 'obstetric',   label: 'Obstetric',      icon: '🤰' },
  { key: 'pain',        label: 'Pain',           icon: '⚡' },
];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const UpgradeBadge = ({ colour }) => (
  <span style={{
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '999px',
    backgroundColor: COLOUR[colour].badge,
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    flexShrink: 0,
  }}>
    → {colour}
  </span>
);

const DiscriminatorButton = ({ discriminator, active, onToggle }) => {
  const c = COLOUR[discriminator.upgrade];
  return (
    <button
      onClick={() => onToggle(discriminator.key)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        width: '100%',
        padding: '14px 16px',
        border: active ? `2px solid ${c.border}` : '2px solid #e5e7eb',
        backgroundColor: active ? c.bg : 'white',
        borderRadius: '12px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s ease',
      }}
    >
      <span style={{
        fontSize: '0.95rem',
        fontWeight: active ? '600' : '400',
        color: active ? c.text : '#374151',
        flex: 1,
      }}>
        {discriminator.label}
      </span>
      <UpgradeBadge colour={discriminator.upgrade} />
    </button>
  );
};

const CategoryChip = ({ category, selected, onToggle }) => (
  <button
    onClick={() => onToggle(category.key)}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      border: selected ? '2px solid #2563eb' : '2px solid #e5e7eb',
      backgroundColor: selected ? '#eff6ff' : 'white',
      borderRadius: '999px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: selected ? '600' : '400',
      color: selected ? '#1d4ed8' : '#374151',
      transition: 'all 0.15s ease',
      whiteSpace: 'nowrap',
    }}
  >
    <span>{category.icon}</span>
    <span>{category.label}</span>
  </button>
);

// ─── RESULT BANNER ────────────────────────────────────────────────────────────

const ResultBanner = ({ result }) => {
  if (!result) return null;
  const c = COLOUR[result.priority] || COLOUR.Green;
  return (
    <div style={{
      padding: '16px 20px',
      backgroundColor: c.bg,
      border: `2px solid ${c.border}`,
      borderRadius: '14px',
      marginBottom: '24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: c.text, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Current Priority
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: c.text, lineHeight: 1.1 }}>
            {result.priority}
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.8rem', color: c.text, opacity: 0.8 }}>
          <div>TEWS: {result.base_score}</div>
          {result.discriminator_override && (
            <div style={{ marginTop: '2px', fontWeight: '600' }}>↑ Discriminator override</div>
          )}
          {result.clinician_override && (
            <div style={{ marginTop: '2px', fontWeight: '600' }}>↑ Clinician override</div>
          )}
        </div>
      </div>
      {result.override_reason && (
        <div style={{ marginTop: '8px', fontSize: '0.85rem', color: c.text, opacity: 0.9, fontStyle: 'italic' }}>
          {result.override_reason}
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const DetailedAssessment = ({
  redFlags,
  setRedFlags,
  age,
  result,
  onBack,
  onFinish,
}) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [noneApply, setNoneApply] = useState(false);

  const toggleCategory = (key) => {
    setNoneApply(false);
    setSelectedCategories(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const toggleFlag = (key) => {
    setRedFlags(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNoneApply = () => {
    setNoneApply(true);
    setSelectedCategories([]);
  };

  // Discriminators to show — union of all selected categories
  const visibleDiscriminators = selectedCategories.length > 0
    ? DISCRIMINATORS.filter(d => selectedCategories.includes(d.category))
    : [];

  // Count active flags
  const activeCount = Object.values(redFlags).filter(Boolean).length;

  // Group visible discriminators by upgrade colour for display
  const grouped = {
    Red:    visibleDiscriminators.filter(d => d.upgrade === 'Red'),
    Orange: visibleDiscriminators.filter(d => d.upgrade === 'Orange'),
    Yellow: visibleDiscriminators.filter(d => d.upgrade === 'Yellow'),
  };

  return (
    <div style={{ padding: '24px', maxWidth: '720px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px 14px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Back
        </button>
        <div>
          <h2 style={{ margin: 0, color: '#1e40af', fontSize: '1.2rem', fontWeight: '700' }}>
            Clinical Discriminators
          </h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
            Select presenting complaint categories, then flag any that apply
          </p>
        </div>
      </div>

      {/* Live result banner */}
      <ResultBanner result={result} />

      {/* AVPU warning if not recorded */}
      {result && !result.avpu_recorded && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#fef3c7',
          border: '2px solid #f59e0b',
          borderRadius: '10px',
          marginBottom: '20px',
          fontSize: '0.85rem',
          color: '#92400e',
          display: 'flex',
          gap: '8px',
        }}>
          <span>⚠️</span>
          <span><strong>AVPU not recorded.</strong> Return to vitals to record level of consciousness — it contributes up to 3 TEWS points.</span>
        </div>
      )}

      {/* Step 1: Category selection */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: '700',
          color: '#6b7280',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}>
          Step 1 — Presenting complaint
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {CATEGORIES.map(cat => (
            <CategoryChip
              key={cat.key}
              category={cat}
              selected={selectedCategories.includes(cat.key)}
              onToggle={toggleCategory}
            />
          ))}
        </div>

        <button
          onClick={handleNoneApply}
          style={{
            padding: '8px 16px',
            border: noneApply ? '2px solid #6b7280' : '2px solid #e5e7eb',
            backgroundColor: noneApply ? '#f3f4f6' : 'white',
            borderRadius: '999px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            color: '#6b7280',
            fontWeight: noneApply ? '600' : '400',
          }}
        >
          None of the above
        </button>
      </div>

      {/* Step 2: Discriminator flags */}
      {selectedCategories.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#6b7280',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Step 2 — Flag any that apply
          </div>

          {/* Red group */}
          {grouped.Red.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
              }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Immediate (Red)
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {grouped.Red.map(d => (
                  <DiscriminatorButton
                    key={d.key}
                    discriminator={d}
                    active={!!redFlags[d.key]}
                    onToggle={toggleFlag}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Orange group */}
          {grouped.Orange.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
              }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f97316' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Very Urgent (Orange)
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {grouped.Orange.map(d => (
                  <DiscriminatorButton
                    key={d.key}
                    discriminator={d}
                    active={!!redFlags[d.key]}
                    onToggle={toggleFlag}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Yellow group */}
          {grouped.Yellow.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
              }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#854d0e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Urgent (Yellow)
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {grouped.Yellow.map(d => (
                  <DiscriminatorButton
                    key={d.key}
                    discriminator={d}
                    active={!!redFlags[d.key]}
                    onToggle={toggleFlag}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* None apply — confirmation state */}
      {noneApply && (
        <div style={{
          padding: '16px',
          backgroundColor: '#f0fdf4',
          border: '2px solid #22c55e',
          borderRadius: '12px',
          marginBottom: '28px',
          fontSize: '0.9rem',
          color: '#166534',
        }}>
          ✓ No clinical discriminators identified. TEWS score stands.
        </div>
      )}

      {/* Active flags summary */}
      {activeCount > 0 && (
        <div style={{
          padding: '14px 16px',
          backgroundColor: '#fef2f2',
          border: '2px solid #fca5a5',
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: '0.85rem',
          color: '#991b1b',
        }}>
          <strong>{activeCount} discriminator{activeCount > 1 ? 's' : ''} flagged:</strong>{' '}
          {Object.keys(redFlags)
            .filter(k => redFlags[k])
            .map(k => k.replace(/_/g, ' '))
            .join(', ')}
        </div>
      )}

      {/* Senior discretion note */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        marginBottom: '24px',
        fontSize: '0.8rem',
        color: '#64748b',
        lineHeight: 1.5,
      }}>
        <strong>Senior clinician discretion applies.</strong> Triage scores may be adjusted by a senior health professional, particularly for patients with chronic disease where baseline physiology is abnormal.
      </div>

      {/* Finish button */}
      <button
        onClick={onFinish}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: '#1e40af',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1.05rem',
          fontWeight: '700',
          cursor: 'pointer',
          letterSpacing: '0.02em',
        }}
      >
        Finalise Assessment →
      </button>
    </div>
  );
};

export default DetailedAssessment;
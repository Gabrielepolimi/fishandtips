'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ArticleGateConfig } from '../../lib/article-gate-config';
import {
  TECNICA_OPTIONS,
  ZONA_PESCA_OPTIONS,
  type TecnicaPreferita,
  type ZonaPesca,
} from '../../lib/brevo-gate-constants';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContentGateProps = {
  gateConfig: ArticleGateConfig;
  onSuccess: () => void;
};

function MultiPillGroup<T extends string>({
  label,
  hint,
  options,
  values,
  onToggle,
  disabled,
}: {
  label: string;
  hint?: string;
  options: readonly T[];
  values: T[];
  onToggle: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-gray-800">{label}</legend>
      {hint ? <p className="text-xs text-gray-500 -mt-1">{hint}</p> : null}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = values.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onToggle(opt)}
              className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
                selected
                  ? 'border-brand-blue bg-brand-blue text-white shadow-sm'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-brand-blue/50'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function PillGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: readonly T[];
  value: T | '';
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-gray-800">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onChange(opt)}
              className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
                selected
                  ? 'border-brand-blue bg-brand-blue text-white shadow-sm'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-brand-blue/50'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function ContentGate({ gateConfig, onSuccess }: ContentGateProps) {
  const { copy, storageKey, pdfBackupUrl } = gateConfig;
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [zonaPesca, setZonaPesca] = useState<ZonaPesca | ''>('');
  const [tecniche, setTecniche] = useState<TecnicaPreferita[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isFormValid = useMemo(
    () =>
      EMAIL_REGEX.test(email.trim()) &&
      nome.trim().length >= 2 &&
      ZONA_PESCA_OPTIONS.includes(zonaPesca as ZonaPesca) &&
      tecniche.length >= 1 &&
      tecniche.every((t) => TECNICA_OPTIONS.includes(t)),
    [email, nome, zonaPesca, tecniche]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setErrorMessage('');
    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          nome: nome.trim(),
          zonaPesca,
          tecniche,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Qualcosa è andato storto. Riprova tra poco.');
      }

      try {
        localStorage.setItem(storageKey, '1');
      } catch {
        /* storage non disponibile */
      }

      setStatus('success');
      onSuccess();
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Qualcosa è andato storto. Riprova tra poco.'
      );
    }
  };

  if (status === 'success') {
    return (
      <div
        className="my-8 rounded-2xl border-2 border-brand-blue/30 bg-gradient-to-br from-brand-blue/5 via-white to-brand-yellow/15 p-6 sm:p-8 shadow-sm"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-brand-blue font-bold text-lg">
            ✓
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-blue mb-2">Perfetto!</h2>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              {copy.successMessage}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3">Vuoi scaricarla subito? Usa il link qui sotto:</p>
        <a
          href={pdfBackupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark transition-colors"
        >
          {copy.pdfLinkLabel}
        </a>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-2xl border-2 border-brand-blue/25 bg-gradient-to-br from-brand-blue/8 via-white to-brand-yellow/20 p-6 sm:p-8 shadow-md">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-blue mb-3 leading-tight">
        {copy.title}
      </h2>
      <ul className="space-y-2 mb-6 text-gray-700 text-sm sm:text-base">
        {copy.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2">
            <span className="text-brand-yellow-dark font-bold mt-0.5">✓</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="gate-email" className="block text-sm font-semibold text-gray-800 mb-1.5">
            Email
          </label>
          <input
            id="gate-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="La tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="w-full min-h-[44px] px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="gate-nome" className="block text-sm font-semibold text-gray-800 mb-1.5">
            Nome
          </label>
          <input
            id="gate-nome"
            type="text"
            name="nome"
            required
            autoComplete="given-name"
            placeholder="Il tuo nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={status === 'loading'}
            className="w-full min-h-[44px] px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue disabled:opacity-60"
          />
        </div>

        <PillGroup<ZonaPesca>
          label="Dove peschi di più?"
          options={ZONA_PESCA_OPTIONS}
          value={zonaPesca}
          onChange={(v) => setZonaPesca(v)}
          disabled={status === 'loading'}
        />

        <MultiPillGroup<TecnicaPreferita>
          label="Tecniche che pratichi"
          hint="Puoi selezionarne più di una"
          options={TECNICA_OPTIONS}
          values={tecniche}
          onToggle={(opt) =>
            setTecniche((prev) =>
              prev.includes(opt) ? prev.filter((t) => t !== opt) : [...prev, opt]
            )
          }
          disabled={status === 'loading'}
        />

        <button
          type="submit"
          disabled={status === 'loading' || !isFormValid}
          className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-brand-blue text-white font-semibold text-base hover:bg-brand-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Invio in corso…' : copy.submitLabel}
        </button>
      </form>

      {status === 'error' && errorMessage && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}

      <p className="mt-4 text-xs text-gray-500 leading-relaxed">
        {copy.footerNote ??
          'Iscrivendoti ricevi la guida e i nostri consigli di pesca. Niente spam, cancellazione in un click.'}{' '}
        <Link href="/privacy" className="text-brand-blue underline hover:text-brand-blue-dark">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

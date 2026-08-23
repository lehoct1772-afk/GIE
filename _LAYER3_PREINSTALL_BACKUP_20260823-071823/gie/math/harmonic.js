export function discreteFourierTransform(samples) {
  const N = samples.length;
  const spectrum = [];

  for (let k = 0; k < N; k++) {
    let real = 0;
    let imaginary = 0;

    for (let n = 0; n < N; n++) {
      const angle = (-2 * Math.PI * k * n) / N;

      real += samples[n] * Math.cos(angle);
      imaginary += samples[n] * Math.sin(angle);
    }

    spectrum.push({
      frequencyIndex: k,
      real,
      imaginary,
      magnitude: Math.hypot(real, imaginary)
    });
  }

  return spectrum;
}

export function dominantFrequency(samples) {
  const spectrum = discreteFourierTransform(samples);

  if (!spectrum.length) return null;

  return spectrum.reduce((best, current) =>
    current.magnitude > best.magnitude ? current : best
  );
}

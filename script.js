const qrForm = document.getElementById('qr-form');
const qrType = document.getElementById('qr-type');
const qrContent = document.getElementById('qr-content');
const qrSize = document.getElementById('qr-size');
const qrMargin = document.getElementById('qr-margin');
const qrColor = document.getElementById('qr-color');
const qrBg = document.getElementById('qr-bg');
const canvas = document.getElementById('qr-canvas');
const metaSize = document.getElementById('meta-size');
const downloadBtn = document.getElementById('download-btn');
const copyBtn = document.getElementById('copy-btn');

const buildContent = () => {
  const type = qrType.value;
  const value = qrContent.value.trim();

  if (!value) {
    return '';
  }

  switch (type) {
    case 'url':
      return value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`;
    case 'whatsapp': {
      const normalized = value.replace(/\s+/g, '').replace(/^\+/, '');
      return `https://wa.me/${normalized}`;
    }
    case 'vcard': {
      const cleaned = value
        .replace(/\r/g, '')
        .split('\n')
        .filter(Boolean)
        .map((line) => line.trim())
        .join('\n');
      return cleaned || 'BEGIN:VCARD\nVERSION:3.0\nFN:VolcanicScanner User\nEND:VCARD';
    }
    default:
      return value;
  }
};

const renderQr = async () => {
  const data = buildContent();

  if (!data) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    metaSize.textContent = `${canvas.width} x ${canvas.height}`;
    return;
  }

  const size = Number(qrSize.value);
  const margin = Number(qrMargin.value);

  canvas.width = size;
  canvas.height = size;
  metaSize.textContent = `${size} x ${size}`;

  await QRCode.toCanvas(canvas, data, {
    width: size,
    margin,
    color: {
      dark: qrColor.value,
      light: qrBg.value,
    },
    errorCorrectionLevel: 'M',
  });
};

qrForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  await renderQr();
});

qrType.addEventListener('change', async () => {
  const type = qrType.value;

  if (type === 'text') {
    qrContent.placeholder = 'Escribe aquí el texto o mensaje...';
    qrContent.value = 'VolcanicScanner 🚀';
  }

  if (type === 'url') {
    qrContent.placeholder = 'https://ejemplo.com';
    qrContent.value = 'https://github.com/srsergio2011-cmyk/volcanicscanner';
  }

  if (type === 'whatsapp') {
    qrContent.placeholder = 'Ej: 5215551234567';
    qrContent.value = '5215551234567';
  }

  if (type === 'vcard') {
    qrContent.placeholder = 'Nombre\nTeléfono\nCorreo\nEmpresa';
    qrContent.value = 'BEGIN:VCARD\nVERSION:3.0\nFN:Ana Sol\nORG:Volcanic Studio\nTEL:+5215551234567\nEMAIL:ana@volcanicstudio.dev\nEND:VCARD';
  }

  await renderQr();
});

qrSize.addEventListener('input', renderQr);
qrMargin.addEventListener('input', renderQr);
qrColor.addEventListener('input', renderQr);
qrBg.addEventListener('input', renderQr);
qrContent.addEventListener('input', renderQr);

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'volcanicscanner-qr.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

copyBtn.addEventListener('click', async () => {
  try {
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);
    copyBtn.textContent = 'Imagen copiada';
    setTimeout(() => {
      copyBtn.textContent = 'Copiar imagen';
    }, 1400);
  } catch (error) {
    copyBtn.textContent = 'No se pudo copiar';
    setTimeout(() => {
      copyBtn.textContent = 'Copiar imagen';
    }, 1400);
  }
});

window.addEventListener('load', async () => {
  qrType.value = 'url';
  qrContent.value = 'https://github.com/srsergio2011-cmyk/volcanicscanner';
  await renderQr();
});

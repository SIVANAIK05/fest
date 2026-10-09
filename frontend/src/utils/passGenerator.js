import QRCode from 'qrcode';

/**
 * Generate QR payload.
 * When format is 'url', modern phone cameras (iPhone & Android) instantly detect it
 * and display a clickable link to open the verified pass.
 * When format is 'text', it contains clean plain-text intel.
 */
export function buildQrPayload({ astrionId, formData, selectedMissions, format = 'url' }) {
  const missionTitles = selectedMissions.map(m => m.title).join(', ');
  const institutionName = formData.institution === 'Other Institution / University'
    ? (formData.customInstitution || 'National University')
    : formData.institution;

  if (format === 'url') {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://astrion2026.vvitu.ac.in';
    const params = new URLSearchParams({
      verify: astrionId,
      name: formData.fullName || 'Commander',
      college: institutionName,
      squad: formData.teamName || 'Solo Flight',
      crew: formData.coAstronauts || 'Solo Explorer',
      events: missionTitles || 'General Entry'
    });
    return `${origin}/?${params.toString()}`;
  }

  // Plain Text formatted for barcode readers
  return `ASTRION 2026 FLIGHT PASS
PASS ID: ${astrionId}
COMMANDER: ${formData.fullName}
COLLEGE: ${institutionName}
SQUAD: ${formData.teamName || 'Solo Flight'}
CREW: ${formData.coAstronauts || 'None'}
MISSIONS: ${missionTitles || 'General Entry'}
CLEARANCE: AUTHORIZED // IIC VVITU`;
}

/**
 * Generate crisp, bold scannable QR Code Data URL
 */
export async function generateQrCodeDataUrl(payload) {
  try {
    return await QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      color: {
        dark: '#030712',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
  } catch (err) {
    console.error('QR Generation failed:', err);
    return null;
  }
}

/**
 * Helper to safely load an image for canvas rendering without tainting
 */
function loadImageSafely(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    
    // Only set crossOrigin on external http/https URLs from a different origin
    if (src.startsWith('http://') || src.startsWith('https://')) {
      if (typeof window !== 'undefined' && !src.startsWith(window.location.origin)) {
        img.crossOrigin = 'anonymous';
      }
    }

    img.onload = () => resolve(img);
    img.onerror = () => {
      resolve(null);
    };
    img.src = src;
  });
}

/**
 * Helper to draw rounded rectangle
 */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Helper to trigger file download reliably across all browsers
 */
function triggerCanvasDownload(canvas, filename) {
  return new Promise((resolve, reject) => {
    try {
      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
              document.body.removeChild(link);
              URL.revokeObjectURL(blobUrl);
              resolve(true);
            }, 300);
          } else {
            fallbackDataUrl();
          }
        }, 'image/png');
      } else {
        fallbackDataUrl();
      }
    } catch (e) {
      fallbackDataUrl(e);
    }

    function fallbackDataUrl(prevError) {
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          resolve(true);
        }, 300);
      } catch (err) {
        console.error('Canvas export error:', err);
        reject(prevError || err);
      }
    }
  });
}

/**
 * Draw the Pass ticket contents onto a 1080x540 canvas
 */
async function renderPassCanvas(canvas, { astrionId, formData, selectedMissions, qrDataUrl, includeExternalBg = true }) {
  const ctx = canvas.getContext('2d');
  canvas.width = 1080;
  canvas.height = 540;

  const institutionName = formData.institution === 'Other Institution / University'
    ? (formData.customInstitution || 'National University')
    : formData.institution;

  // 1. Draw Background
  let bgDrawn = false;
  if (includeExternalBg) {
    try {
      const shuttleBg = await loadImageSafely('/images/crew_shuttle_delivery.jpg');
      if (shuttleBg) {
        ctx.drawImage(shuttleBg, 0, 0, 1080, 540);
        // Matte dark aerospace overlay for clear text readability
        ctx.fillStyle = 'rgba(4, 8, 20, 0.88)';
        ctx.fillRect(0, 0, 1080, 540);
        bgDrawn = true;
      }
    } catch (e) {
      bgDrawn = false;
    }
  }

  if (!bgDrawn) {
    // Deep matte obsidian flight deck background
    ctx.fillStyle = '#050914';
    ctx.fillRect(0, 0, 1080, 540);
  }

  // 2. Stardust cosmic field
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 45; i++) {
    const x = Math.random() * 1080;
    const y = Math.random() * 540;
    ctx.globalAlpha = Math.random() * 0.4 + 0.1;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 1.2 + 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 3. Card Outer Border (Precision 1px aerospace border)
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 2;
  roundRect(ctx, 16, 16, 1048, 508, 18);
  ctx.stroke();

  // 4. Ticket Perforation Line (Separating Main Pass and Stub)
  const stubX = 750;
  ctx.save();
  ctx.setLineDash([6, 5]);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(stubX, 16);
  ctx.lineTo(stubX, 524);
  ctx.stroke();
  ctx.restore();

  // Perforation top and bottom semicircle cutouts
  ctx.fillStyle = '#020409';
  ctx.beginPath();
  ctx.arc(stubX, 16, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(stubX, 524, 12, 0, Math.PI * 2);
  ctx.fill();

  // 5. Official Logos Badge
  const topY = 40;
  try {
    const iicLogo = await loadImageSafely('/images/iic_logo.png');
    const vvitLogo = await loadImageSafely('/images/vvit_logo.png');
    if (iicLogo && vvitLogo) {
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, 42, topY, 160, 44, 8);
      ctx.fill();

      ctx.drawImage(iicLogo, 48, topY + 5, 68, 34);
      ctx.strokeStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(122, topY + 6);
      ctx.lineTo(122, topY + 38);
      ctx.stroke();
      ctx.drawImage(vvitLogo, 128, topY + 5, 70, 34);
    }
  } catch (e) {}

  // 6. Header Texts: ASTRION Title & Subtitle
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 38px "Orbitron", sans-serif';
  ctx.fillText("ASTRION", 42, 130);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 11px "Space Grotesk", sans-serif';
  ctx.fillText("INNOVATE BEYOND BOUNDARIES // OFFICIAL FLIGHT PASS", 44, 150);

  // Separator Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(42, 168);
  ctx.lineTo(715, 168);
  ctx.stroke();

  // Grid Section 1: Astronaut Commander & Institution
  const row1Y = 195;
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 9.5px sans-serif';
  ctx.fillText("LEAD ASTRONAUT / PARTICIPANT", 42, row1Y);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  const displayName = formData.studentId 
    ? `${formData.fullName} • ${formData.studentId}` 
    : formData.fullName;
  const truncatedName = displayName.length > 32 ? displayName.substring(0, 30) + '...' : displayName;
  ctx.fillText(truncatedName || 'Commander Cooper', 42, row1Y + 24);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 9.5px sans-serif';
  ctx.fillText("INSTITUTION / UNIVERSITY", 380, row1Y);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 15px sans-serif';
  const truncatedCollege = institutionName.length > 34 ? institutionName.substring(0, 32) + '...' : institutionName;
  ctx.fillText(truncatedCollege, 380, row1Y + 22);

  // Grid Section 2: Department & Year
  const row2Y = 265;
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 9.5px sans-serif';
  ctx.fillText("DEPARTMENT & YEAR", 42, row2Y);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '13px sans-serif';
  const deptText = `${formData.department || 'General'} • ${formData.yearOfStudy || '3rd Year'}`;
  ctx.fillText(deptText, 42, row2Y + 20);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 9.5px sans-serif';
  ctx.fillText("SQUAD / CREW CALL-SIGN", 380, row2Y);

  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 14px sans-serif';
  const teamText = `Squad: ${formData.teamName || 'Solo Flight'}`;
  ctx.fillText(teamText, 380, row2Y + 20);

  // Grid Section 3: Co-Astronauts
  const row3Y = 325;
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 9.5px sans-serif';
  ctx.fillText("CREW MEMBERS / TEAMMATES", 42, row3Y);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '12px sans-serif';
  const crewText = formData.coAstronauts ? formData.coAstronauts : 'Solo Explorer (None specified)';
  const truncatedCrew = crewText.length > 80 ? crewText.substring(0, 78) + '...' : crewText;
  ctx.fillText(truncatedCrew, 42, row3Y + 18);

  // Grid Section 4: Authorized Pre-Registered Missions
  const row4Y = 380;
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 9.5px sans-serif';
  ctx.fillText("AUTHORIZED MISSIONS (PRE-REGISTRATION CLEARANCE)", 42, row4Y);

  let badgeX = 42;
  const badgeY = row4Y + 14;
  if (!selectedMissions || selectedMissions.length === 0) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 12px sans-serif';
    ctx.fillText("General Entry Pass (Spot events available at venue)", badgeX, badgeY + 16);
  } else {
    selectedMissions.slice(0, 3).forEach((m) => {
      const label = `${m.title} [PRE-REG]`;
      ctx.font = 'bold 11px sans-serif';
      const textWidth = ctx.measureText(label).width;
      const boxWidth = textWidth + 18;

      ctx.fillStyle = '#0f172a';
      roundRect(ctx, badgeX, badgeY, boxWidth, 26, 6);
      ctx.fill();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.fillText(label, badgeX + 9, badgeY + 17);

      badgeX += boxWidth + 10;
    });

    if (selectedMissions.length > 3) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.fillText(`+${selectedMissions.length - 3} more`, badgeX, badgeY + 17);
    }
  }

  // Bottom Guarantee Stamp
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText("✓ VERIFIED FOR VENUE ENTRY • DATES: 23 - 24 OCT 2026 • VENUE: VVIT CAMPUS", 42, 490);

  // --- STUB AREA (Right side: 750 to 1080) ---
  const stubCenterX = 750 + (1080 - 750) / 2;

  // Pass ID Header
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 9.5px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("BOARDING PASS ID", stubCenterX, 55);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '900 22px "Orbitron", sans-serif';
  ctx.fillText(astrionId, stubCenterX, 85);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px sans-serif';
  ctx.fillText("SCAN AT VENUE GATEWAY", stubCenterX, 105);

  // Scannable QR Code
  if (qrDataUrl) {
    try {
      const qrImg = await loadImageSafely(qrDataUrl);
      if (qrImg) {
        const qrBoxSize = 200;
        const qrBoxX = stubCenterX - qrBoxSize / 2;
        const qrBoxY = 125;

        ctx.fillStyle = '#ffffff';
        roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 12);
        ctx.fill();

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.drawImage(qrImg, qrBoxX + 10, qrBoxY + 10, qrBoxSize - 20, qrBoxSize - 20);
      }
    } catch (e) {}
  }

  // Gateway Clearance Pill
  ctx.fillStyle = 'rgba(52, 211, 153, 0.15)';
  roundRect(ctx, stubCenterX - 110, 345, 220, 36, 8);
  ctx.fill();
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText("STATUS: AUTHORIZED // IIC VVITU", stubCenterX, 368);

  // Barcode decoration at bottom
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  const barcodeStart = stubCenterX - 95;
  for (let b = 0; b < 38; b++) {
    const w = (b % 3 === 0) ? 3 : 1.5;
    ctx.fillRect(barcodeStart + b * 5, 405, w, 34);
  }

  ctx.fillStyle = '#94a3b8';
  ctx.font = '9px sans-serif';
  ctx.fillText("ISSUED BY IIC VVITU", stubCenterX, 460);

  ctx.textAlign = 'left'; // Reset alignment
}

/**
 * Generate and download an ultra-clean, elegant Interstellar Flight Pass ticket image
 */
export async function downloadAstrionPassImage({ astrionId, formData, selectedMissions, qrDataUrl }) {
  const canvas = document.createElement('canvas');
  const filename = `ASTRION_Pass_${astrionId}.png`;

  try {
    // Attempt standard render with background image
    await renderPassCanvas(canvas, {
      astrionId,
      formData,
      selectedMissions,
      qrDataUrl,
      includeExternalBg: true
    });

    await triggerCanvasDownload(canvas, filename);
  } catch (err) {
    console.warn('Initial canvas export hit issue, generating standalone procedural pass:', err);
    // Standalone procedural render fallback guaranteed never to taint or fail
    const fallbackCanvas = document.createElement('canvas');
    await renderPassCanvas(fallbackCanvas, {
      astrionId,
      formData,
      selectedMissions,
      qrDataUrl,
      includeExternalBg: false
    });
    await triggerCanvasDownload(fallbackCanvas, filename);
  }
}

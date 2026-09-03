

class UniLiftPDFGenerator {
  constructor() {
    this.BRAND = {
      primary: "#177de4",
      accent: "#00bfff",
      dark: "#0f1724",
      text: "#1e293b",
      muted: "#64748b",
      lightBg: "#f8fafc",
      border: "#e2e8f0",
      tipBg: "#f0f9ff",
      tipBorder: "#0284c7",
    };

    this.pageWidth = 210;
    this.pageHeight = 297;
    this.leftMargin = 16;
    this.rightMargin = 16;
    this.bottomThreshold = this.pageHeight - 28;
  }

  hexToRgb(hex) {
    const cleaned = hex.replace("#", "");
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return [r, g, b];
  }

 
  async imageToDataUrl(imgEl) {
    return new Promise((resolve) => {
      if (!imgEl || !imgEl.src) return resolve(null);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        try {
          resolve(canvas.toDataURL("image/png"));
        } catch (err) {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = imgEl.src;
    });
  }


  hashString(str) {
    if (!str) return 0;
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h;
  }

  
  mulberry32(a) {
    return function () {
      var t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }


  selectTips(student, { elegible = [], weakGrades = [] } = {}, N = 2) {
    const pool = [
      "Small improvements in one core subject often significantly expand program eligibility.",
      "Strengthening elective subjects can bolster chances for competitive entry cutoffs.",
      "Explore foundational/bridge courses if your aggregate score is right at the cutoff boundary.",
      "If you meet requirements for multiple tracks, prioritize alignment over sheer selectivity.",
    ];
    const results = [];

    if ((weakGrades || []).length > 2) {
      results.push(
        "Consider institutions offering flexible foundation pathways or bursary opportunities.",
      );
    }
    if ((elegible || []).length === 0) {
      results.push(
        "Explore diploma or pre-degree programs to bridge entry cutoff margins.",
      );
    }
    if ((elegible || []).length >= 8 && results.length < N) {
      results.push(
        "Shortlist your top 3 preferred choices and apply early in the admissions window.",
      );
    }

    const near = (student.courses || []).some(
      (c) => Math.abs(student.aggregate - c.cutoff) <= 2,
    );
    if (near && results.length < N) {
      results.push(
        "Consider targeted revision or retakes for subjects nearest to cutoff thresholds.",
      );
    }

    const seed = this.hashString(student.name || "") || Date.now();
    const rnd = this.mulberry32(seed);
    const shuffled = pool.slice().sort(() => rnd() - 0.5);
    for (let i = 0; i < shuffled.length && results.length < N; i++) {
      if (!results.includes(shuffled[i])) results.push(shuffled[i]);
    }
    return results.slice(0, N);
  }

  drawHeader(doc, yPos, logoData) {
    const { primary, muted, border } = this.BRAND;
    const contentWidth = this.pageWidth - this.leftMargin - this.rightMargin;

  
    doc.setFillColor(...this.hexToRgb(primary));
    doc.rect(0, 0, this.pageWidth, 4, "F");

    if (logoData) {
      doc.addImage(logoData, "PNG", this.leftMargin, yPos, 12, 12);

   
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(...this.hexToRgb(primary));
      doc.text("UNILIFT.APP", this.leftMargin + 16, yPos + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...this.hexToRgb(muted));
      doc.text(
        "Official University Eligibility Report",
        this.leftMargin + 16,
        yPos + 11,
      );
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(...this.hexToRgb(primary));
      doc.text("UNILIFT.APP", this.leftMargin, yPos + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...this.hexToRgb(muted));
      doc.text(
        "Official University Eligibility Report",
        this.leftMargin,
        yPos + 11,
      );
    }

  
    doc.setDrawColor(...this.hexToRgb(border));
    doc.setLineWidth(0.3);
    doc.line(
      this.leftMargin,
      yPos + 15,
      this.pageWidth - this.rightMargin,
      yPos + 15,
    );
  }


  async generatePDF(studentData) {
    if (!window.jspdf) {
      alert("PDF library not loaded. Please refresh the page.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    const contentWidth = this.pageWidth - this.leftMargin - this.rightMargin;

  
    let logoData = null;
    try {
      const logoEl = document.querySelector('img[src*="u-logo.png"]');
      if (logoEl) {
        logoData = await this.imageToDataUrl(logoEl);
      }
    } catch (e) {
      console.warn("Logo load failed:", e);
    }

    let currentY = 12;


    this.drawHeader(doc, currentY, logoData);
    currentY += 22;

  
    const cardH = 28;
    doc.setFillColor(...this.hexToRgb(this.BRAND.lightBg));
    doc.setDrawColor(...this.hexToRgb(this.BRAND.border));
    doc.setLineWidth(0.3);
    doc.roundedRect(this.leftMargin, currentY, contentWidth, cardH, 3, 3, "FD");


    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...this.hexToRgb(this.BRAND.muted));
    doc.text("STUDENT NAME", this.leftMargin + 6, currentY + 7);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...this.hexToRgb(this.BRAND.dark));
    doc.text(studentData.name || "—", this.leftMargin + 6, currentY + 12);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...this.hexToRgb(this.BRAND.muted));
    doc.text("EMAIL ADDRESS", this.leftMargin + 6, currentY + 19);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...this.hexToRgb(this.BRAND.text));
    doc.text(studentData.email || "—", this.leftMargin + 6, currentY + 24);


    const col2X = this.leftMargin + 92;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...this.hexToRgb(this.BRAND.muted));
    doc.text("TARGET INSTITUTION", col2X, currentY + 7);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...this.hexToRgb(this.BRAND.dark));
    doc.text(studentData.university || "—", col2X, currentY + 12);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...this.hexToRgb(this.BRAND.muted));
    doc.text("AGGREGATE SCORE", col2X, currentY + 19);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...this.hexToRgb(this.BRAND.primary));
    doc.text(String(studentData.aggregate), col2X + 32, currentY + 24);

    currentY += cardH + 10;


    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...this.hexToRgb(this.BRAND.dark));
    doc.text("Eligible Academic Programs", this.leftMargin, currentY);
    currentY += 5;

    const thH = 8;
    const colCutoffW = 35;
    const colProgW = contentWidth - colCutoffW;

    const drawTableHeader = (y) => {
      doc.setFillColor(...this.hexToRgb(this.BRAND.primary));
      doc.rect(this.leftMargin, y, contentWidth, thH, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text("PROGRAM NAME", this.leftMargin + 5, y + 5.5);
      doc.text("CUTOFF GRADE", this.leftMargin + contentWidth - 6, y + 5.5, {
        align: "right",
      });
    };

    drawTableHeader(currentY);
    currentY += thH;


    const rowHeightMin = 8.5;
    const courses = studentData.courses || [];

    for (let i = 0; i < courses.length; i++) {
      const c = courses[i];
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      const programLines = doc.splitTextToSize(c.program_name, colProgW - 8);
      const rowH = Math.max(rowHeightMin, programLines.length * 5 + 3);

   
      if (currentY + rowH > this.bottomThreshold) {
        doc.addPage();
        currentY = 12;
        this.drawHeader(doc, currentY, logoData);
        currentY += 22;
        drawTableHeader(currentY);
        currentY += thH;
      }

   
      if (i % 2 === 0) {
        doc.setFillColor(...this.hexToRgb(this.BRAND.lightBg));
        doc.rect(this.leftMargin, currentY, contentWidth, rowH, "F");
      }

      doc.setTextColor(...this.hexToRgb(this.BRAND.text));
      doc.text(programLines, this.leftMargin + 5, currentY + 5.5);

      const cutoff = String(
        c.cutoff ?? c.cutoff_criteria?.minimum_aggregate ?? "—",
      );
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...this.hexToRgb(this.BRAND.dark));
      doc.text(cutoff, this.leftMargin + contentWidth - 6, currentY + 5.5, {
        align: "right",
      });

      currentY += rowH;
    }

    currentY += 8;

 
    const tips = this.selectTips(
      studentData,
      {
        elegible: studentData.courses.filter(
          (c) => studentData.aggregate <= c.cutoff,
        ),
        weakGrades: studentData.weakGrades || [],
      },
      2,
    );

    const tipsBoxH = 12 + tips.length * 6;
    if (currentY + tipsBoxH > this.bottomThreshold) {
      doc.addPage();
      currentY = 12;
      this.drawHeader(doc, currentY, logoData);
      currentY += 22;
    }

    doc.setFillColor(...this.hexToRgb(this.BRAND.tipBg));
    doc.rect(this.leftMargin, currentY, contentWidth, tipsBoxH, "F");

    doc.setFillColor(...this.hexToRgb(this.BRAND.tipBorder));
    doc.rect(this.leftMargin, currentY, 2, tipsBoxH, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...this.hexToRgb(this.BRAND.tipBorder));
    doc.text("Tips", this.leftMargin + 6, currentY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...this.hexToRgb(this.BRAND.text));

    for (let t = 0; t < tips.length; t++) {
      doc.text(`• ${tips[t]}`, this.leftMargin + 8, currentY + 12 + t * 6);
    }

    currentY += tipsBoxH + 8;


    const disclaimer =
      "This eligibility report is strictly for guidance. Always cross-check entry thresholds on official university portals before submitting applications.";
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(...this.hexToRgb(this.BRAND.muted));

    const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
    const disclaimerH = disclaimerLines.length * 4;

    if (currentY + disclaimerH > this.bottomThreshold) {
      doc.addPage();
      currentY = 12;
      this.drawHeader(doc, currentY, logoData);
      currentY += 22;
    }

    doc.text(disclaimerLines, this.leftMargin, currentY + 3);
    currentY += disclaimerH + 6;

  
    const inquiryBoxH = 14;
    if (currentY + inquiryBoxH > this.bottomThreshold) {
      doc.addPage();
      currentY = 12;
      this.drawHeader(doc, currentY, logoData);
      currentY += 22;
    }

    doc.setFillColor(...this.hexToRgb(this.BRAND.lightBg));
    doc.setDrawColor(...this.hexToRgb(this.BRAND.border));
    doc.setLineWidth(0.3);
    doc.roundedRect(
      this.leftMargin,
      currentY,
      contentWidth,
      inquiryBoxH,
      2,
      2,
      "FD",
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...this.hexToRgb(this.BRAND.dark));
    doc.text(
      "Need Help or Have Inquiries?",
      this.leftMargin + 5,
      currentY + 5.5,
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...this.hexToRgb(this.BRAND.muted));
    doc.text(
      "Contact support via email: uniliftapp1@gmail.com  |  WhatsApp: +233 50 930 4981  |  Visit: unilift.app",
      this.leftMargin + 5,
      currentY + 10.5,
    );

   
    const totalPages = doc.internal.getNumberOfPages();
    const rawTimestamp = new Date().toLocaleString();

    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);

      const footerY = 286;
      doc.setDrawColor(...this.hexToRgb(this.BRAND.border));
      doc.setLineWidth(0.3);
      doc.line(
        this.leftMargin,
        footerY - 3,
        this.pageWidth - this.rightMargin,
        footerY - 3,
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...this.hexToRgb(this.BRAND.muted));

      doc.text(rawTimestamp, this.leftMargin, footerY + 2);

      doc.text(
        `Page ${p} of ${totalPages}`,
        this.pageWidth - this.rightMargin,
        footerY + 2,
        { align: "right" },
      );
    }

    
    const filename = `UniLift_Result_${(studentData.name || "student")
      .replace(/\s+/g, "_")
      .toLowerCase()}_${(studentData.university || "university")
      .replace(/\s+/g, "_")
      .toLowerCase()}.pdf`;

    doc.save(filename);
  }
}

window.UniLiftPDFGenerator = UniLiftPDFGenerator;

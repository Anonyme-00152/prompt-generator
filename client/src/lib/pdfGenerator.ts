import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663431528324/ZEzuuoF7e3Cktusam36Raq/prompt-craft-logo-JrRd8EkJxF5PcfPxXC5LKX.webp";

export async function generatePromptPDF(
  prompt: string,
  score: number,
  fileName: string = 'prompt.pdf'
) {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Header with logo and title
    pdf.setFontSize(24);
    pdf.setTextColor(245, 159, 11); // Amber
    pdf.text('PromptCraft', margin, yPosition);
    yPosition += 12;

    // Score badge
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Score de Qualité: ${score}/100`, margin, yPosition);
    yPosition += 8;

    // Separator line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Prompt title
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Prompt Généré', margin, yPosition);
    yPosition += 8;

    // Prompt content with word wrap
    pdf.setFontSize(10);
    pdf.setTextColor(50, 50, 50);
    const splitText = pdf.splitTextToSize(prompt, pageWidth - 2 * margin);
    const textHeight = pdf.getTextDimensions(splitText).h;

    // Check if we need multiple pages
    if (yPosition + textHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.text(splitText, margin, yPosition);
    yPosition += textHeight + 10;

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    const timestamp = new Date().toLocaleDateString('fr-FR');
    pdf.text(`Généré le ${timestamp} via PromptCraft`, margin, pageHeight - 10);

    // Save the PDF
    pdf.save(fileName);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
}

export async function generatePromptHTMLPDF(
  htmlElement: HTMLElement,
  fileName: string = 'prompt.pdf'
) {
  try {
    const canvas = await html2canvas(htmlElement, {
      scale: 2,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = 10;
    pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);

    // Add footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    const timestamp = new Date().toLocaleDateString('fr-FR');
    pdf.text(
      `Généré le ${timestamp} via PromptCraft`,
      10,
      pdf.internal.pageSize.getHeight() - 10
    );

    pdf.save(fileName);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF HTML:', error);
    throw error;
  }
}

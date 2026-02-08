import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    ImageRun,
    ExternalHyperlink,
    HeadingLevel,
    TableOfContents,
    AlignmentType,
    PageBreak,
} from 'docx';

const DEMO_BASE = typeof window !== 'undefined' ? `${window.location.origin}/demo/` : 'http://localhost:5173/demo/';

function getImageType(dataUrl) {
    if (!dataUrl || typeof dataUrl !== 'string') return null;
    if (dataUrl.startsWith('data:image/png')) return 'png';
    if (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/jpg')) return 'jpg';
    if (dataUrl.startsWith('data:image/gif')) return 'gif';
    if (dataUrl.startsWith('data:image/bmp')) return 'bmp';
    return 'png';
}

export async function buildLabReportDocx({ formData, projectId }) {
    const { title, domain, teamMembers, techStack, cocomo, diagrams, features } = formData;
    const demoUrl = `${DEMO_BASE}${projectId || 'local'}`;

    const children = [];

    // ----- COVER PAGE -----
    children.push(
        new Paragraph({ text: '', spacing: { before: 2400 } }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: '[University Name]', bold: true, size: 28 })],
        }),
        new Paragraph({ text: '', spacing: { before: 400 } }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Software Engineering Lab', size: 24 })],
        }),
        new Paragraph({ text: '', spacing: { before: 1200 } }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: title || 'Project Title', bold: true, size: 36 })],
        }),
        new Paragraph({ text: '', spacing: { before: 800 } }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Submitted By:', bold: true, size: 22 })],
        }),
        new Paragraph({ text: '', spacing: { before: 200 } })
    );
    teamMembers.filter(m => m.name || m.rollNo).forEach(m => {
        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: [m.name, m.rollNo, m.univRollNo].filter(Boolean).join(' — ') || 'Team Member',
                        size: 20,
                    }),
                ],
            })
        );
    });
    children.push(new Paragraph({ text: '' }), new Paragraph({ children: [new PageBreak()] }));

    // ----- TABLE OF CONTENTS -----
    children.push(
        new Paragraph({ text: 'Index', heading: HeadingLevel.HEADING_1 }),
        new TableOfContents('Index', { hyperlink: true, headingStyleRange: '1-3' }),
        new Paragraph({ text: '' }),
        new PageBreak()
    );

    // ----- INTRODUCTION -----
    children.push(
        new Paragraph({ text: '1. Introduction', heading: HeadingLevel.HEADING_1 }),
        new Paragraph({
            children: [
                new TextRun({
                    text: `This document describes the software requirements and feasibility study for "${title || 'the project'}", a ${domain} project. The system aims to deliver the following capabilities: ${features || 'as specified in the project scope'}.`,
                }),
            ],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
            children: [new TextRun({ text: 'Live Prototype Link: ', bold: true })],
        }),
        new Paragraph({
            children: [
                new ExternalHyperlink({
                    link: demoUrl,
                    children: [new TextRun({ text: demoUrl, style: 'Hyperlink', underline: true })],
                }),
            ],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({ children: [new PageBreak()] })
    );

    // ----- FEASIBILITY STUDY -----
    children.push(
        new Paragraph({ text: '2. Feasibility Study', heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: '2.1 Technical Feasibility', heading: HeadingLevel.HEADING_2 }),
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Aspect', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Choice', bold: true })] })] }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph('Frontend')] }),
                        new TableCell({ children: [new Paragraph(techStack?.frontend || '—')] }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph('Backend')] }),
                        new TableCell({ children: [new Paragraph(techStack?.backend || '—')] }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph('Database')] }),
                        new TableCell({ children: [new Paragraph(techStack?.database || '—')] }),
                    ],
                }),
            ],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({ text: '2.2 Economic Feasibility', heading: HeadingLevel.HEADING_2 }),
        new Paragraph({
            children: [
                new TextRun({
                    text: 'The project is economically feasible within the estimated budget as derived from the COCOMO model (see Section 3).',
                }),
            ],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({ children: [new PageBreak()] })
    );

    // ----- COCOMO COSTING -----
    children.push(
        new Paragraph({ text: '3. COCOMO Costing', heading: HeadingLevel.HEADING_1 }),
        new Paragraph({
            children: [
                new TextRun({
                    text: 'Effort (Person-Months) = 2.4 × (KLOC)^1.05. Time and cost are derived from the standard COCOMO organic model.',
                }),
            ],
        }),
        new Paragraph({ text: '' }),
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Metric', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Value', bold: true })] })] }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph('Estimated KLOC')] }),
                        new TableCell({ children: [new Paragraph(String(cocomo?.kloc ?? 0))] }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph('Effort (Person-Months)')] }),
                        new TableCell({ children: [new Paragraph(String(cocomo?.effort ?? 0))] }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph('Development Time (Months)')] }),
                        new TableCell({ children: [new Paragraph(String(cocomo?.time ?? 0))] }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph('Estimated Cost ($)')] }),
                        new TableCell({ children: [new Paragraph(String(cocomo?.cost ?? 0))] }),
                    ],
                }),
            ],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({ children: [new PageBreak()] })
    );

    // ----- REQUIREMENTS -----
    children.push(
        new Paragraph({ text: '4. Requirements', heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: '4.1 Functional Requirements', heading: HeadingLevel.HEADING_2 }),
        new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: 'The system shall implement the features as described in the introduction and prototype.' })],
        }),
        new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: 'User authentication and authorization where applicable.' })],
        }),
        new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: 'Data persistence and retrieval using the chosen database.' })],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({ text: '4.2 Non-Functional Requirements', heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: 'Security:', heading: HeadingLevel.HEADING_3 }),
        new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: 'Sensitive data shall be protected and access controlled.' })],
        }),
        new Paragraph({ text: 'Performance:', heading: HeadingLevel.HEADING_3 }),
        new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: 'The system shall respond within acceptable limits under normal load.' })],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({ children: [new PageBreak()] })
    );

    // ----- DIAGRAMS -----
    children.push(new Paragraph({ text: '5. Diagrams', heading: HeadingLevel.HEADING_1 }));
    const diagramLabels = {
        useCase: 'Fig 1: Use Case Diagram',
        dfd0: 'Fig 2: DFD Level 0',
        dfd1: 'Fig 3: DFD Level 1',
        classDiagram: 'Fig 4: Class Diagram',
    };
    for (const [key, caption] of Object.entries(diagramLabels)) {
        const dataUrl = diagrams?.[key];
        const imgType = getImageType(dataUrl);
        if (dataUrl && imgType) {
            try {
                children.push(
                    new Paragraph({
                        children: [
                            new ImageRun({
                                type: imgType,
                                data: dataUrl,
                                transformation: { width: 400, height: 280 },
                            }),
                        ],
                    }),
                    new Paragraph({ text: caption, alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: '' })
                );
            } catch (e) {
                children.push(new Paragraph({ text: caption + ' — [Image not embedded]' }), new Paragraph({ text: '' }));
            }
        } else {
            children.push(new Paragraph({ text: caption + ' — [Not uploaded]' }), new Paragraph({ text: '' }));
        }
    }
    children.push(new Paragraph({ children: [new PageBreak()] }));

    // ----- CONCLUSION -----
    children.push(
        new Paragraph({ text: '6. Conclusion', heading: HeadingLevel.HEADING_1 }),
        new Paragraph({
            children: [
                new TextRun({
                    text: `This report summarized the feasibility, cost estimation, and requirements for "${title || 'the project'}". The live prototype is available at the link provided in the Introduction. The chosen tech stack (${[techStack?.frontend, techStack?.backend, techStack?.database].filter(Boolean).join(', ') || 'N/A'}) supports the project goals.`,
                }),
            ],
        })
    );

    const doc = new Document({
        sections: [{ properties: {}, children }],
    });
    return Packer.toBlob(doc);
}

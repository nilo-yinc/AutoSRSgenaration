import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    HeadingLevel,
    TableOfContents,
    AlignmentType,
    PageBreak,
    Header,
    Footer,
} from 'docx';

export async function buildEnterpriseDocx(formData) {
    const { 
        projectName, 
        authors, 
        organization, 
        problemStatement, 
        targetUsers,
        appType,
        domain,
        coreFeatures,
        userFlow,
        userScale,
        performance,
        authRequired,
        sensitiveData,
        compliance,
        backendPref,
        dbPref,
        deploymentPref,
        detailLevel
    } = formData;

    const children = [];

    // ----- HEADER & FOOTER -----
    const header = new Header({
        children: [
            new Paragraph({
                children: [
                    new TextRun({ text: organization || 'Confidential', bold: true, size: 20, color: '808080' }),
                ],
                alignment: AlignmentType.RIGHT,
            }),
        ],
    });

    // ----- COVER PAGE -----
    children.push(
        new Paragraph({ text: '', spacing: { before: 2400 } }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({ text: 'SOFTWARE REQUIREMENTS SPECIFICATION', bold: true, size: 36, color: '2E74B5' }),
            ],
        }),
        new Paragraph({ text: '', spacing: { before: 400 } }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({ text: `For ${projectName || 'Untitled Project'}`, size: 28, italics: true }),
            ],
        }),
        new Paragraph({ text: '', spacing: { before: 2000 } }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({ text: 'Version: 1.0', size: 24 }),
            ],
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({ text: `Date: ${new Date().toLocaleDateString()}`, size: 24 }),
            ],
        }),
        new Paragraph({ text: '', spacing: { before: 800 } }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Prepared By:', bold: true, size: 24 })],
        }),
        ...authors.split('\n').map(a => new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: a, size: 22 })],
        })),
        new Paragraph({ children: [new PageBreak()] })
    );

    // ----- TABLE OF CONTENTS -----
    children.push(
        new Paragraph({ text: 'Table of Contents', heading: HeadingLevel.HEADING_1 }),
        new TableOfContents('Index', { hyperlink: true, headingStyleRange: '1-3' }),
        new Paragraph({ children: [new PageBreak()] })
    );

    // ----- 1. INTRODUCTION -----
    children.push(
        new Paragraph({ text: '1. Introduction', heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: '1.1 Purpose', heading: HeadingLevel.HEADING_2 }),
        new Paragraph({
            children: [new TextRun({ 
                text: `The purpose of this document is to define the requirements for "${projectName}". This SRS describes the scope, functional, and non-functional requirements for developers, stakeholders, and users.` 
            })],
        }),
        new Paragraph({ text: '1.2 Problem Statement', heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ children: [new TextRun({ text: problemStatement || 'N/A' })] }),
        new Paragraph({ text: '1.3 Intended Audience', heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ children: [new TextRun({ text: `Target Users: ${targetUsers.join(', ') || 'General Users'}` })] }),
        new Paragraph({ children: [new PageBreak()] })
    );

    // ----- 2. OVERALL DESCRIPTION -----
    children.push(
        new Paragraph({ text: '2. Overall Description', heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: '2.1 Product Context', heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ children: [new TextRun({ text: `This is a ${appType} in the ${domain} domain.` })] }),
        new Paragraph({ text: '2.2 User Flow', heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ children: [new TextRun({ text: userFlow || 'N/A' })] }),
        new Paragraph({ children: [new PageBreak()] })
    );

    // ----- 3. SYSTEM FEATURES -----
    children.push(
        new Paragraph({ text: '3. System Features', heading: HeadingLevel.HEADING_1 }),
    );
    const features = coreFeatures.split('\n').filter(Boolean);
    features.forEach((f, i) => {
        children.push(
            new Paragraph({ text: `3.${i+1} Feature: ${f.split(':')[0] || 'Feature'}`, heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ 
                bullet: { level: 0 },
                children: [new TextRun({ text: f })] 
            })
        );
    });
    if (features.length === 0) {
        children.push(new Paragraph({ text: 'No specific features listed.' }));
    }
    children.push(new Paragraph({ children: [new PageBreak()] }));

    // ----- 4. NON-FUNCTIONAL REQUIREMENTS -----
    children.push(
        new Paragraph({ text: '4. Non-Functional Requirements', heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: '4.1 Performance', heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: `Expected Scale: ${userScale}` })] }),
        new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: `Performance Goal: ${performance}` })] }),
        new Paragraph({ text: '4.2 Security', heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: `Authentication: ${authRequired}` })] }),
        new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: `Sensitive Data Handling: ${sensitiveData}` })] }),
        new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: `Compliance: ${compliance.join(', ') || 'None'}` })] }),
         new Paragraph({ children: [new PageBreak()] })
    );

    // ----- 5. TECHNICAL STACK -----
    children.push(
        new Paragraph({ text: '5. Technical Architecture', heading: HeadingLevel.HEADING_1 }),
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Component', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Technology/Platform', bold: true })] })] }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph('Backend')] }),
                        new TableCell({ children: [new Paragraph(backendPref || 'Not Specified')] }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph('Database')] }),
                        new TableCell({ children: [new Paragraph(dbPref || 'Not Specified')] }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph('Deployment')] }),
                        new TableCell({ children: [new Paragraph(deploymentPref || 'Not Specified')] }),
                    ],
                }),
            ],
        })
    );

    const doc = new Document({
        sections: [{ 
            headers: { default: header },
            properties: {}, 
            children 
        }],
    });
    return Packer.toBlob(doc);
}

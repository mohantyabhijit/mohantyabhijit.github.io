#!/usr/bin/env python3
"""Generate resume.pdf using reportlab."""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle,
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT

LINK_BLUE = HexColor("#1a73e8")
BLACK = HexColor("#000000")
GREY = HexColor("#444444")

OUTPUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "resume.pdf")

# ── Styles ──

style_name = ParagraphStyle(
    "Name", fontSize=18, leading=22, alignment=TA_CENTER, fontName="Helvetica-Bold",
)
style_subheader = ParagraphStyle(
    "SubHeader", fontSize=9, leading=12, alignment=TA_CENTER, textColor=GREY,
)
style_section = ParagraphStyle(
    "Section", fontSize=12, leading=16, fontName="Helvetica-Bold",
    spaceBefore=10, spaceAfter=2,
)
style_company = ParagraphStyle(
    "Company", fontSize=10, leading=13, fontName="Helvetica-Bold",
)
style_role = ParagraphStyle(
    "Role", fontSize=9.5, leading=13, fontName="Helvetica-Oblique",
)
style_tech = ParagraphStyle(
    "Tech", fontSize=8.5, leading=11, textColor=GREY,
)
style_bullet = ParagraphStyle(
    "Bullet", fontSize=9.5, leading=13, leftIndent=12, bulletIndent=0,
    bulletFontName="Helvetica", bulletFontSize=9.5,
)
style_normal = ParagraphStyle(
    "Normal2", fontSize=9.5, leading=13,
)
style_skill_label = ParagraphStyle(
    "SkillLabel", fontSize=9.5, leading=13, fontName="Helvetica-Bold",
)
style_skill_value = ParagraphStyle(
    "SkillValue", fontSize=9.5, leading=13,
)


def link(url, text):
    return f'<a href="{url}" color="#{LINK_BLUE.hexval()[2:]}">{text}</a>'


def section_heading(title):
    return [
        Spacer(1, 4),
        Paragraph(title, style_section),
        HRFlowable(width="100%", thickness=0.8, color=BLACK, spaceAfter=4),
    ]


def company_block(company, location, role, dates, techs, bullets, company_url=None):
    elements = []
    company_text = link(company_url, company) if company_url else company
    elements.append(Table(
        [[Paragraph(company_text, style_company), Paragraph(location, style_normal)]],
        colWidths=["70%", "30%"],
        style=TableStyle([
            ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]),
    ))
    elements.append(Table(
        [[Paragraph(role, style_role), Paragraph(dates, style_normal)]],
        colWidths=["70%", "30%"],
        style=TableStyle([
            ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]),
    ))
    elements.append(Paragraph(techs, style_tech))
    for b in bullets:
        elements.append(Paragraph(b, style_bullet, bulletText="\u2022"))
    elements.append(Spacer(1, 4))
    return elements


def build():
    doc = SimpleDocTemplate(
        OUTPUT, pagesize=A4,
        leftMargin=18 * mm, rightMargin=18 * mm,
        topMargin=16 * mm, bottomMargin=16 * mm,
    )
    story = []

    # ── Header ──
    story.append(Paragraph("Abhijit Mohanty", style_name))
    story.append(Paragraph(
        f'{link("https://abhijitmohanty.com", "abhijitmohanty.com")} &middot; '
        f'{link("https://github.com/mohantyabhijit", "github.com/mohantyabhijit")} &middot; '
        f'Singapore',
        style_subheader,
    ))

    # ── Experience ──
    story.extend(section_heading("Experience"))

    story.extend(company_block(
        "Grab", "Singapore",
        "Senior Software Engineer \u2013 Backend", "Jun 2022 \u2013 Present",
        "Golang \u00b7 MySQL \u00b7 FastAPI \u00b7 Claude Sonnet \u00b7 Apache Kafka",
        [
            "Architected and developed a centralized reconciliation platform unlocking end-to-end visibility of 25M+ transactions daily.",
            "Led real-time cross-organisation integrations with banks and consumer-facing applications, increasing annual revenue by USD 3.5 million.",
            "Migrated critical applications from GCP to AWS with zero downtime \u2014 20% cost savings and 4\u00d7 performance improvement.",
            "Developed Snowflake MCP used by 10+ engineers to perform data analysis in natural language via their IDE.",
            "Created an OnCall helper bot using LLMs and Chain of Thought prompting, reducing time to triage issues by 40%.",
        ],
        company_url="https://grab.com",
    ))

    story.extend(company_block(
        "UST Global", "India \u00b7 (acquired Advalent Corporation)",
        "Senior Software Engineer \u2013 Platform Systems", "Apr 2020 \u2013 Jun 2021",
        "Java \u00b7 Spring Boot \u00b7 MySQL",
        [
            "Led development of a high-reliability healthcare insurance system, scaling to 50K+ users and USD 6 million in annual revenue.",
            "Upgraded and migrated the entire monolithic application to Java 11 in one week, ensuring backward compatibility and zero production incidents.",
            "Designed a custom file ingestion framework, cutting integration time from 5 days to 1 day via reusable parsing architecture.",
        ],
    ))

    story.extend(company_block(
        "Lothal Labs", "India",
        "Frontend Engineer \u2013 E-commerce Platform", "Jan 2019 \u2013 Apr 2020",
        "React Native \u00b7 Redux \u00b7 AdobeXD",
        [
            "Joined as first engineering hire; designed end-to-end app user journeys.",
            "Led UI/UX design and created a reusable internal design library to standardize patterns and accelerate delivery.",
            "Developed and tested cross-platform React Native mobile app (iOS/Android) with Redux-based state management.",
        ],
    ))

    story.extend(company_block(
        "Mindfire Solutions", "India",
        "Software Engineer", "Jul 2016 \u2013 Dec 2018",
        "Java \u00b7 Spring Boot \u00b7 jQuery \u00b7 Bootstrap \u00b7 MySQL",
        [
            "Delivered end-to-end web application for finance analysts, reducing manual reporting from 24 hours to 6 hours.",
            "Led a team of 6 developers and interfaced directly with clients for requirement gathering.",
        ],
    ))

    # ── Education ──
    story.extend(section_heading("Education"))
    story.append(Table(
        [[
            Paragraph("<b>National University of Singapore</b>", style_normal),
            Paragraph("Singapore", style_normal),
        ]],
        colWidths=["70%", "30%"],
        style=TableStyle([
            ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]),
    ))
    story.append(Table(
        [[
            Paragraph("<i>Master of Technology, Software Engineering</i> &middot; CAP 4.41/5.00", style_normal),
            Paragraph("2021 \u2013 2022", style_normal),
        ]],
        colWidths=["70%", "30%"],
        style=TableStyle([
            ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]),
    ))

    # ── Skills ──
    story.extend(section_heading("Skills"))
    skills = [
        ("Languages", "Golang, Java, JavaScript"),
        ("Frontend", "React, Redux, jQuery, Bootstrap"),
        ("Cloud", "AWS (EKS, Redshift), GCP (GKE, BigQuery), Apache Kafka"),
        ("Databases", "MySQL, DynamoDB, Redshift, BigQuery"),
        ("Backend", "Spring Boot, REST, Hibernate, Microservices"),
        ("Tools", "Git, Docker, Maven, Jenkins, Kubernetes"),
    ]
    for label, value in skills:
        story.append(Table(
            [[Paragraph(label, style_skill_label), Paragraph(value, style_skill_value)]],
            colWidths=[70, None],
            style=TableStyle([
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]),
        ))

    # ── Projects ──
    story.extend(section_heading("Projects"))

    # Personal ChatGPT
    story.append(Table(
        [[Paragraph("<b>Personal ChatGPT</b>", style_normal), Paragraph("2024", style_normal)]],
        colWidths=["70%", "30%"],
        style=TableStyle([
            ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]),
    ))
    story.append(Paragraph("Secure, full-stack personal ChatGPT instance with custom front end and local hosting.", style_normal))
    story.append(Paragraph("Ollama \u00b7 Llama 3.1 \u00b7 Go \u00b7 React", style_tech))
    story.append(Paragraph("Implemented backend and frontend with locally running LLMs.", style_bullet, bulletText="\u2022"))
    story.append(Spacer(1, 4))

    # Centralized Video Gateway
    story.append(Table(
        [[Paragraph("<b>Centralized Video Gateway</b>", style_normal), Paragraph("2022", style_normal)]],
        colWidths=["70%", "30%"],
        style=TableStyle([
            ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]),
    ))
    story.append(Paragraph("Full-stack web app to onboard and manage IP camera feeds across enterprise zones.", style_normal))
    story.append(Paragraph("Won Best Internship Project among 200+ students at NUS.", style_normal))
    story.append(Paragraph("React \u00b7 Java \u00b7 WebRTC", style_tech))
    story.append(Paragraph(
        "Built low-latency live video gateway managing CCTV feeds at scale, replacing proprietary licensed software and saving $50K+ annually.",
        style_bullet, bulletText="\u2022",
    ))
    story.append(Spacer(1, 4))

    # abhijitmohanty.com
    story.append(Table(
        [[Paragraph(f'<b>{link("https://abhijitmohanty.com", "abhijitmohanty.com")}</b>', style_normal),
          Paragraph("2026", style_normal)]],
        colWidths=["70%", "30%"],
        style=TableStyle([
            ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]),
    ))
    story.append(Paragraph(
        "Personal blog and portfolio built with Hugo, deployed via GitHub Actions with manual approval for production.",
        style_normal,
    ))
    story.append(Paragraph("Hugo \u00b7 GitHub Actions \u00b7 DigitalOcean \u00b7 Apache", style_tech))
    story.append(Spacer(1, 4))

    # plugsandsockets.org
    story.append(Paragraph(
        f'<b>{link("https://plugsandsockets.org", "plugsandsockets.org")}</b>', style_normal,
    ))
    story.append(Paragraph(
        "Reference resource for global electrical plug and socket standards \u2014 outlet types, voltage, and frequency by country.",
        style_normal,
    ))

    doc.build(story)
    print(f"Generated {OUTPUT}")


if __name__ == "__main__":
    build()

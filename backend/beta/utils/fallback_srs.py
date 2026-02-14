"""
Build minimal SRS section dicts from form payload so we can always generate a .docx
when the AI path fails or API key is missing.
"""
from typing import Dict, Any, List


def _pi(inputs: dict) -> dict:
    return inputs.get("project_identity") or {}


def _sc(inputs: dict) -> dict:
    return inputs.get("system_context") or {}


def _fs(inputs: dict) -> dict:
    return inputs.get("functional_scope") or {}


def _nfr(inputs: dict) -> dict:
    return inputs.get("non_functional_requirements") or {}


def _sec(inputs: dict) -> dict:
    return inputs.get("security_and_compliance") or {}


def _tp(inputs: dict) -> dict:
    return inputs.get("technical_preferences") or {}


def _long_problem_paragraph(problem: str, domain: str, app_type: str) -> str:
    problem_text = (problem or "").strip()
    if not problem_text:
        problem_text = (
            f"The current {domain or 'business'} workflow relies on fragmented tools and manual coordination, "
            "which creates operational delays, data inconsistencies, and limited visibility across teams."
        )
    return (
        f"{problem_text} This SRS defines a structured {app_type or 'software'} solution that centralizes core operations, "
        "standardizes workflows, improves data quality, and supports auditable execution across key departments. "
        "The platform is designed for maintainability, secure role-based access, and progressive enhancement as usage scales."
    )


def _feature_requirements(feature_name: str) -> List[dict]:
    fname = feature_name or "Core Feature"
    return [
        {"description": f"The system shall provide a complete {fname.lower()} workflow with create, validate, update, and close actions."},
        {"description": f"The system shall enforce role-based access and approval checkpoints for {fname.lower()} operations."},
        {"description": f"The system shall persist all {fname.lower()} transactions with timestamps and actor identifiers for traceability."},
        {"description": f"The system shall expose filtered views and reports for {fname.lower()} to support monitoring and decision-making."},
    ]


def build_minimal_sections(inputs: dict) -> Dict[str, Any]:
    """Build minimal section dicts from form data for generate_srs_document."""
    pi = _pi(inputs)
    sc = _sc(inputs)
    fs = _fs(inputs)
    nfr = _nfr(inputs)
    sec = _sec(inputs)
    tp = _tp(inputs)

    project_name = pi.get("project_name", "Project")
    problem = pi.get("problem_statement", "")
    target_users = pi.get("target_users") or []
    core_features = fs.get("core_features") or []
    primary_flow = fs.get("primary_user_flow") or ""
    domain = sc.get("domain", "")

    introduction_section = {
        "title": "1. Introduction",
        "purpose": {
            "title": "1.1 Purpose",
            "description": _long_problem_paragraph(problem, domain, app_type=sc.get("application_type", "")),
        },
        "intended_audience": {
            "title": "1.2 Intended Audience",
            "audience_groups": target_users if isinstance(target_users, list) else [str(target_users)],
        },
        "project_scope": {
            "title": "1.3 Project Scope",
            "description": (
                f"The solution delivers a centralized {domain or 'enterprise'} platform with secure user access, "
                "modular service boundaries, measurable SLAs, and operational reporting. It includes business process automation, "
                "data governance controls, and API-ready integration support. Items that are not explicitly listed in this specification "
                "remain out of scope for the current release."
            ),
            "included": core_features if isinstance(core_features, list) else [str(core_features)],
            "excluded": [
                "Direct replacement of unrelated legacy tools outside defined domain boundaries",
                "Custom integrations not listed in technical preferences",
                "Unapproved feature expansions outside the release objective",
            ],
        },
        "document_conventions": {"title": "1.4 Document Conventions", "conventions": ["IEEE 830-1998 style"]},
        "references": {"title": "1.5 References", "references": []},
    }

    app_type = sc.get("application_type", "")
    overall_description_section = {
        "title": "2. Overall Description",
        "product_perspective": {
            "title": "2.1 Product Perspective",
            "description": (
                f"The product is a {app_type or 'web-based'} platform operating in the {domain or 'general'} domain. "
                "It serves as a unified control point for business workflows, combining secure identity, transaction lifecycle handling, "
                "reporting, and integration readiness. The architecture is designed to support phased rollout, future scaling, and clear "
                "separation between UI, service, and data concerns."
            )[:1000],
        },
        "product_features": {
            "title": "2.2 Product Features",
            "features": core_features if isinstance(core_features, list) else [str(core_features)],
        },
        "user_classes_and_characteristics": {
            "title": "2.3 User Classes and Characteristics",
            "user_classes": [
                {
                    "user_class": u,
                    "characteristics": "Uses role-specific modules and dashboards relevant to assigned responsibilities.",
                    "responsibilities": "Perform domain operations, review records, and track workflow status.",
                    "skills": "Basic process knowledge and familiarity with secure web applications.",
                }
                for u in (target_users if isinstance(target_users, list) else [str(target_users)])
            ],
        },
        "operating_environment": {
            "title": "2.4 Operating Environment",
            "environments": [
                "Modern web browsers (Chrome, Edge, Firefox)",
                "Containerized API services with managed cloud runtime",
                "Managed database service with backup and monitoring",
            ],
        },
        "design_and_implementation_constraints": {
            "title": "2.5 Design and Implementation Constraints",
            "constraints": [
                "All sensitive operations must be authenticated and authorized",
                "APIs should remain backward compatible within the major release",
                "Document generation and reporting should complete within acceptable SLA limits",
            ],
        },
        "user_documentation": {
            "title": "2.6 User Documentation",
            "documents": [
                "Administrator setup and role configuration guide",
                "Operations handbook for day-to-day usage",
                "Troubleshooting and escalation reference",
            ],
        },
        "assumptions_and_dependencies": {
            "title": "2.7 Assumptions and Dependencies",
            "assumptions": [
                "Stakeholders provide complete business rules and approval logic",
                "Users have stable internet connectivity and modern browser support",
            ],
            "dependencies": [
                "Email delivery provider for notifications and review loops",
                "Database availability for persistent records and audit trails",
            ],
        },
    }

    features_list = core_features if isinstance(core_features, list) else [str(core_features)]
    system_features_section = {
        "title": "System Features",
        "features": [
            {
                "feature_name": f if isinstance(f, str) else f"Feature {i+1}",
                "description": (
                    f"This capability enables end-to-end handling of {f if isinstance(f, str) else f'Feature {i+1}'} "
                    "with validation, role-aware actions, and auditable state transitions."
                ) if i > 0 else (
                    f"{primary_flow or 'Primary user flow is orchestrated through authenticated workflows, role-based actions, and persistent tracking.'}"
                ),
                "stimulus_response": [],
                "functional_requirements": _feature_requirements(f if isinstance(f, str) else f"Feature {i+1}"),
                "structured_requirements": {
                    "inputs": "Authenticated user context, validated payload, and policy constraints.",
                    "outputs": "Persisted transaction result, status update, and user-visible confirmation.",
                    "acceptance_criteria": "Operation completes successfully with validation, authorization, and audit logging.",
                },
            }
            for i, f in enumerate(features_list)
        ],
    }

    def _interface(title: str, desc: str) -> dict:
        return {
            "title": title,
            "description": desc,
            "interface_diagram": {"diagram_type": "mermaid", "code": "flowchart LR\n    A[System] --> B[External]"},
        }

    external_interfaces_section = {
        "title": "4. External Interface Requirements",
        "user_interfaces": _interface(
            "4.1 User Interfaces",
            "Responsive web interface with role-specific dashboards, controlled forms, and guided workflows.",
        ),
        "hardware_interfaces": _interface(
            "4.2 Hardware Interfaces",
            "Compatible with standard workstation environments and cloud-hosted runtime infrastructure.",
        ),
        "software_interfaces": _interface(
            "4.3 Software Interfaces",
            f"Backend stack: {tp.get('preferred_backend') or 'TBD'}. Data layer: {tp.get('database_preference') or 'TBD'}. Integrates with notification and document services.",
        ),
        "communication_interfaces": _interface(
            "4.4 Communication Interfaces",
            "Secure HTTPS-based REST APIs with token authentication, request validation, and structured error handling.",
        ),
    }

    perf = nfr.get("performance_expectation", "Normal")
    scale = nfr.get("expected_user_scale", "100-1k")
    nfr_section = {
        "title": "Non-Functional Requirements",
        "performance_requirements": {
            "title": "Performance",
            "requirements": [
                {"description": f"System performance target: {perf} under expected user scale {scale}.", "rationale": "User-specified baseline."},
                {"description": "Primary API operations should return within acceptable interactive latency for standard workloads.", "rationale": "Usability and productivity."},
                {"description": "Report and document generation pipelines should provide progress status and deterministic completion behavior.", "rationale": "Operational reliability."},
            ],
        },
        "safety_requirements": {
            "title": "Safety",
            "requirements": [
                {"description": "Critical operations must validate business rules before persisting state changes.", "rationale": "Prevent invalid transactions."},
                {"description": "System should provide safe rollback/retry behavior for failed asynchronous operations.", "rationale": "Data consistency."},
            ],
        },
        "security_requirements": {
            "title": "Security",
            "requirements": [
                {"description": "Authentication required." if sec.get("authentication_required") else "Authentication as needed.", "rationale": "Security."},
                {"description": "Role-based authorization must be enforced at API and workflow layers.", "rationale": "Access control."},
                {"description": "Sensitive data should be protected in transit and at rest.", "rationale": "Compliance and risk reduction."},
            ],
        },
        "quality_attributes": {
            "title": "Quality",
            "requirements": [
                {"description": "Maintainable module boundaries and clear service contracts.", "rationale": "Long-term extensibility."},
                {"description": "Observable runtime behavior with logs, status endpoints, and workflow events.", "rationale": "Supportability."},
            ],
        },
    }

    glossary_section = {
        "sections": [
            {"title": "Terms", "terms": [{"term": "SRS", "definition": "Software Requirements Specification"}, {"term": project_name, "definition": "This system."}]}
        ]
    }

    assumptions_section = {
        "title": "Assumptions",
        "assumptions": [
            {"description": "Stakeholders have agreed on the problem statement and scope.", "impact": "Scope clarity."},
            {"description": f"Target users: {', '.join(target_users) if isinstance(target_users, list) else target_users}.", "impact": "Audience."},
        ],
    }

    risk_analysis = [
        {
            "risk": "Service downtime during peak business operations",
            "probability": "Medium",
            "impact": "High",
            "mitigation": "Add health checks, retries, and monitored deployment pipeline.",
        },
        {
            "risk": "Unauthorized access to sensitive records",
            "probability": "Low",
            "impact": "High",
            "mitigation": "Enforce RBAC, strong token controls, and audit logs.",
        },
        {
            "risk": "Data inconsistency across integrated modules",
            "probability": "Medium",
            "impact": "Medium",
            "mitigation": "Use validation rules and transactional update patterns.",
        },
    ]

    return {
        "introduction_section": introduction_section,
        "overall_description_section": overall_description_section,
        "system_features_section": system_features_section,
        "external_interfaces_section": external_interfaces_section,
        "nfr_section": nfr_section,
        "glossary_section": glossary_section,
        "assumptions_section": assumptions_section,
        "risk_analysis": risk_analysis,
    }

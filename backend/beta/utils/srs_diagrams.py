"""
Generate distinct Mermaid diagrams for a proper SRS:
- System Context Diagram (2.1 Product Perspective)
- System Architecture Diagram (3)
- Use Case Diagram (4 Functional Requirements)
- User Workflow Diagram (5)
- Security Flow Diagram (7)
- Entity Relationship Diagram (8 Data Requirements)
"""
from typing import Dict, Any, List


def _users(inputs: dict) -> List[str]:
    u = inputs.get("project_identity", {}).get("target_users") or []
    return u if isinstance(u, list) else [str(u)]


def _features(inputs: dict) -> List[str]:
    f = inputs.get("functional_scope", {}).get("core_features") or []
    return f if isinstance(f, list) else [str(f)]


def _project_name(inputs: dict) -> str:
    return (inputs.get("project_identity") or {}).get("project_name", "System")


def _safe_label(value: str, max_len: int = 28) -> str:
    text = (value or "").replace('"', "'").replace("\n", " ").strip()
    return text[:max_len] if text else "N/A"


def _domain(inputs: dict) -> str:
    return (inputs.get("system_context") or {}).get("domain", "Business")


def _app_type(inputs: dict) -> str:
    return (inputs.get("system_context") or {}).get("application_type", "Web Application")


def system_context_diagram(inputs: dict) -> str:
    """System Context Diagram: central system and external entities with data flows."""
    title = _safe_label(_project_name(inputs), 34)
    domain = _safe_label(_domain(inputs), 24)
    users = _users(inputs)[:5] or ["User", "Admin"]
    nodes = [
        'EXT1["Email/SMS Gateway"]',
        'EXT2["Payment/3rd-Party API"]',
        'EXT3["Reporting/BI Tool"]',
        f'SYS["{title}<br/>{domain} Domain"]',
    ]
    for i, u in enumerate(users):
        label = _safe_label(str(u), 24)
        nodes.append(f'E{i}["{label}"]')
    lines = []
    for i, _ in enumerate(users):
        uid = f"E{i}"
        lines.append(f'    {uid} -->|Requests/Actions| SYS')
        lines.append(f'    SYS -->|Responses/Notifications| {uid}')
    lines.extend([
        "    SYS -->|Alerts/Updates| EXT1",
        "    SYS <-->|Secure API Calls| EXT2",
        "    SYS -->|Exported Insights| EXT3",
    ])
    return "flowchart LR\n" + "\n".join(nodes) + "\n" + "\n".join(lines)


def system_architecture_diagram(inputs: dict) -> str:
    """Layered architecture: Presentation, Application, Data, External."""
    app_type = _safe_label(_app_type(inputs), 26)
    backend = _safe_label((inputs.get("technical_preferences") or {}).get("preferred_backend", "Backend Service"), 26)
    db = _safe_label((inputs.get("technical_preferences") or {}).get("database_preference", "Primary Database"), 24)
    deploy = _safe_label((inputs.get("technical_preferences") or {}).get("deployment_preference", "Cloud/On-Prem"), 24)
    return f"""flowchart TB
    subgraph Presentation["Presentation Layer ({app_type})"]
        UI[User Interface]
        BFF[Client Gateway]
    end
    subgraph Application["Application Layer"]
        API[{backend}]
        AUTH[Auth & Access Control]
        CORE[Core Services]
    end
    subgraph Data["Data Layer"]
        DB[({db})]
        CACHE[(Cache/Session Store)]
        AUDIT[(Audit Logs)]
    end
    subgraph External["External Integration ({deploy})"]
        EXT[Third-party APIs]
        OBS[Monitoring & Alerts]
    end
    UI --> BFF
    BFF --> API
    API --> AUTH
    API --> CORE
    CORE --> DB
    CORE --> CACHE
    AUTH --> DB
    CORE --> AUDIT
    CORE <-->|REST/Events| EXT
    CORE --> OBS"""


def use_case_diagram(inputs: dict) -> str:
    """Use case style: actors and use cases (flowchart approximation)."""
    users = _users(inputs)[:4] or ["User", "Admin"]
    features = _features(inputs)[:8] or ["Use system"]
    def safe(s):
        return _safe_label(s, 30)
    lines = ["flowchart LR", "    subgraph Actors", "        direction TB"]
    for i, u in enumerate(users):
        lines.append(f'        A{i}["{safe(str(u))}"]')
    lines.extend(["    end", "    subgraph UseCases"])
    for i, f in enumerate(features[:6]):
        lines.append(f'        UC{i}["{safe(str(f))}"]')
    lines.append("    end")
    for i in range(min(len(users), 3)):
        for j in range(min(len(features), 3)):
            lines.append(f"    A{i} --> UC{j}")
    return "\n".join(lines)


def user_workflow_diagram(inputs: dict) -> str:
    """User workflow: login -> validate -> dashboard -> actions -> results."""
    return """flowchart LR
    A([User starts session]) --> B[Authenticate]
    B --> C{Valid credentials?}
    C -->|No| D[Show error and retry]
    D --> B
    C -->|Yes| E[Open role-based dashboard]
    E --> F[Select module]
    F --> G[Submit action/request]
    G --> H[Business validation]
    H --> I[Persist data & trigger events]
    I --> J[Render result/report]
    J --> K{More actions?}
    K -->|Yes| F
    K -->|No| L([Logout])"""


def security_flow_diagram(inputs: dict) -> str:
    """Security: authentication and authorization flow."""
    sensitive = (inputs.get("security_and_compliance") or {}).get("sensitive_data_handling", False)
    sensitive_label = "Encrypt Sensitive Data" if sensitive else "Standard Data Protection"
    return """flowchart LR
    U([Client/User]) --> A[Submit credentials]
    A --> B{Identity verified?}
    B -->|No| C[Reject & throttle]
    B -->|Yes| D[Issue token/session]
    D --> E[Attach token to request]
    E --> F{Authorized role/policy?}
    F -->|No| G[Block action & audit]
    F -->|Yes| H[Permit operation]
    H --> I[Validate payload]
    I --> J[[SENSITIVE_LABEL]]
    J --> K[Write immutable audit trail]
    K --> L([Success response])""".replace("[[SENSITIVE_LABEL]]", f"[{sensitive_label}]")


def data_erd_diagram(inputs: dict) -> str:
    """Entity-Relationship diagram: core entities and relationships."""
    return f"""erDiagram
    USER ||--o{{ SESSION : has
    USER ||--o{{ ROLE_ASSIGNMENT : mapped_to
    ROLE ||--o{{ ROLE_ASSIGNMENT : grants
    USER ||--o{{ TRANSACTION : performs
    TRANSACTION ||--o{{ AUDIT_LOG : records
    ENTITY ||--o{{ TRANSACTION : changes
    USER {{
        int id PK
        string name
        string email
        string status
    }}
    SESSION {{
        int id PK
        int user_id FK
        string token_hash
        datetime created_at
        datetime expires_at
    }}
    ROLE_ASSIGNMENT {{
        int id PK
        int user_id FK
        int role_id FK
    }}
    ROLE {{
        int id PK
        string name
        string permission_set
    }}
    ENTITY {{
        int id PK
        string entity_type
        string reference_code
        datetime updated_at
    }}
    TRANSACTION {{
        int id PK
        int user_id FK
        int entity_id FK
        string action
        datetime created_at
    }}
    AUDIT_LOG {{
        int id PK
        int transaction_id FK
        string event_type
        datetime timestamp
    }}"""


def sequence_diagram(inputs: dict) -> str:
    """Sequence diagram: typical object interaction for a core feature."""
    users = _users(inputs)
    actor = _safe_label(users[0] if users else "User", 15)
    return f"""sequenceDiagram
    participant U as {actor}
    participant FE as Frontend
    participant API as Backend API
    participant DB as Database
    participant EXT as External Service

    U->>FE: Initiates Action
    FE->>API: POST /resource
    API->>AUTH: Validate Token
    AUTH-->>API: Token Valid
    API->>DB: Query Data
    DB-->>API: Return Record
    alt Cache Miss
        API->>EXT: Fetch Supplemental Data
        EXT-->>API: Data Payload
    end
    API->>DB: Update State
    DB-->>API: Success
    API-->>FE: 200 OK (JSON)
    FE-->>U: Updates UI Component"""


def state_diagram(inputs: dict) -> str:
    """State diagram: lifecycle of a core entity (e.g. Order, Ticket)."""
    return """stateDiagram-v2
    [*] --> Draft
    Draft --> Submitted: User Finalizes
    Submitted --> Processing: System Picks Up
    Processing --> AwaitingApproval: High Value?
    AwaitingApproval --> Approved: Admin Reviews
    AwaitingApproval --> Rejected: Admin Denies
    Approved --> Fulfillment
    Processing --> Fulfillment: Standard Flow
    Fulfillment --> Completed: Delivery Confirmed
    Completed --> [*]
    Rejected --> Draft: User Edits
    Fulfillment --> Cancelled: User Cancels"""


def ui_local_diagram(inputs: dict) -> str:
    """Abstract UI Wireframe using Mermaid quadrant chart or flowchart."""
    # Using flowchart to simulate a wireframe layout
    title = _safe_label(_project_name(inputs), 20)
    return f"""flowchart TB
    subgraph Browser["Browser Window - {title}"]
        direction TB
        Header["[ Logo | Navigation Menu | User Profile ]"]
        subgraph Body["Main Content Area"]
            direction LR
            Sidebar["[ Dashboard | Reports | Settings ]"]
            Content["[ Data Overview Charts | Recent Activity Table | Quick Actions ]"]
        end
        Footer["[ Copyright | Links | Contact ]"]
    end
    Header --- Body
    Body --- Footer
    style Browser fill:#f9f9f9,stroke:#333,stroke-width:2px,color:#000
    style Header fill:#e1e1e1,stroke:#666,stroke-dasharray: 5 5
    style Sidebar fill:#eee,stroke:#999
    style Content fill:#fff,stroke:#333,stroke-width:1px
    style Footer fill:#e1e1e1,stroke:#none"""


def get_all_srs_diagrams(inputs: dict) -> Dict[str, str]:
    """Return all 6 Mermaid diagram codes keyed by diagram type."""
    return {
        "system_context": system_context_diagram(inputs),
        "system_architecture": system_architecture_diagram(inputs),
        "use_case": use_case_diagram(inputs),
        "user_workflow": user_workflow_diagram(inputs),
        "security_flow": security_flow_diagram(inputs),
        "data_erd": data_erd_diagram(inputs),
        "sequence_diagram": sequence_diagram(inputs),
        "state_diagram": state_diagram(inputs),
        "ui_local_diagram": ui_local_diagram(inputs),
    }

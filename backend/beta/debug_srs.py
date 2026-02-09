import sys
import os
import asyncio
from pathlib import Path

# Add project root to path
# backend/beta/debug_srs.py -> backend/beta -> backend -> root (2 levels up)
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

print(f"DEBUG: project_root = {project_root}")
print(f"DEBUG: sys.path[0] = {sys.path[0]}")

from backend.beta.utils.srs_document_generator import generate_srs_document
from backend.beta.utils.fallback_srs import build_minimal_sections

# Dummy Inputs
inputs = {
    "project_identity": {
        "project_name": "Debug Project",
        "author": ["Debug Author"],
        "organization": "Debug Org",
        "problem_statement": "Debug problem statement.",
        "target_users": ["Admin", "User"],
        "live_link": "http://localhost",
        "project_id": "123"
    },
    "system_context": {
        "application_type": "Web App",
        "domain": "Debug Domain"
    },
    "functional_scope": {
        "core_features": ["Login", "Logout"],
        "primary_user_flow": "Login -> Logout"
    },
    "non_functional_requirements": {
        "expected_user_scale": "100-1k",
        "performance_expectation": "Normal"
    },
    "security_and_compliance": {
        "authentication_required": True,
        "sensitive_data_handling": False,
        "compliance_requirements": []
    },
    "technical_preferences": {
        "preferred_backend": "Node",
        "database_preference": "Mongo",
        "deployment_preference": "AWS"
    },
    "output_control": {
        "srs_detail_level": "Enterprise-grade"
    }
}

async def run_debug():
    print("Starting debug generation...")
    try:
        sections = build_minimal_sections(inputs)
        print("Minimal sections built.")
        
        # Mock image paths (using existing files or empty)
        base_dir = Path("./backend/beta/static").resolve()
        image_paths = {
            "system_context": str(base_dir / "debug_system_context.png"),
            "system_architecture": str(base_dir / "debug_system_architecture.png")
        }
        
        # Ensure static dir exists
        base_dir.mkdir(exist_ok=True, parents=True)
        
        # Create dummy images if not exist
        for p in image_paths.values():
            if not os.path.exists(p):
                with open(p, "wb") as f:
                    f.write(b"") # Empty file is enough to test existence check, but docx generation might need valid image?
                    # Actually docx generation might fail on invalid image. Let's see.
        
        output_path = "./debug_output.docx"
        
        print(f"Generating document at {output_path}...")
        charts = [] # No charts for now
        
        # Call the generator
        generate_srs_document(
            project_name="Debug Project",
            introduction_section=sections["introduction_section"],
            overall_description_section=sections["overall_description_section"],
            system_features_section=sections["system_features_section"],
            external_interfaces_section=sections["external_interfaces_section"],
            nfr_section=sections["nfr_section"],
            glossary_section=sections["glossary_section"],
            assumptions_section=sections["assumptions_section"],
            image_paths=image_paths,
            output_path=output_path,
            authors=["Debug Author"],
            organization="Debug Org"
        )
        print("Generation successful!")
    except Exception as e:
        print(f"CRASHED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(run_debug())

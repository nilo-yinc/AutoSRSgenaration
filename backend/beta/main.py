from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from google.adk.sessions import InMemorySessionService
import uuid
from backend.beta.agents.introduction_agent import create_introduction_agent 
from backend.beta.agents.overall_description_agent import create_overall_description_agent 
from backend.beta.agents.system_features_agent import create_system_features_agent
from backend.beta.agents.external_interfaces_agent import create_external_interfaces_agent
from backend.beta.agents.nfr_agent import create_nfr_agent
from backend.beta.agents.glossary_agent import create_glossary_agent
from backend.beta.agents.assumptions_agent import create_assumptions_agent
from backend.beta.schemas.srs_input_schema import SRSRequest
from backend.beta.utils.globals import (
    create_session ,
    create_runner ,
    create_prompt ,
    generated_response ,
    get_session ,
    clean_and_parse_json,
    clean_interface_diagrams,
    render_mermaid_png)
from google.adk.agents import SequentialAgent , ParallelAgent
from pathlib import Path
import os
import time
from datetime import datetime
from backend.beta.utils.srs_document_generator import generate_srs_document
from backend.beta.utils.model import API_KEY_CONFIGURED
from backend.beta.utils.fallback_srs import build_minimal_sections
from backend.beta.utils.srs_diagrams import get_all_srs_diagrams

today = datetime.today().strftime("%m/%d/%Y")

app = FastAPI()

app.mount(
    "/static",
    StaticFiles(directory="backend/beta/static"),
    name="static"
)


templates = Jinja2Templates(directory="backend/beta/templates")

session_service_stateful = InMemorySessionService()


async def create_srs_agent():
     
    # Using Parallel execution with Gemini Pro (better rate limits)
    first_agent = SequentialAgent(
          name = "first_agent",
          sub_agents = [
               ParallelAgent(
                    name = "first_parallel_agent",
                    sub_agents = [
                         create_introduction_agent(),
                         create_overall_description_agent(),
                         create_system_features_agent(),
                         create_external_interfaces_agent(),
                         create_nfr_agent()
                    ],
                    description = "This agent handles the generation of the Introduction and Overall Description sections of the SRS document."
               )
          ]
     )

    second_agent = SequentialAgent(
          name = "second_agent",
          sub_agents = [
               ParallelAgent(
                   name = "finalization_agent",
                   sub_agents = [
                       create_glossary_agent(),
                       create_assumptions_agent()
                   ],
                   description = "This agent handles the generation of the Glossary and Assumptions sections of the SRS document."
               )
          ]
     )

    
    return first_agent , second_agent











@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse(
        "home.html",
        {"request": request}
    )


@app.get("/download_srs/{filename}")
async def download_srs(filename: str):
    """Serve the generated SRS .docx for download. Filename e.g. ProjectName_SRS.docx."""
    if not filename.endswith(".docx") or ".." in filename or "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    base = Path("./backend/beta/generated_srs").resolve()
    path = (base / filename).resolve()
    if not path.is_file() or base not in path.parents:
        raise HTTPException(status_code=404, detail="Document not found")
    return FileResponse(path, filename=filename, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")


def _ensure_output_dir():
    Path("./backend/beta/generated_srs").mkdir(exist_ok=True, parents=True)


def _generate_doc_from_sections(
    inputs: dict,
    introduction_section: dict,
    overall_description_section: dict,
    system_features_section: dict,
    external_interfaces_section: dict,
    nfr_section: dict,
    glossary_section: dict,
    assumptions_section: dict,
    image_paths: dict = None,
) -> str:
    """Build image_paths (if not provided) and call generate_srs_document. Returns path to .docx."""
    project_name = inputs["project_identity"]["project_name"]
    author_list = inputs["project_identity"]["author"]
    organization_name = inputs["project_identity"]["organization"]
    output_path = f"./backend/beta/generated_srs/{project_name}_SRS.docx"
    if image_paths is None:
        image_paths = {
            "user_interfaces": Path(f"./backend/beta/static/{project_name}_user_interfaces_diagram.png"),
            "hardware_interfaces": Path(f"./backend/beta/static/{project_name}_hardware_interfaces_diagram.png"),
            "software_interfaces": Path(f"./backend/beta/static/{project_name}_software_interfaces_diagram.png"),
            "communication_interfaces": Path(f"./backend/beta/static/{project_name}_communication_interfaces_diagram.png"),
        }
    return generate_srs_document(
        project_name=project_name,
        introduction_section=introduction_section,
        overall_description_section=overall_description_section,
        system_features_section=system_features_section,
        external_interfaces_section=external_interfaces_section,
        nfr_section=nfr_section,
        glossary_section=glossary_section,
        assumptions_section=assumptions_section,
        image_paths=image_paths,
        output_path=output_path,
        authors=author_list,
        organization=organization_name,
    )


@app.post("/generate_srs")
async def generate_srs(srs_data: SRSRequest):
    inputs = srs_data.dict()
    project_name = inputs["project_identity"]["project_name"]
    _ensure_output_dir()
    
    # Static paths for diagrams
    image_paths = {
        "user_interfaces": Path(f"./backend/beta/static/{project_name}_user_interfaces_diagram.png"),
        "hardware_interfaces": Path(f"./backend/beta/static/{project_name}_hardware_interfaces_diagram.png"),
        "software_interfaces": Path(f"./backend/beta/static/{project_name}_software_interfaces_diagram.png"),
        "communication_interfaces": Path(f"./backend/beta/static/{project_name}_communication_interfaces_diagram.png"),
        "system_context": Path(f"./backend/beta/static/{project_name}_system_context.png"),
        "system_architecture": Path(f"./backend/beta/static/{project_name}_system_architecture.png"),
        "use_case": Path(f"./backend/beta/static/{project_name}_use_case.png"),
        "user_workflow": Path(f"./backend/beta/static/{project_name}_user_workflow.png"),
        "security_flow": Path(f"./backend/beta/static/{project_name}_security_flow.png"),
        "data_erd": Path(f"./backend/beta/static/{project_name}_data_erd.png"),
    }

    srs_content = {}
    
    # 1. AI Expansion Phase
    if API_KEY_CONFIGURED:
        try:
            print(f"🚀 Starting AI Expansion for: {project_name}")
            from google.generativeai import GenerativeModel
            import google.generativeai as genai
            import os
            
            genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
            model = genai.GenerativeModel('gemini-1.5-pro-latest') # Or gemini-pro
            
            prompt = f"""
            You are an expert Senior Technical Writer. I need you to generate a comprehensive IEEE 830 Software Requirements Specification (SRS) in JSON format.
            
            Project Input Data:
            {json.dumps(inputs, indent=2)}
            
            Task:
            Expand the short user inputs into detailed, professional technical content.
            
            Required JSON Structure:
            {{
                "introduction": {{
                    "purpose": "50-75 word professional summary of the system purpose.",
                    "scope": {{
                        "description": "100 word description of what the system does.",
                        "included": ["List of 5-7 in-scope features/modules"],
                        "excluded": ["List of 3 out-of-scope items"]
                    }},
                    "definitions": [
                         {{"term": "Term1", "definition": "Def1"}}
                    ]
                }},
                "overall_description": {{
                    "product_perspective": "Detailed paragraph about how this product fits into the business/environment.",
                    "user_characteristics": [
                        {{"user_class": "Admin", "characteristics": "Technical user..."}},
                        {{"user_class": "End User", "characteristics": "Non-technical..."}}
                    ],
                    "assumptions": ["List of 3-5 technical assumptions"]
                }},
                "functional_requirements": [
                    {{
                        "feature_name": "Feature Name",
                        "description": "2-3 feature description.",
                        "requirements": ["Req 1", "Req 2", "Req 3"]
                    }}
                    // Generate at least 5-6 core features based on input
                ],
                "non_functional_requirements": {{
                    "performance": ["Req 1", "Req 2"],
                    "security": ["Req 1", "Req 2"],
                    "reliability": ["Req 1"]
                }}
            }}
            
            Return ONLY valid JSON.
            """
            
            response = model.generate_content(prompt)
            print("✅ AI Response received")
            cleaned_json = clean_and_parse_json(response.text)
            if cleaned_json:
                srs_content = cleaned_json
            else:
                print("⚠️ Failed to parse AI JSON, falling back.")
                
        except Exception as e:
            print(f"⚠️ AI Expansion failed: {e}")
            import traceback
            traceback.print_exc()

    # 2. Fallback / Merge (If AI failed or returned partial)
    if not srs_content:
        print("ℹ️ Using Minimal Fallback")
        minimal = build_minimal_sections(inputs)
        # Remap minimal structure to our new flattened structure
        srs_content = {
            "introduction": minimal["introduction_section"],
            "overall_description": minimal["overall_description_section"],
             # ... simplified mapping
        }

    # 3. Document Construction Phase
    try:
        # We need to adapt the srs_document_generator to accept this new flattened structure
        # OR remap this new structure to the old function signature.
        # Let's remap for now to minimize breaking changes in generator.
        
        # Mapping 'functional_requirements' list to 'system_features_section' dict
        sys_features = {"features": srs_content.get("functional_requirements", [])}
        
        # Mapping other sections
        intro = srs_content.get("introduction", {})
        overall = srs_content.get("overall_description", {})
        nfr = srs_content.get("non_functional_requirements", {})
        
        # Normalize NFR structure if needed (the prompt asked for simple lists, generator expects dicts)
        # We might need to quickly massage the data here.
        nfr_section = {
            "performance_requirements": {"title": "Performance", "requirements": [{"description": r} for r in nfr.get("performance", [])]},
            "security_requirements": {"title": "Security", "requirements": [{"description": r} for r in nfr.get("security", [])]},
            "safety_requirements": {"title": "Reliability", "requirements": [{"description": r} for r in nfr.get("reliability", [])]},
            "quality_attributes": {"title": "Quality", "requirements": []}
        }

        generated_path = generate_srs_document(
            project_name=project_name,
            introduction_section=intro,
            overall_description_section=overall,
            system_features_section=sys_features,
            external_interfaces_section=clean_interface_diagrams(inputs.get("external_interfaces", {})), # Use inputs or default
            nfr_section=nfr_section,
            glossary_section={},
            assumptions_section={"assumptions": [{"description": a} for a in overall.get("assumptions", [])]},
            image_paths=image_paths,
            output_path=f"./backend/beta/generated_srs/{project_name}_SRS.docx",
            authors=inputs["project_identity"]["author"],
            organization=inputs["project_identity"]["organization"]
        )
        
        return {
            "status": "success",
            "message": "SRS document generated successfully",
            "srs_document_path": generated_path,
            "download_url": f"/download_srs/{Path(generated_path).name}",
        }

    except Exception as e:
        print(f"❌ Document Generation Failed: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))














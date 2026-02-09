"""
Test script to generate a sample SRS document with the enterprise format
"""
import sys
sys.path.append(r'D:\Desktop\AutoSRS\backend')

from beta.utils.srs_document_generator import generate_srs_document

# Sample data similar to RetailFlow example
introduction_section = {
    "title": "1. Introduction",
    "purpose": {
        "title": "1.1 Purpose",
        "description": "Small and medium-sized retail businesses struggle to track inventory levels, sales performance, and stock replenishment in real time. Manual tracking and disconnected tools often lead to stockouts, overstocking, revenue loss, and poor decision-making. This system aims to centralize inventory, sales data, and reporting into a single, easy-to-use digital platform."
    },
    "project_scope": {
        "description": "The system provides a centralized platform for core business operations with secure access, reporting, and monitoring. Features outside the specified requirements are excluded from this version.",
        "included": [
            "User authentication and authorization",
            "Product and inventory management",
            "Sales transaction tracking",
            "Low-stock alerts and notifications",
            "Supplier management",
            "Role-based dashboards",
            "Daily, weekly, and monthly sales reports",
            "Data export (CSV/PDF)",
            "System settings and configuration"
        ]
    },
    "document_conventions": {
        "conventions": []
    }
}

overall_description_section = {
    "title": "2. Overall Description",
    "product_perspective": {
        "title": "2.1 Product Perspective",
        "description": "Web Application in the Retail / Inventory Management / Business Operations domain. Small and medium-sized retail businesses struggle to track inventory levels, sales performance, and stock replenishment in real time. Manual tracking and disconnected tools often lead to stockouts, overstocking, revenue loss, and poor decision-making. This system aims to centralize inventory, sales data, and reporting into a single, easy-to-use digital platform."
    },
    "product_features": {
        "title": "2.2 Product Features",
        "features": [
            "User authentication and authorization",
            "Product and inventory management",
            "Sales transaction tracking",
            "Low-stock alerts and notifications",
            "Supplier management",
            "Role-based dashboards",
            "Daily, weekly, and monthly sales reports",
            "Data export (CSV/PDF)",
            "System settings and configuration"
        ]
    },
    "user_classes_and_characteristics": {
        "title": "2.3 User Classes and Characteristics",
        "user_classes": [
            {"user_class": "Admin"},
            {"user_class": "End User"},
            {"user_class": "Manager"},
            {"user_class": "Analyst"}
        ]
    },
    "operating_environment": {
        "title": "2.4 Operating Environment",
        "environments": ["Standard web/server environment"]
    },
    "design_and_implementation_constraints": {
        "title": "2.5 Design and Implementation Constraints",
        "constraints": []
    },
    "user_documentation": {
        "title": "2.6 User Documentation",
        "documents": ["User manual to be provided"]
    },
    "assumptions_and_dependencies": {
        "title": "2.7 Assumptions and Dependencies",
        "assumptions": [],
        "dependencies": []
    }
}

system_features_section = {
    "features": [
        {"feature_name": "User authentication and authorization"},
        {"feature_name": "Product and inventory management"},
        {"feature_name": "Sales transaction tracking"},
        {"feature_name": "Low-stock alerts and notifications"},
        {"feature_name": "Supplier management"},
        {"feature_name": "Role-based dashboards"},
        {"feature_name": "Daily"},
        {"feature_name": "weekly"},
        {"feature_name": "and monthly sales reports"},
        {"feature_name": "Data export (CSV/PDF)"},
        {"feature_name": "System settings and configuration"}
    ]
}

external_interfaces_section = {
    "user_interfaces": {
        "title": "9.1 User Interface",
        "description": "Web-based responsive interface accessible via modern browsers."
    },
    "hardware_interfaces": {
        "title": "9.2 Application Programming Interfaces",
        "description": "REST APIs for external system integration."
    },
    "communication_interfaces": {
        "description": "REST-based APIs for data communication. Secure API access controls."
    }
}

nfr_section = {
    "performance_requirements": {
        "title": "Performance",
        "requirements": [
            {"description": "Performance: Normal. Scale: 100-1k.", "rationale": "User-specified."}
        ]
    },
    "safety_requirements": {
        "title": "Safety",
        "requirements": []
    },
    "security_requirements": {
        "title": "Security",
        "requirements": [
            {"description": "Authentication required.", "rationale": "Security."}
        ]
    },
    "quality_attributes": {
        "title": "Quality",
        "requirements": []
    }
}

glossary_section = {"sections": []}

assumptions_section = {
    "assumptions": []
}

image_paths = {}

# Generate the document
output_path = r"D:\Desktop\AutoSRS\TestRetailFlow_SRS.docx"
authors = ["Alex Turner", "Sophia Nguyen", "Rahul Verma"]
organization = "NovaEdge Solutions"

generate_srs_document(
    project_name="RetailFlow – Inventory & Sales Management System",
    introduction_section=introduction_section,
    overall_description_section=overall_description_section,
    system_features_section=system_features_section,
    external_interfaces_section=external_interfaces_section,
    nfr_section=nfr_section,
    glossary_section=glossary_section,
    assumptions_section=assumptions_section,
    image_paths=image_paths,
    output_path=output_path,
    authors=authors,
    organization=organization
)

print(f"✅ Test document generated: {output_path}")

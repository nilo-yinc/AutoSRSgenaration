import os
import smtplib
from email.message import EmailMessage
from pathlib import Path
from urllib.parse import quote


def _env(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def _load_smtp_config():
    host = _env("EMAIL_HOST")
    port = int(_env("EMAIL_PORT", "587") or "587")
    user = _env("EMAIL_USER")
    password = _env("EMAIL_PASS")
    sender = _env("SENDER_EMAIL") or user
    if not host or not user or not password or not sender:
        raise ValueError("SMTP configuration missing. Set EMAIL_HOST, EMAIL_USER, EMAIL_PASS, SENDER_EMAIL.")
    return host, port, user, password, sender


def _resolve_docx_path(document_link: str) -> Path | None:
    if not document_link:
        return None
    if "/download_srs/" in document_link:
        filename = document_link.split("/download_srs/", 1)[1]
        # Robust absolute path resolution
        base_dir = Path(__file__).resolve().parents[1] # backend/beta/
        local_path = base_dir / "generated_srs" / filename
        print(f"DEBUG: Resolving doc path for {filename} -> {local_path} (exists: {local_path.exists()})")
        if local_path.exists():
            return local_path
    return None


def send_review_email(
    to_email: str,
    subject: str,
    body: str,
    reply_to: str | None = None,
    document_link: str | None = None,
    project_id: str | None = None,
    review_token: str | None = None,
    is_update: bool = False
):
    host, port, user, password, sender = _load_smtp_config()

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = to_email
    if reply_to:
        msg["Reply-To"] = reply_to

    msg.set_content(body)

    if project_id:
        base_url = _env("BASE_URL", "http://localhost:8000")
        token_q = f"&token={quote(review_token)}" if review_token else ""
        approve_url = f"{base_url.rstrip('/')}/api/workflow/review?projectId={quote(project_id)}&action=APPROVED{token_q}"
        reject_url = f"{base_url.rstrip('/')}/api/workflow/review?projectId={quote(project_id)}&action=REJECTED{token_q}"
        update_notice = "<p><strong>Updated document:</strong> This is an updated version based on your review.</p>" if is_update else ""
        html = f"""
        <html>
          <body style="font-family: sans-serif; color: #333;">
            <div style="background: #0d1117; color: #58a6ff; padding: 20px; border-radius: 8px 8px 0 0; border: 1px solid #30363d;">
                <h2 style="margin: 0;">DocuVerse Studio: { 'Update' if is_update else 'Review' }</h2>
                <p style="margin: 5px 0 0 0; opacity: 0.8;">Stage: [TECHNICAL REVIEW STAGE]</p>
            </div>
            <div style="padding: 20px; border: 1px solid #30363d; border-top: none; border-radius: 0 0 8px 8px;">
                <p>Hello,</p>
                <p>You have been invited to review the Software Requirements Specification (SRS) for: <b>{subject.split(': ')[1] if ': ' in subject else subject}</b></p>
                <p><b>Document link:</b> <a href="{document_link}" style="color: #58a6ff;">{document_link}</a></p>
                {update_notice}
                <div style="background:#f6f8fa;padding:16px;border-radius:8px;border:1px solid #d0d7de; white-space: pre-wrap; font-family: monospace;">{body}</div>
                <p style="margin-top:24px;">
                  <a href="{approve_url}" style="background:#238636;color:white;padding:12px 20px;border-radius:6px;text-decoration:none;margin-right:12px;font-weight: bold;">Approve Document</a>
                  <a href="{reject_url}" style="background:#da3633;color:white;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight: bold;">Request Changes</a>
                </p>
                <hr style="margin-top: 30px; border: 0; border-top: 1px solid #d0d7de;">
                <p style="font-size: 12px; color: #666;">This is an automated delivery from DocuVerse. Please reply directly to this email if you have specific questions for the author.</p>
            </div>
          </body>
        </html>
        """
        msg.add_alternative(html, subtype="html")

    doc_path = _resolve_docx_path(document_link or "")
    if doc_path:
        with open(doc_path, "rb") as f:
            data = f.read()
        msg.add_attachment(
            data,
            maintype="application",
            subtype="vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=doc_path.name
        )

    with smtplib.SMTP(host, port) as server:
        server.ehlo() # Identify self to server
        server.starttls()
        server.ehlo() # Re-identify after TLS
        server.login(user, password)
        server.send_message(msg)

import os
import socket
import smtplib
from email.message import EmailMessage
from pathlib import Path
from urllib.parse import quote
import requests


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


def _absolute_doc_link(document_link: str) -> str:
    if not document_link:
        return document_link
    if document_link.startswith("http://") or document_link.startswith("https://"):
        return document_link
    if document_link.startswith("/"):
        # Prefer the Node backend public URL for DOCX (served from GridFS)
        node_public = _env("NODE_PUBLIC_URL", "")
        if node_public:
            return f"{node_public.rstrip('/')}{document_link}"
        # fallback to BASE_URL (useful in local dev)
        base_url = _env("BASE_URL", "http://localhost:8000")
        return f"{base_url.rstrip('/')}{document_link}"
    return document_link


def _fetch_docx_bytes(document_link: str) -> tuple[bytes, str] | None:
    """
    Fetch DOCX bytes for attachment when local filesystem copy isn't available.
    Returns (bytes, filename) or None.
    """
    if not document_link:
        return None
    abs_link = _absolute_doc_link(document_link)
    filename = None
    if "/download_srs/" in abs_link:
        filename = abs_link.split("/download_srs/", 1)[1].split("?", 1)[0]
    try:
        resp = requests.get(abs_link, timeout=60)
        if resp.status_code != 200:
            return None
        return resp.content, (filename or "srs.docx")
    except Exception:
        return None


def send_review_email(
    to_email: str,
    subject: str,
    body: str,
    reply_to: str | None = None,
    author_name: str | None = None,
    author_email: str | None = None,
    document_link: str | None = None,
    project_id: str | None = None,
    review_token: str | None = None,
    is_update: bool = False
):
    host, port, user, password, sender = _load_smtp_config()

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f"DocuVerse <{sender}>"
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
        author_block = ""
        if author_name or author_email:
            author_display = author_name or "DocuVerse User"
            author_email_display = f" &lt;{author_email}&gt;" if author_email else ""
            author_block = f"<p style='margin: 6px 0 0 0; opacity: 0.9;'><strong>Prepared by:</strong> {author_display}{author_email_display}</p>"
        logo_header = f"""
        <div style="background:#0d1117; border:1px solid #30363d; border-radius:10px; padding:16px 18px; margin-bottom:16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
              <td style="vertical-align:middle;">
                <div style="width:40px; height:40px; border-radius:10px; background:#0a0a0a; border:1px solid rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-weight:700;">
                  <span style="color:#22d3ee; margin-right:1px;">&gt;</span>
                  <span style="color:#ffffff;">_</span>
                </div>
              </td>
              <td style="padding-left:12px; vertical-align:middle; font-family: Arial, sans-serif;">
                <div style="color:#ffffff; font-size:18px; font-weight:800; letter-spacing:-0.2px;">DocuVerse</div>
                <div style="color:#8b949e; font-size:12px; margin-top:6px;">Studio review</div>
              </td>
            </tr>
          </table>
        </div>
        """
        html = f"""
        <html>
          <body style="font-family: sans-serif; color: #333;">
            {logo_header}
            <div style="padding: 20px; border: 1px solid #30363d; border-top: none; border-radius: 0 0 8px 8px;">
                <p>Hello,</p>
                <p>You have been invited to review the Software Requirements Specification (SRS) for: <b>{subject.split(': ')[1] if ': ' in subject else subject}</b></p>
                {author_block}
                <p><b>Document link:</b> <a href="{_absolute_doc_link(document_link or '')}" style="color: #58a6ff;">{_absolute_doc_link(document_link or '')}</a></p>
                {update_notice}
                <div style="background:#f6f8fa;padding:16px;border-radius:8px;border:1px solid #d0d7de; white-space: pre-wrap; font-family: monospace;">{body}</div>
                <p style="margin-top:24px;">
                  <a href="{approve_url}" style="background:#238636;color:white;padding:12px 20px;border-radius:6px;text-decoration:none;margin-right:12px;font-weight: bold;">Approve Document</a>
                  <a href="{reject_url}" style="background:#da3633;color:white;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight: bold;">Request Changes</a>
                </p>
                <hr style="margin-top: 30px; border: 0; border-top: 1px solid #d0d7de;">
                <p style="font-size: 12px; color: #666;">This email was sent by DocuVerse. Replies go to the author via Reply-To.</p>
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
    else:
        fetched = _fetch_docx_bytes(document_link or "")
        if fetched:
            data, filename = fetched
            msg.add_attachment(
                data,
                maintype="application",
                subtype="vnd.openxmlformats-officedocument.wordprocessingml.document",
                filename=filename
            )

    try:
        # Use SMTP_SSL on port 465 — port 587 (STARTTLS) is blocked on Render
        ipv4_addr = socket.getaddrinfo(host, 465, socket.AF_INET)[0][4][0]
        with smtplib.SMTP_SSL(ipv4_addr, 465, timeout=30) as server:
            server.login(user, password)
            server.send_message(msg)
    except smtplib.SMTPException as e:
        raise RuntimeError(f"SMTP error sending email to {to_email}: {e}") from e
    except Exception as e:
        raise RuntimeError(f"Failed to send email to {to_email}: {e}") from e

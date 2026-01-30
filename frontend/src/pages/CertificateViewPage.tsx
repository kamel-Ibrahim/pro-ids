import { useParams, useNavigate } from "react-router-dom";

type Certificate = {
  id: string;
  studentName: string;
  courseTitle: string;
  issuedAt: string;
};

export default function CertificateViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const certificates: Certificate[] = JSON.parse(
    localStorage.getItem("certificates") || "[]"
  );

  const cert = certificates.find((c) => c.id === id);

  if (!cert) {
    return (
      <div
        style={{
          background: "white",
          padding: 24,
          borderRadius: 16,
        }}
      >
        Certificate not found.
      </div>
    );
  }

  return (
    <div
      style={{
        background: "white",
        padding: 40,
        borderRadius: 16,
        maxWidth: 700,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1>Certificate of Completion</h1>
      <p>This certifies that</p>

      <h2>{cert.studentName}</h2>
      <p>has successfully completed</p>

      <h3>{cert.courseTitle}</h3>

      <p style={{ marginTop: 16 }}>Issued on {cert.issuedAt}</p>

      <div style={{ marginTop: 24 }}>
        <button
          onClick={() => alert("Downloading certificate...")}
          style={{
            background: "#2f66e6",
            color: "white",
            padding: "12px 20px",
            borderRadius: 12,
            border: "none",
            fontWeight: 600,
            marginRight: 12,
          }}
        >
          Download PDF
        </button>

        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#e5e7eb",
            padding: "12px 20px",
            borderRadius: 12,
            border: "none",
            fontWeight: 600,
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
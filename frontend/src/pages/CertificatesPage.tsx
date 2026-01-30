import CertificateCard from "../components/CertificateCard";

type Certificate = {
  id: string;
  studentName: string;
  courseTitle: string;
  issuedAt: string;
};

export default function CertificatesPage() {
  const certificates: Certificate[] = JSON.parse(
    localStorage.getItem("certificates") || "[]"
  );

  return (
    <>
      <h2 style={{ marginBottom: 24 }}>Your Certificates</h2>

      {certificates.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: 40,
            borderRadius: 16,
            textAlign: "center",
          }}
        >
          No certificates yet.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {certificates.map((c) => (
            <CertificateCard key={c.id} {...c} />
          ))}
        </div>
      )}
    </>
  );
}
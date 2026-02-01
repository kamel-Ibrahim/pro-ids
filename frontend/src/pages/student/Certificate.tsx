import { useEffect, useState } from "react";
import api from "../../api/api";
import type { ApiResponse } from "../../types/api";

interface Certificate {
  id: number;
  course_title: string;
  issued_at: string;
}

export default function Certificate() {
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    api.get<ApiResponse<Certificate[]>>("/certificates").then((res) => {
      setCerts(res.data.data);
    });
  }, []);

  return (
    <div>
      <h1>Certificates</h1>
      {certs.map((c) => (
        <div key={c.id}>
          {c.course_title} — {new Date(c.issued_at).toLocaleDateString()}
        </div>
      ))}
    </div>
  );
}
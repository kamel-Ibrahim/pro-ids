import { useAuth } from "./useAuth";

export default function DebugAuth() {
  const { user, loading } = useAuth();

  return (
    <pre style={{ fontSize: 12 }}>
      {JSON.stringify({ loading, user }, null, 2)}
    </pre>
  );
}
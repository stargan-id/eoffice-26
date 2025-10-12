import { ProtectedLayout } from "@/components/layout";

export default async function DashboardPage() {
  const activeAlertCount = 5; // Example static count, replace with real data fetching if needed
  return (
    <ProtectedLayout title="Dashboard" subtitle="Dasboard utama aplikasi">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Welcome to the dashboard!</p>
      </div>
    </ProtectedLayout>
  );
}

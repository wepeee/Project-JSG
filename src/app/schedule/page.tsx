import PublicSchedule from "./_components/public-schedule";

export const metadata = {
  title: "Jadwal Produksi",
  description: "Lihat jadwal produksi mingguan dan bulanan",
};

export default function SchedulePage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicSchedule />
    </div>
  );
}
